var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var mongo = require('mongodb');
var monk = require('monk');
// var url = 'localhost:27017/vucfyntest'
var url = 'mongodb://vucfyntest:test@ds237475.mlab.com:37475/vucfyntestdb'



var db = monk(url);

db.then(() => {
    console.log('Connected correctly to server');
});


var Grid = require('gridfs-stream');
var fs = require('fs');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var idUrl;
var idTeacher;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.db = db;
    next();
});

checkIdInUrl = function (req, res, next) {
    var isWelcome = req.url.slice(0, 8);
    if (isWelcome === '/welcome') {
        // begin interception
        console.log('Checking url for teacher ID...')
        req.db = db;
        var idUrl = req.url.slice(8);
        var collection = db.get('teachers');

        // get the id reference to the collection docs
        collection.find({}).then((docs) => {
            var match = false;

            for (i = 0; i < docs.length; i++) {

                idTeacher = docs[i]._id;

                if (idUrl == idTeacher) {
                    // transfer the idTeacher to the index page somehow?!

                    match = true;
                    console.log('there is a match, now redirecting to the correct page');
                    res.render('welcome', {
                        title: 'main page'
                    });
                    //                   next();
                }
            }
            if (!match) {
                console.log('there is no match, redirect to error');
                res.redirect('/error');
            }
        });


    } else {
        req.db = db;
        next();
    }

};


app.use(checkIdInUrl);

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
