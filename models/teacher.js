var mongoose = require('mongoose');

var teacherSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    subject :{
        type:String,
        required : true
    }
});

var Teacher = module.exports = mongoose.model('teacher', teacherSchema);

module.exports.createTeacher = function (newTeacher, callback) {
    newTeacher.save(callback);
};

module.exports.fetchTeacher = function (id , callback) {
    return new Promise((resolve,reject)=>{
        Teacher.findById(id, (err,teacher)=>{
            if(err) reject("Failed to fetchteacher : \n"+err);
            else resolve(teacher);
        });
    })
};

