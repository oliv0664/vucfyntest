var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var mongo = require('mongodb');
// var monk = require('monk');

var mongoose = require('mongoose'); 
var mongoDB = 'mongodb://localhost/vucfyntest'; 

var url = 'localhost:27017/vucfyntest'
//var url = 'mongodb://vucfyntest:test@ds237475.mlab.com:37475/vucfyntestdb'

var Grid = require('gridfs-stream');
var fs = require('fs');



// var db = monk(url);

// db.then(() => {
//     console.log('Connected correctly to server');
// });



var options = { useMongoClient: true }; 
mongoose.connect(mongoDB, options); 
mongoose.Promise = global.Promise; 
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'MongoDB connection error:')); 

var teacherModel = require('./public/models/teacherModel.js'); 

var teacher_instance = new teacherModel({ initials: 'oni', totalTests: 3, tests: ['a', 'b'] }); 

teacher_instance.save(function(err) {
    if(err) return handleError(err); 
    // saved!
}); 

console.log(teacher_instance); 




Grid.mongo = mongoose.mongo; 

function writeToDB(nameInFolder, nameInDB) {
    db.once('open', function() {
        console.log('- Connection Open -'); 
        var gfs = Grid(db.db); 

        var filePath = path.join(__dirname, 'public/readFrom/' + nameInFolder); 

        var writestream = gfs.createWriteStream({
            filename: nameInDB
        }); 

        fs.createReadStream(filePath).pipe(writestream); 

        writestream.on('close', function(file) {
            console.log(file.filename + ' Written to DB'); 
        }); 
    }); 
}


// ****** REMEMBER! .mp4 extension on the filenames!! ********
function readFromDB(nameInFolder, nameInDB) {
    db.once('open', function() {
        console.log('- Connection Open -'); 
        var gfs = Grid(db.db); 

        var fs_write_stream = fs.createWriteStream(path.join(__dirname, 'public/writeTo/' + nameInFolder));

        var readstream = gfs.createReadStream({
            filename: nameInDB
        });
        
        readstream.pipe(fs_write_stream); 
        fs_write_stream.on('close', function() {
            console.log('File has been written fully!'); 
        }); 
    }); 
}


// @param (file name from the folder, filename to be called in the db)
// remember .mp4 file extension!
// writeToDB('morslilledreng.mp4', 'new_video.mp4'); 


// @param (file name to be called in folder, filename in the db)
// remember .mp4 file extension!
// readFromDB('video_with_my_name.mp4', 'new_video.mp4'); 



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
