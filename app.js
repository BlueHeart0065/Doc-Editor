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

app.get('/',(req,res) => {
    res.render('Doc.ejs')
})

app.post('/autosave', async (req,res) => {
    const {title , content, documentID } = req.body
    if(!content){
        return res.status(400).send('Content is required');
    }
    
    try{

        if(documentID){
            try{
                console.log(documentID);
                let document = await Doc.findById(documentID);
                document.title = title || document.title;
                document.content = content || document.content;
                await document.save();
                res.status(200).send('Content saved');
            }
            catch(error) {
                console.error('Error fetching doc ID ----------->',error);
            }
        }
        else{
            console.log('documentID not found');
            document = new Doc({title, content});
            document.save()
            res.status(200).json({documentID : document._id});
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