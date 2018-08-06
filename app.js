var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ready = false;
var teacherClass = require('./public/models/teacherSchema.js');
var studentClass = require('./public/models/studentSchema.js');
var mongo = require('mongodb');
//var monk = require('monk');
// var url = 'localhost:27017/vucfyntest'
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var http = require("http");

// var mongoDB = 'mongodb://localhost/vucfyntest';
var mongoDB = 'mongodb://vucfyntest:test@ds237475.mlab.com:37475/vucfyntestdb';



var fs = require('fs');



// var db = monk(url);

// db.then(() => {
//     console.log('Connected correctly to server');
// });


// DENNE KODE ER KUN TIL AT HOLE HEROKU OPPE
//setInterval(function() {
//    http.get("http://sheltered-hamlet-93311.herokuapp.com");
//}, 300000);



var options = {
    useMongoClient: true
};
mongoose.connect(mongoDB, options);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function() { console.log('connected correctly to db.'); });

Grid.mongo = mongoose.mongo;

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

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    req.db = db;
    next();
});



checkIdInUrl = function(req, res, next) {
    var isWelcome = req.url.slice(0, 8);
    if (isWelcome === '/welcome' && req.url != '/welcome_addinfo') {
        // begin interception
        //        console.log('Checking url for teacher ID...')
        req.db = db;
        console.log('Checking db for entries');
        var collection = teacherClass.find();

        var idUrl = req.url.slice(8);
        var teacherID;
        // get the id reference to the collection docs
        collection.find({}).then((docs) => {
            var match = false;

            for (i = 0; i < docs.length; i++) {

                for (j = 0; j < docs[i].tests.length; j++) {

                    // is technically != the teachers id anymore!.
                    console.log("ID " + docs[i].tests[j]._id);
                    idTeacher = docs[i].tests[j]._id;
                    console.log(idUrl);
                    if (idUrl == idTeacher) {
                        teacherID = idTeacher;
                        match = true;
                        break;
                        //                   next();
                    }
                    if (match) { break; }
                }
            }

            if (match) {

                app.set('idTeacher', teacherID);
                console.log('there is a match, now redirecting to the correct page');

                var kursistModules;

                teacherClass.find().where({
                    'tests._id': teacherID
                }).exec(function(err, teacher) {
                    if (err) {
                        res.send(err);
                    } else {
                        console.log(teacher);
                        // find relevnt teacher data to student 
                        console.log(teacher[0].tests[0].modules[0].moduleType);
                        // make student object with data
                        var id_serv = JSON.stringify(teacherID);
                        console.log("01");
                        for (var i = 0; i < teacher[0].tests.length; i++) {
                            console.log("02");
                            var id_db = JSON.stringify(teacher[0].tests[i]._id);
                            console.log(id_db);
                            console.log(id_serv);
                            if (id_db == id_serv) {
                                console.log("11");
                                kursistModules = setupStudentModules(teacher[0].tests[i].modules);
                                console.log("22");
                                res.render('welcome', {
                                    title: 'main page',
                                    username: teacherID,
                                    kursistModules: kursistModules
                                });
                            }
                        }
                    }
                });

            } else {
                console.log('there is no match, redirect to error');
                res.redirect('/error');
            }
        });


    }


    // else if(isWelcome === '/test_da'){
    // 	  req.db = db;
    //     console.log('Checking db for entries');
    //     var collection = teacherClass.find();

    //     var idUrl = req.url.slice(8);
    //     console.log("ID URL " + idUrl); 
    //     // get the id reference to the collection docs
    //     collection.find({}).then((docs) => {
    //         var match = false;

    //         for (i = 0; i<docs.length; i++) {

    //             for(j=0; j<docs[i].tests.length; j++){

    //                 // is technically != the teachers id anymore!.
    //                 console.log("ID " +docs[i].tests[j]._id);
    //                 idTeacher = docs[i].tests[j]._id;

    //                 if (idUrl == idTeacher) {
    //                     app.set('idTeacher',idTeacher);
    //                     match = true;
    //                     console.log('there is a match, now redirecting to the correct page');




    //                     //code to get answers from student db

    //                     studentClass.find({
    //                         "teacherID": idTeacher
    //                     }, function(err, student) {
    //                         if(err) {
    //                             console.log(err); 
    //                         } else {
    //                             console.log("TEACHER ID FROM STUDENT DB ", student);

    //                             var studentIDs = []; 

    //                             for(var i=0; i<student.length; i++) {
    //                                 studentIDs.push(student[i].studentID); 
    //                             }

    //                             res.render('test_data', {
    //                                 title: 'main page',
    //                                 content: {
    //                                     idTeacher: idTeacher,
    //                                     studentIDs: studentIDs
    //                                 }
    //                             });
    //                         }
    //                     }); 




    //                 }
    //             }

    //         }
    //         if (!match) {
    //             console.log('there is no match, redirect to error');
    //             res.redirect('/error');
    //         }
    //     });


    // } 
    else {
        req.db = db;
        next();
    }

};

function setupStudentModules(modulesArray) {
    var tempArray = [];
    for (var i = 0; i < modulesArray.length; i++) {
        console.log("MODULETYPE " + modulesArray[i].moduleType);
        tempArray.push(modulesArray[i].moduleType + '_kursist');
    }
    tempArray.push('finalpage');
    return tempArray;
}


app.use(checkIdInUrl);

app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.error(err.stack);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;