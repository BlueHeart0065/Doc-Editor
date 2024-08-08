const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    title : {type:String},
    content: { type: String}
});

module.exports = mongoose.model('Doc',DocumentSchema);

