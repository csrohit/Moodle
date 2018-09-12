var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
   username :{
       type :String,
       required : true
   } ,
   password :{
       type:String,
       required:true
   } ,
    rank:{
       type:Number,
        required:true
    },
   profile_id :{
       type:String,
       required:true
   }
});

var User = module.exports = mongoose.model('user', userSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};
module.exports.hashP = function (password, callback) {
    var Hash;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, callback);
    });
};

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};
module.exports.fetchRank = (rank)=>{
    switch(rank){
        case 0: return 'Student';break;
        case 1: return 'Teacher';break;
        case 2:return 'Admin';break;
    }
}
module.exports.findAll = function (callback) {
User.find({},callback);
};