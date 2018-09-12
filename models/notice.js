const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

let noticeSchema = new mongoose.Schema({
    title: {
        type: String ,
        required: true 
    },
    content : {
        type: String ,
        required: true 
    },
    for_rank: {
        type: Number,
        required: true 
    },
    branch: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default:Date(),
        required: true
    },
    seen_by : {
        type:Array,
        required:false
    } 
});

let Notice = module.exports = mongoose.model('notice', noticeSchema);

module.exports.createNotice = function (newNotice, callback) {
        newNotice.save(callback);
};

module.exports.fetch = function (query){
    return new Promise(function(resolve, reject){
        Notice.find(query).sort('-date').exec(function(err,notices){
            if(err) reject ("Unable to query Notices : "+err);
            resolve(notices);
        })
    });


};


