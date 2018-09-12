var mongoose = require('mongoose');

var subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    sub_code : {
        type: Number,
        required: true
    }
});

var Subject = module.exports = mongoose.model('subject', subjectSchema);
Subject.create = function (newSubject, callback) {

};



module.exports.fetchSubject = function (subject){
    switch (subject)
    {
        case '31':
            return "Engineering Mathematics III";
            break;
        case '32':
            return "Integrated Circuits";
            break;
        case '33':
            return "Control System";
            break;
        case '34':
            return "Analog Communications";
            break;
        case '35':
            return "Object Oriented Programming";
            break;
        case '36':
            return "Employability Skill Development";
            break;
    }
};