const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Doc = require('./models/Doc');
const bodyParser = require('body-parser');

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

app.get('/docs',async (req,res) => {
    const docs = await Doc.find({});
    res.render('Index.ejs', {docs});
})

app.get('/docs/:id', async (req,res) => {
    const id = req.params.id;
    const doc = await Doc.findById(id);
    res.render('Doc.ejs', {doc});
})

app.get('/docs/new', async (req,res) => {
    res.render('New.ejs');
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