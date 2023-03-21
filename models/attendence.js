const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendenceSchema = new Schema({

    course: {type: String},

    date: {type: String},

    attList : [String]
    
}, { timestamps: true });


const attendence = mongoose.model('attendence', attendenceSchema);
module.exports = attendence;