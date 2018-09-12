var express = require('express'),
    User = require('../models/user'),
    router = express.Router();
router.use('/', function (req, res, next) {
   next();
});
router.get('/', function (req, res) {
    res.render('home', {title: "Home | Moodle"});
});
router.get('/queries', function (req, res) {
    res.render('queries', {title:"Queries | Moodle"});
});
router.get('/check', function (req, res) {
    res.render('test');
});
router.get('/test', function (req, res) {
    res.send("My name is rohit");
});
router.get('/cp',(req,res)=>{
    let newUser = new User({
        username: 'admin',
        rank: 1,
        password: 'admin',
        profile_id :""
    });
    User.createUser(newUser,(err,user)=>{
        if(err) throw err;
        else console.log("Admin created");
    })
})


module.exports = router;