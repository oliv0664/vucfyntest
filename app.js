var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ready = false;
var teacherClass = require('./public/models/teacherSchema.js');
var mongo = require('mongodb');
//var monk = require('monk');
// var url = 'localhost:27017/vucfyntest'
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var mongoDB = 'mongodb://localhost/vucfyntest';
//var url = 'mongodb://vucfyntest:test@ds237475.mlab.com:37475/vucfyntestdb'


var fs = require('fs');



// var db = monk(url);

// db.then(() => {
//     console.log('Connected correctly to server');
// });




var options = {
    useMongoClient: true
};
mongoose.connect(mongoDB, options);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function(){console.log('connected correctly to db.');  });

Grid.mongo = mongoose.mongo;







//get file with database model/schema for teachers 


// //example of save and retrieve from db 
// // //save new instance of the teachermodel, with specific input 
// var teacher_instance = new teacherModel( { initials: 'lca' } ); 

// //save the teachers instance to database 
// teacher_instance.save(function (err) {
//    if (err) return handleError(err);
//    // saved!
// });


// console.log("test 1");
// var initials = "TEST"; 

// teacherClass.findOneAndUpdate({ initials: initials },
//     {
//         $set: {
//             "totalTests": 5,
//             "tests": [worddictate, nonsense, clozetest, interpret, letter] 
//         }
//     },
//     { upsert: true },
//     function(err, user) {
//         if(err) res.send(err); 
//     }
// );



//console.log(teacher_instance);
//
//console.log("#########");
//
//teacherModel.find(function (err, teachers) {
//    if (err) return console.error(err);
//    console.log(teachers);
//})








// @param (file name from the folder, filename to be called in the db)
// remember .mp4 file extension!
// writeToDB('test.mp3', 'new_audio.mp3'); 


// @param (file name to be called in folder, filename in the db)
// remember .mp4 file extension!
// readFromDB('audio_yourname.mp3', 'new_audio.mp3');



var index = require('./routes/index');

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
    if (isWelcome === '/welcome' && req.url != '/welcome_addinfo') {
        // begin interception
//        console.log('Checking url for teacher ID...')
        req.db = db;
        console.log('Checking db for entries');
        var collection = teacherClass.find();
        
        var idUrl = req.url.slice(8);

        // get the id reference to the collection docs
        collection.find({}).then((docs) => {
            var match = false;

            for (i = 0; i<docs.length; i++) {

                for(j=0; j<docs[i].tests.length; j++){

                    // is technically != the teachers id anymore!.
                    console.log("ID " +docs[i].tests[j]._id);
                    idTeacher = docs[i].tests[j]._id;
                    
                    if (idUrl == idTeacher) {
                        app.set('idTeacher',idTeacher);
                        match = true;
                        console.log('there is a match, now redirecting to the correct page');
                        res.render('welcome', {
                            title: 'main page'
                        });
                        //                   next();
                    }
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
    console.error(err.stack);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
