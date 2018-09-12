var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    branch : {
        type : String,
        required : true
    },
    year : {
        type : String,
        required : true
    },
    roll_no : {
        type : Number,
        required : true
    }
});

var Student = module.exports = mongoose.model('student', studentSchema);

module.exports.createStudent = function (newStudent, callback) {
    newStudent.save(callback);
};

module.exports.fetchStudent = function (id , callback) {
    return new Promise((resolve,reject)=>{
        Student.findById(id, (err,student)=>{
            if(err) reject (err);
            else resolve(student);
        });

    })
};

module.exports.fetchBranch = function (branch){
    switch (branch)
    {
        case '1':
            return "Electronics and Telecommunications";
            break;
        case '2':
            return "Information Technology";
            break;
        case '3':
            return "Computer Science";
            break;
    }
};
module.exports.fetchYear = function (year){
    switch (year)
    {
        case '1':
            return "FE";
            break;
        case '2':
            return "SE";
            break;
        case '3':
            return "TE";
            break;
        case '4':
            return "BE";
            break;
    }
};
module.exports.getName = (user_id)=>{
return new Promise((resolve,reject)=>{
    Student.findOne({_id:user_id},(err,user)=>{
        if(err) reject ("Failed to find the name of the user : \n" +err);
        else{
            resolve({_id:user._id,name:user.name});
        }
    })
})
}
