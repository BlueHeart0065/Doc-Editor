const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Doc = require('./models/Doc');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const ExpressError = require('./utils/ExpressError');
const {Server} = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('assets'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/ProjectDocs')
.then(() => {
    console.log('MongoDB Connected');
})
.catch(err => {
    console.log('Connection error', err);
})

app.use(session({
    secret : 'mysecretistatya',
    resave: false,
    saveUninitialized : true,
    store : MongoStore.create({mongoUrl : 'mongodb://localhost:27017/ProjectDocs'}),
    cookie : {maxAge: 60000*60*24}
}))

// Redirect root to docs
app.get('/', (req, res) => {
    res.redirect('/docs');
});

app.get('/docs',async (req,res) => {
    const sortQuery = req.query.q;
    let sortCriteria;

    if (sortQuery === 'A-Z') {
        sortCriteria = { title: 1 }; 
    } else if (sortQuery === 'Date modified') {
        sortCriteria = { updatedAt: -1 }; 
    } else {
        sortCriteria = { createdAt: -1 }; 
    }

    try{
        const docs = await Doc.find({}).sort(sortCriteria);
        res.render('Index.ejs', {docs, searchedDocs : null});
    }
    catch(error){
        console.error(error);
        res.status(500).send('Error loading documents');
    }
})

app.get('/docs/search', async(req,res) => {
    try{
        const searchTerm = req.query.q;
        if(searchTerm){
            const docs = await Doc.find({
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } }, 
                    { content: { $regex: searchTerm, $options: 'i' } }
                ]
            });
            console.log(docs);
            res.json(docs)
            console.log('Search completed');
        }
        else{
            res.redirect('/docs')
        }
    }
    catch(error){
        console.error('Failed search --------->', error)
        res.status(500).json({ error: 'Search failed' });
    }
});

// Helper function to generate unique document title
async function generateUniqueTitle(baseTitle = 'Untitled Document') {
    try {
        // First check if the base title exists
        const existingDoc = await Doc.findOne({ title: baseTitle });
        if (!existingDoc) {
            return baseTitle;
        }
        
        // If base title exists, find all documents with similar names
        const existingDocs = await Doc.find({
            title: { $regex: `^${baseTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( \\d+)?$`, $options: 'i' }
        }).sort({ title: 1 });
        
        let maxNumber = 0;
        const basePattern = new RegExp(`^${baseTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( (\\d+))?$`, 'i');
        
        existingDocs.forEach(doc => {
            const match = doc.title.match(basePattern);
            if (match) {
                const number = match[2] ? parseInt(match[2], 10) : 0;
                maxNumber = Math.max(maxNumber, number);
            }
        });
        
        return `${baseTitle} ${maxNumber + 1}`;
    } catch (error) {
        console.error('Error generating unique title:', error);
        // Fallback to timestamp-based naming
        return `${baseTitle} ${Date.now()}`;
    }
}

app.post('/docs/new', async (req,res) => {
    try{
        const uniqueTitle = await generateUniqueTitle('Untitled Document');
        const document = new Doc({title : uniqueTitle, content : ''});
        await document.save();
        req.session.documentId = document.id;
        res.redirect(`/docs/${document.id}/edit`);
    }
    catch(error){
        console.error('Failed to create and save new blank document ---->',error );
        res.status(500).send('Error creating document');
    }
});

app.get('/docs/:id/edit', async (req,res) => {
    try{
        const id = req.params.id;
        const doc = await Doc.findById(id);
        if (!doc) {
            return res.status(404).send('Document not found');
        }
        res.render('Edit.ejs', {doc : doc, id : id});
    }
    catch(error){
        console.error('Failed to find the document--->', error);
        res.status(500).send('Error loading document');
    }
})

app.post('/docs/:id/edit',async (req,res) => {
    const {title , content, documentId } = req.body;
    try{
        let document;
        if(documentId){
            try{
                console.log(documentId);
                document = await Doc.findById(documentId);
                if (!document) {
                    return res.status(404).json({ error: 'Document not found' });
                }
                
                // Check if title has changed and ensure uniqueness
                if (title && title !== document.title) {
                    // Check if another document already has this title
                    const existingDoc = await Doc.findOne({ 
                        title: title, 
                        _id: { $ne: documentId } // Exclude current document
                    });
                    
                    if (existingDoc) {
                        // Generate unique title if duplicate found
                        document.title = await generateUniqueTitle(title);
                    } else {
                        document.title = title;
                    }
                } else if (title) {
                    document.title = title;
                }
                
                const currentDate = new Date();
                document.content = content;
                document.updatedAt = currentDate;
                await document.save();
                console.log('Autosaved')
                
                // Emit real-time updates to other users
                io.to(documentId).emit('document-update', {
                    title: document.title,
                    content: document.content,
                    updatedAt: document.updatedAt
                });
                
                return res.status(200).json({ 
                    success: true, 
                    message: 'Document saved',
                    title: document.title // Send back the actual title in case it was modified
                });
            }
            catch(error) {
                console.error('Error fetching doc ID ----------->',error);
                return res.status(500).json({ error: 'Error saving document' });
            }
        }
        else{
            console.log('documentID not found, Changes not saved');
            return res.status(400).json({ error: 'Document ID not provided' });
        }
    }
    catch(error){
        console.error('Autosave failed ----------->',error);
        res.status(500).json({ error: 'Error saving document' });
    }
});

// Add delete document route
app.delete('/docs/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Doc.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Document deleted' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Error deleting document' });
    }
});

// Add duplicate document route
app.post('/docs/:id/duplicate', async (req, res) => {
    try {
        const id = req.params.id;
        const originalDoc = await Doc.findById(id);
        
        if (!originalDoc) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        // Generate unique title for the duplicated document
        const baseTitle = `${originalDoc.title} (Copy)`;
        const uniqueTitle = await generateUniqueTitle(baseTitle);
        
        const duplicatedDoc = new Doc({
            title: uniqueTitle,
            content: originalDoc.content,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await duplicatedDoc.save();
        res.status(200).json({ 
            success: true, 
            message: 'Document duplicated successfully',
            newDocId: duplicatedDoc._id
        });
    } catch (error) {
        console.error('Error duplicating document:', error);
        res.status(500).json({ error: 'Error duplicating document' });
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-document', (documentId) => {
        socket.join(documentId);
        console.log(`User joined document: ${documentId}`);
        
        // Notify other users in the same document
        socket.to(documentId).emit('user-connected', `A user has joined document ${documentId}`);
    });

    socket.on('send-changes', (documentId, delta) => {
        socket.to(documentId).emit('receive-changes', delta);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000,() => {
    console.log('App listening at 3000')
})