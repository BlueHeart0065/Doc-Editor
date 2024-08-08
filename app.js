const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Doc = require('./models/Doc');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

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
    try{
        const docs = await Doc.find({});
        res.render('Index.ejs', {docs});
    }
    catch(error){
        console.error(error);
    }
})

app.post('/docs/new', async (req,res) => {
    try{
        const document = new Doc({title : '', content : ''});
        await document.save();
        req.session.documentId = document.id;
        res.json({documentId : document.id});
        // res.redirect(`/docs/${document.id}/edit`);
    }
    catch(error){
        console.error('Failed to create and save new blank document ---->',error );
    }
});

app.get('/docs/:id/edit', async (req,res) => {
    try{
        const id = req.params.id;
        const doc = await Doc.findById(id);
        res.render('Edit.ejs', {doc});
    }
    catch(error){
        console.error('Failed to find the document--->', error);
    }
})

app.post('/autosave', async (req,res) => {
    console.log(req.body);
    const {title , content, documentId } = req.body;
    
    try{
        let document;
        if(documentId){
            try{
                console.log(documentId);
                document = await Doc.findById(documentId);
                document.title = title || document.title;
                document.content = content || document.content;
                await document.save();
                return res.status(200).json({documentId : document._id});
            }
            catch(error) {
                console.error('Error fetching doc ID ----------->',error);
            }
        }
        else{
            console.log('documentID not found');
            document = new Doc({title, content});
            document.save();
            res.status(200).json({documentId: document._id});
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