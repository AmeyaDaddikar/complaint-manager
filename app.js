const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

mongoose.connect('mongodb://localhost/complaint-manager');
let db = mongoose.connection;


// Check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function (err) {
    console.log(err);
});

// Init app
const app = express();
app.use(expressValidator());
// Express Validator
// var api = express.Router();
// api.use(expressValidator())

// Bring in models
let Complaints = require('./models/complaints');

// Load View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// Express Session Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});



// ======================ROUTES=========================
// Home Route
app.get('/', function (req, res) {
    Complaints.find({}, function (err, complaints) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index', {
                title: 'complaints',
                complaints: complaints
            });
        }
    });
});

// Route Files
let complaints = require('./routes/complaints');
app.use('/complaints', complaints);

// Starting server
app.listen(3000, function () {
    console.log('Server Listening on port 3000');
})
