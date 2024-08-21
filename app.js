const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Doc = require('./models/Doc');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const ExpressError = require('./utils/ExpressError');

const app = express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('assets'));

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


app.get('/docs',async (req,res) => {
    const sortQuery = req.query.q;

    if (sortQuery === 'A-Z') {
        sortCriteria = { title: 1 }; 
    } else if (sortQuery === 'Date modified') {
        sortCriteria = { updatedAt: -1 }; 
    } else {
        sortCriteria = { createdAt: -1 }; 
    }

    try{
        const docs = await Doc.find({}).sort(sortCriteria);
        res.render('Index.ejs', {docs, serachedDocs : null});
    }
    catch(error){
        console.error(error);
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
            console.log('Reached here');
        }
        else{
            res.redirect('/docs')
        }
    }
    catch(error){
        console.error('Failed search --------->', error)
    }
});

app.post('/docs/new', async (req,res) => {

    try{
        const document = new Doc({title : `Untitled Document`, content : ''});
        await document.save();
        req.session.documentId = document.id;
        res.redirect(`/docs/${document.id}/edit`);
    }
    catch(error){
        console.error('Failed to create and save new blank document ---->',error );
    }
});

app.get('/docs/:id/edit', async (req,res) => {
    try{
        const id = req.params.id;
        const doc = await Doc.findById(id);
        res.render('Edit.ejs', {doc : doc, id : id});
    }
    catch(error){
        console.error('Failed to find the document--->', error);
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
                document.title = title || document.title;
                currentDate = new Date
                document.content = content;
                document.updatedAt = currentDate || document.updatedAt;
                await document.save();
                console.log('Autosaved')
                return res.status(200);
            }
            catch(error) {
                console.error('Error fetching doc ID ----------->',error);
            }
        }
        else{
            console.log('documentID not found, Changes not saved');
        }
    }
    catch(error){
        console.error('Autosave failed ----------->',error);
        res.status(500).send('Error saving document');
    }
});

app.listen(3000,() => {
    console.log('App listening at 3000')
})