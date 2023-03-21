const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({

    class_id: {type: String},

    date : {type: String},

    dname : {type: String},
    uuid : {type: String},
    payload : {type: String},

    
    expireAt: {
        type: Date,
        expires: 43200000000,
        default: Date.now
    }

    // createdAt: { type: Date, expires: '43200', default: Date.now }
    
}, { timestamps: true });

// courseSchema.index({createdAt: 1},{expireAfterSeconds: 43200});
const course = mongoose.model('course', courseSchema);
module.exports = course;

