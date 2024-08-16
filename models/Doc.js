const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    title : {type:String, required: true},
    content: { type: String},
    createdAt : {type : Date, default : Date.now},
    updatedAt : {type : Date, default : Date.now}
});

module.exports = mongoose.model('Doc',DocumentSchema);

