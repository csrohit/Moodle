var mongoose = require('mongoose');

var thingSchema = new mongoose.Schema({
    name :{
        type :String,
        required : true
    }
});

var Thing = module.exports = mongoose.model('thing', thingSchema);



module.exports.update = function(callback){

    Thing.update({_id: "5a422606f7d549701decfc08"}, { $set: { "name" : 'rohit' }}, callback);
    // Thing.updateMany({'name':'rohit'}, { $set: { "name" : 'Chetana' }}, callback);
};
