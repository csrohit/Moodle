const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user'),
    Subject = require('../models/subject'),
    Student = require('../models/student'),
    Notice = require('../models/notice'),
    Post = require('../models/post'),
    Teacher = require('../models/teacher');

passport.use('rohit', new LocalStrategy(function (username, password, done) {
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
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});
router.use('/', isLoggedIn, function (req, res, next) {
    next();
});
router.get('/login', function (req, res) {
    res.render('login', {
        title: "Login | Moodle"
    });
});
router.post('/login', passport.authenticate('rohit', {
    failureRedirect: '/users/login',
    failureFlash: true
}), function (req, res) {
    res.redirect('/users/dashboard');
});
router.get('/logout', function (req, res) {
    req.logout();
    console.log(req.headers);
    if (req.headers.referer === 'http://localhost:3000/users/pwd')
        req.flash('success_msg','Password has been changed successfully');
        else
            req.flash('success_msg', "You have been logged out");
    res.redirect('/users/login');
});
router.get('/dashboard', function (req, res) {
    if (req.user.rank === 2)
        res.render('dashboard', {
            title: "CPanel | Moodle"
        });
    else
        res.render('dashboard', {
            title: "Dashboard | Moodle"
        });
});
router.post('/register', function (req, res) {
    if (req.user.rank !== 2)
        res.redirect('/users/dashboard');
    else {
        let newUser = new User({
            username: req.body.username,
            rank: req.body.rank,
            password: '1234'
        });
        if (newUser.rank === 0) {
            let newStudent = new Student({
                name: req.body.name,
                email: req.body.email,
                branch: req.body.branch,
                year: req.body.year,
                roll_no: req.body.roll_no
            });
            Student.createStudent(newStudent, function (err, student) {
                if (err) throw err;
                newUser.profile_id = student._id;
                User.createUser(newUser, function (err, user) {
                    if (err) throw err;
                    req.flash('success_msg', 'User Registration Successfull.');
                    res.redirect('/users/dashboard');
                });
            });
        } else {
            let newTeacher = new Teacher({
                name: req.body.name,
                email: req.body.email,
                subject: req.body.subject
            });
            Teacher.createTeacher(newTeacher, function (err, teacher) {
                if (err) {
                    throw err;
                }
                newUser.profile_id = teacher._id;
                User.createUser(newUser, function (err, user) {
                    if (err) throw err;
                    req.flash('success_msg', 'You are registered and can now login');
                    res.redirect('/users/dashboard');
                });
            });
        }
    }
});
router.get('/profile', function (req, res) {
    const id = req.user.profile_id,
        rank = req.user.rank;
    if (rank === 1)
        Teacher.fetchTeacher(id)
        .then(teacher=>{
            teacher.subject = Subject.fetchSubject(teacher.subject);
            res.render('profile', {
                title: "Profile | Moodle",
                profile: teacher
            });
        })
        .catch(err=>{
            throw err;
        })
    else if (rank === 2) {
        req.flash('success_msg', "Unable to view profile");
        res.redirect('/users/dashboard');
    } else
        Student.fetchStudent(id)
        .then(student=> {
            let profile = student;
            profile.branch = Student.fetchBranch(student.branch);
            profile.year = Student.fetchYear(student.year);
            res.render('profile', {
                title: "Profile | Mouodle",
                profile: profile
            });
        })
        .catch(err=>{
            throw err;
        });
});
router.get('/subjects', function (req, res) {
    res.render('subjects');
});
router.post('/subjects', function (req, res) {
    let name = req.body.name,
        sub_code = req.body.sub_code;
    let subject = new Subject({
        name: name,
        sub_code: sub_code
    });
    Subject.create(subject, function (err, newsubject) {
        if (err) console.log("Unable to create Subject");
        else {
            console.log(newsubject);
        }
    });
    res.send(req.body);
});
router.get('/getUsers', function (req, res) {
    const auth = req.query.rank;
    if (!auth) {
        res.statusCode = 404;
    }
    if (req.user.rank < auth) { /*  users cannot access data of same rank or higher  (Authorisation for user data)  */
        res.statusCode = 401;
        res.send();
    }
    else {
       findUsers(auth)
            .then(function(data){
                let userdata = [],
                i = 0;
                while (data.length !== 0) {
                    userdata[i++] = {
                        username: data[data.length - 1].username,
                        profile_id: data[data.length - 1]._id
                    };
                    data.length--;
                }
                res.json(userdata);
            })
            .catch(function(err){
                console.log("Error occurred at following : \n" + err);
            });
    }
});
router.get('/user/:id', function (req, res) {
    User.getUserById(req.params.id, function (err, user) {
        if (err) throw err;
        if (user.rank) {
            Teacher.fetchTeacher(user.profile_id)
            .then( teacher=> {
                teacher.subject = Subject.fetchSubject(teacher.subject);
                res.render('profile', {
                    title: "CPanel | Moodle",
                    profile: teacher,
                    username: user.username
                })
                .catch(err=>{ throw err; });
            });
        } else {
            Student.fetchStudent(user.profile_id)
            .then(student=> {
                let profile = student;
                profile.branch = Student.fetchBranch(student.branch);
                profile.year = Student.fetchYear(student.year);
                res.render('profile', {
                    title: "CPanel | Moodle",
                    profile: profile,
                    username: user.username
                });
            })
                .catch(err => { throw err; });
        }

    });
});
router.get('/pwd', function (req, res) {
    res.render('password', {
        title: "Password | Moodle"
    });
});
router.post('/pwd', function (req, res) {
    if (req.user.rank === 2) {
        const authPassword = req.body.authPassword,
              username = req.body.username;
        if (!authPassword || !username) {
            res.send("Invalid or missing credentials.");
        } else {
            User.comparePassword(authPassword, req.user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    User.hashP('1234', function (err, hash) {
                        if (err) throw err;
                        User.updateOne({'username': username}, {$set:{'password':hash}, $inc: {'__v': 1}}, function (err, result) {
                            if (err) throw err;
                            res.send("Password has been reset successfully.");
                        });
                    })
                } else {
                    res.send("Invalid Password.");
                }
            });
        }
    } else {
        const oldP = req.body.oldPassword,
              newP = req.body.newPassword,
              confP = req.body.confPassword;
        if (!newP || !oldP || !confP || (newP !== confP)) {
            req.flash('error_msg', 'missing or invalid credentials');
            res.redirect('/users/pwd');
        } else {
            User.comparePassword(oldP, req.user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    User.hashP(newP, function (err, hash) {
                        if (err) throw err;
                        User.updateOne({'_id': req.user._id}, {$set: {'password': hash},$inc: {'__v': 1}}, function (err, result) {
                            if (err) throw err;
                            // flash message has been set at /users/logout route
                            res.redirect('/users/logout');
                        });
                    })
                } else {
                    req.flash('error_msg', 'password is incorrect');
                    res.redirect('/users/profile');
                }
            });

        }
    }
});
router.get('/notice-board',function (req,res) {
   res.send("Notice board");
});
router.post('/notice',notStudent,function(req, res){
    const title = req.body.title,
          for_rank = req.body.for_rank,
          content = req.body.notice_content,
          branch = req.body.for_rank;
    if(!title || !for_rank || !branch ){
        res.statusCode = 400;
        res.send();
    }
    else{
        console.log(Date.now);
        let notice = new Notice({
            title:title,
            for_rank:for_rank,
           content:content,
            branch:branch,
            date: new Date(),
            seen_by :[req.user._id]
        });
            Notice.createNotice(notice,function(err,newNotice){
                if (err) throw err;
                else{
                    res.send(newNotice);
                    console.log(newNotice);
                }
            })
    }
});
router.get('/notice_board',(req,res)=>{
            Notice.fetch({ 'for_rank': { $lte: req.user.rank }})
                    .then(notices =>{
                        res.render('notice-board',{notices:notices});
                    })
                    .catch(err =>{
                        console.log(err);
                    });
});
router.get('/forum',(req,res)=>{
    const query = req.query.action;
    console.log(query);
    if(query == 'newPost')
    {
        res.render('newPost',{title:"Forum | Moodle"});
    }
    else{
        Post.fetchPosts()
        .then(posts=>{
            res.render('forum', { title: "Forum | Moodle",posts:posts });

        })
        .catch(err=>{
            console.log(err);l
        })
    }
});
router.post('/post',(req,res)=>{
    console.log(req.user.rank);
    let title = req.body.title,
        branch = req.body.branch,
        subject = req.body.subject,
        year = req.body.year,
        rank = req.body.rank,
        desc = req.body.desc;
        let newPost = new Post({
            title: title,
            desc:desc,
            author_id:req.user._id,
            author_rank:req.user.rank,
            subject_id:subject,
            branch:branch,
            year:year
        })
Post.create(newPost)
        .then(post=>{
            res.send(post);
        })
        .catch(err=>{
            res.send(err);
        })

})
router.get('/ajax',(req,res)=>{
    switch(req.query.data){
        case 'comments':{
            Post.fetchComments(req.query.id)
            .then(comments=>{
                res.json(comments);
            })
            .catch(err=>{
                throw err;
            });
            break;
        }
        case 'add':{
            let newComment = req;
            Post.addComment(req.query.id,newComment)
            .then(result=>{
                console.log(result);
            })
            .catch(err=>{
                throw err;
            });
        }
    }
})
router.post('/ajax',(req,res)=>{
    switch(req.query.action){
        case 'add_comment':{
            Student.getName(req.user.profile_id)
            .then(user=>{
                console.log(user)
                let newComment = {
                    txt: req.body.comment_body,
                    author_id : user._id,
                    author_name : user.name
                }
                console.log(newComment);
                Post.addComment(req.query.id,newComment)
                    .then(result => {
                        console.log(result);
                    })
                    .catch(err => {
                        throw err;
                    });
            })
        }
    }
})
router.get('/trial',(req,res)=>{
    var data ={};
     Student.getName(req.user.profile_id).then(user=>{

     })
     .catch(err=>{
         throw err;
     });
    console.log(data);
})

// User Defined functions
function isLoggedIn(req, res, next) {
    console.log(req);
    if (req.isAuthenticated() && req.url === '/login') {
        res.redirect('/users/dashboard');
    } else if (req.isAuthenticated() || req.url==='/apilogin' || req.url === '/login') {
        next();
    } else
        res.redirect('/users/login');
}
function notStudent(req, res, next) {
    if (req.user == 0) {
        req.flash('error_msg',"Uauthorised operation");
        res.redirect('/users/dashboard');
    } else {
        next();
    }
}
function findUsers(auth){
    return new Promise(function (resolve,reject) {
        let query;
        switch (auth) {
            case '2':
            {
                query = {'rank': {$lt: 2}};
                break;
            }
            case '1':
            {
                query = {'rank': {$eq: 1}};
                break;
            }
            case '0':
            {
                 query = {'rank': {$eq: 0}};
                break;
            }
        }
        User.find(query, function (err, users) {
            if (err) reject("Unable to fetch users.\n"+err);
            else resolve(users);
        });
    });
}
module.exports = router;