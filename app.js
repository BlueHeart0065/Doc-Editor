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
    const {title , content} = req.body
    if(!content){
        return res.status(400).send('Content is required');
    }

    try{
        let document = await Doc.findOne({title : title});

        if (document){
            document.content = content;
            await document.save();
        }
        else{
            document = new Doc({title : title,content : content});
            await document.save();
        }

        res.status(200).send('Content saved');
    }
    catch(error) {
        console.error('Error saving content ----------------> ', error);
    }
})

app.listen(3000,() => {
    console.log('App listening at 3000')
})