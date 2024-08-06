const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    title : {type:String, required : true},
    content: { type: String, required: true },
});

module.exports = mongoose.model('Doc',DocumentSchema);

