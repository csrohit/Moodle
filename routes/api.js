const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user'),
    Student = require('../models/student'),
     jwt = require('jsonwebtoken');

    passport.use('api', new LocalStrategy({session:false},function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {
                    message: 'Unknown User'
                });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });
        });
    }));

router.use('/',verifyToken, function (req, res, next) {
    console.log(req.body);
    next();
});


router.get('/profile',(req,res)=>{
    User.getUserById(req.user_id, function (err, user){
        let data={
            username : user.username,
            rank:User.fetchRank(user.rank)
        };
            Student.fetchStudent(user.profile_id)
                .then(user=>{
                    data.name = user.name;
                    data.email = user.email;
                    data.branch = Student.fetchBranch(user.branch);
                    data.year =Student.fetchYear(user.year);
                    data.roll = user.roll_no;
                    res.send(data);
                })
                .catch(e=>{
                        res.send("error occurred");
                }   )         
    })
      
});
router.get('/failed',(req,res)=>{
    res.sendStatus(403);
});
router.post('/', passport.authenticate('rohit', {
    failureRedirect: '/api/failed',
    failureFlash: true
}),(req,res)=>{
    const id = req.user._id;
    jwt.sign({id:id},'secret',(err,token)=>{
        console.log(token);
        res.json({
            token:"Bearer "+token
        });
    })
});
router.post('/verify',(req,res)=>{
    res.send(true);
});
function verifyToken(req, res,next){
    
    let bearerToken = req.headers.authorization;
    if(req.url == "/"){
        next();
    }
    else if(typeof(bearerToken)!== 'undefined'){
        bearerToken = bearerToken.split(' ')[1];
        jwt.verify(bearerToken,'secret',(err,authData)=>{
            if(err) res.sendStatus(403);
            else {
                req.user_id=authData.id; 
                next();
            }
        })
    }
    else{
        res.sendStatus(403);
    }
}

module.exports = router;