var express = require('express'),
    app = express(),
    exphbs = require('express-handlebars'),
    Handlebars = require('handlebars'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require('connect-flash'),
    routes = require('./routes/index'),
    mongoose = require('mongoose'),
    api = require('./routes/api'),
    users = require('./routes/users');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/moodle', { useMongoClient: true });
var db = mongoose.connection;
db.on('connected', function () {
    console.log('Connected to Database');
});
db.on('error', function (error) {
    console.log('Could not Connect to database');
    console.log(error);
});
// Connect Flash
app.use(flash());
// View-Engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());


// Routing
app.use('/', function (req, res,next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user =req.user ||"";
    console.log(req.method + " was made at : " + req.url);
    next();
});
app.use(express.static('public'));
app.use('/users', users);
app.use('/', routes);
app.use('/api', api);

app.listen(3000, function () {
   console.log("Server started on port 3000");
});

// Custom Helpers
Handlebars.registerHelper('ifCond', function (v1,v2,options) {
    if (v1 == v2)
        return options.fn(this);
    else
        return options.inverse(this);
});
Handlebars.registerHelper('exCond', function (v1,v2,options) {
    if (v1 != v2)
        return options.fn(this);
    else
        return options.inverse(this);
});
