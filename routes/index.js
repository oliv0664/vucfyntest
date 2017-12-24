var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var initials;
var teacherModules = [];
var studentModules = [];
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
    teacherModules = [];
});

router.get('/filepicker', function (req, res, next) {
    res.render('filepicker', {
        title: 'Filepicker'
    });
});

//var initials = "oni";
/*      HER ER ALLE TEACHER SIDERNE       */



/* TEMPLATE */
router.get('/template', function (req, res) {
    var db = req.db;
    var collection = db.get('letter');

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.find({
        'initials': initials
    }, {}, function (e, docs) {
        var docLenght = docs.length;
        res.render('template', {
            "testlist": docs[docLenght - 1],
            title: 'TEMPLATE'
        });
    });
});


/* ALLE FUNKTIONER DER ER TILKNYTTET MAIN */

//henter hjemmesiden 'main' 

router.get('/welcome', function (req, res) {
    res.render('welcome', {
        title: 'main page'
    });
});


router.post('/index_addinfo', function (req, res) {
    // Set our internal DB variable
    var db = req.db;
    // the array MUST be emptied so that no duplicates are psuhed in
    teacherModules = [];
    studentModules = [];
    // Get our form values. These rely on the "name" attributes
    var data = req.body;
    // get the teachers initials and remove them from the data{}
    initials = data.initials;
    delete data.initials;
    // each selected .test_options represents a selected module 

    for (module in data) {
        if (module == "startpage") {
            studentModules.push(module);
        } else {
            console.log(module);
            temp = module.split(' ');
            console.log(temp + " " + temp[0] + " " + temp[1]);
            teacherModules.push(temp[0]);
            studentModules.push(temp[1]);
        }
    }
    teacherModules.push('nextpage');
    studentModules.push('finalpage');

    console.log(teacherModules);
    console.log(studentModules);

    // Set our collection
    var collection = db.get('teachers');

    // Submit to the DB
    collection.insert({
        "initials": initials,
        "totalTests": teacherModules.length,
        "tests": []
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // And forward to success page
            res.redirect(teacherModules[0]);
            teacherModules.shift();
            console.log('next module should be ' + teacherModules[0]);
        }
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET WORDDICTATE */

//henter hjemmesiden 'worddictate_teacher' 
router.get('/worddictate_teacher', function (req, res) {
    res.render('worddictate_teacher', {
        title: 'Orddiktat'
    });
});


router.post('/worddictate_addinfo', function (req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes 
    //var lines = req.body.lines;
    //var files = req.body.files;
    var file = req.body.file;
    var content = req.body.content;

    // Set our collection
    var collection = db.get('teachers');
    // Submit to the DB
    collection.update({
        "initials": initials
    }, {
        "$push": {
            "tests": {
                "type": "orddiktat",
                "file": file,
                "content": JSON.parse(content)
            }
        }

    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // And forward to success page
            res.redirect(teacherModules[0]);
            teacherModules.shift();
            console.log('next module should be ' + teacherModules[0]);
        }
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET NONSENSE*/

router.get('/nonsense_teacher', function (req, res) {
    res.render('nonsense_teacher', {
        title: 'Vrøvleord'
    });
});


router.post('/nonsense_addinfo', function (req, res) {
    var db = req.db;

    var file = req.body.file;
    var content = req.body.content;

    var collection = db.get('teachers');
    collection.update({
        "initials": initials
    }, {
        "$push": {
            "tests": {
                "type": "vrøvleord",
                "file": file,
                "content": JSON.parse(content)
            }
        }
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect(teacherModules[0]); //
            teacherModules.shift();
            console.log('next module should be ' + teacherModules[0]);
        }
    });
});




/* ALLE FUNKTIONER DER ER TILKNYTTET CLOZETEST*/

router.get('/clozetest_teacher', function (req, res) {
    res.render('clozetest_teacher', {
        title: 'Clozetest'
    });
});


router.post('/clozetest_addinfo', function (req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes 
    var file = req.body.file;
    var content = req.body.content;

    // Set our collection
    var collection = db.get('teachers');
    // Submit to the DB
    collection.update({
        "initials": initials
    }, {
        "$push": {
            "tests": {
                "type": "clozetest",
                "file": file,
                "content": JSON.parse(content)
            }
        }
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // And forward to success page

            console.log("clozetest redirect " + teacherModules[0]);
            res.redirect(teacherModules[0]);
            teacherModules.shift();
            console.log('next module should be ' + teacherModules[0]);

        }
    });
});


/* ALLE FUNKTIONER DER ER TILKNYTTET INTERPRET*/

router.get('/interpret_teacher', function (req, res) {
    res.render('interpret_teacher', {
        title: 'Tekstforståelse'
    });
});


router.post('/interpret_addinfo', function (req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes 
    var file = req.body.file;
    var content = req.body.content;
    console.log(content);
    // Set our collection
    var collection = db.get('teachers');

    // Submit to the DB
    collection.update({
        "initials": initials
    }, {
        "$push": {
            "tests": {
                "type": "tekstforståelse",
                "file": file,
                "content": JSON.parse(content)
            }
        }
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // And forward to success page
            res.redirect(teacherModules[0]);
            teacherModules.shift();
            console.log('next module should be ' + teacherModules[0]);
        }
    });
});




/* ALLE FUNKTIONER DER ER TILKNYTTET LETTER*/

router.get('/letter_teacher', function (req, res) {
    res.render('letter_teacher', {
        title: 'Brev'
    });
});


router.post('/letter_addinfo', function (req, res) {
    var db = req.db;

    var file = req.body.file;
    var time = req.body.time;

    var collection = db.get('teachers');
    collection.update({
        "initials": initials
    }, {
        "$push": {
            "tests": {
                "type": "brev",
                "file": file,
                "content": [{
                    "time": time
        }]
            }
        }
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect(teacherModules[0]);
            teacherModules.shift();
            console.log('next module should be ' + teacherModules[0]);
        }
    });
});



/* NEXTPAGE ER EN DUMMY DER SENDER DIG VIDERE TIL KURSISTSIDEN*/

router.get('/nextpage', function (req, res) {
    res.render('nextpage', {
        title: 'Nextpage'
    });
});


router.post('/nextpage', function (req, res) {
    res.redirect(studentModules[0]);
    studentModules.shift();
    console.log('next module should be ' + studentModules[0]);
});









/*      HER ER ALLE PARTICIPANT SIDERNE     */


/* ALLE FUNKTIONER DER ER TILKNYTTET STARTPAGE */

//henter hjemmesiden 'startpage' 
router.get('/startpage', function (req, res) {
    res.render('startpage', {
        title: 'Startside'
    });
});


router.post('/startpage_addinfo', function (req, res) {
    var db = req.db;

    var date = req.body.date_input;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var dys = req.body.dys_select;
    var fam = req.body.fam_select;
    var tong = req.body.tong_input;
    var home = req.body.home_input;

    var collection = db.get('students');

    collection.insert({
        "id": initials,
        "date": date,
        "firstname": firstname,
        "lastname": lastname,
        "is_dyslexic": dys,
        "is_familyDyslexic": fam,
        "mother_tongue": tong,
        "lang_at_home": home,
        "time": "12:00:00",
        "tests": []
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect(studentModules[0]); //"worddictate_participant"
            studentModules.shift();
        }
    });
});


//initials = 'tintin';
var g_moduleCount = 0;

/* ALLE FUNKTIONER DER ER TILKNYTTET WORDDICTATE */

//henter 'worddictate_participant' og finder data i databasen, svarende til de indtastede initialer
router.get('/worddictate_participant', function (req, res) {
    var db = req.db;
    var collection = db.get('teachers');

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.findOne({
        'initials': initials
    }, function (e, docs) {
        console.log('test data from db: ' + docs.tests[g_moduleCount]);
        res.render('worddictate_participant', {
            "data": docs.tests[g_moduleCount],
            title: 'worddictate_participant'
        });
        g_moduleCount++;
    });
});


router.post('/worddictate_addanswer', function (req, res) {
    var db = req.db;

    var answers = req.body.answers;

    var collection = db.get('students');

    collection.update({
        "id": initials
    }, {
        "$push": {
            "tests": {
                "type": "orddiktat",
                "answers": JSON.parse(answers)
            }
        }
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect(studentModules[0]); //"worddictate_participant"
            studentModules.shift();
        }
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET NONSENSE */

//henter 'output' og finder data i databasen, svarende til de indtastede initialer
router.get('/nonsense_participant', function (req, res) {
    var db = req.db;
    var collection = db.get('teachers');

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.findOne({
        'initials': initials
    }, function (e, docs) {
        console.log(docs.tests[g_moduleCount]);
        res.render('nonsense_participant', {
            "data": docs.tests[g_moduleCount],
            title: 'nonsense_participant'
        });
        g_moduleCount++;
    });
});


router.post('/nonsense_addanswer', function (req, res) {
    var db = req.db;

    var answers = req.body.answers;

    var collection = db.get('students');

    collection.update({
        "id": initials
    }, {
        "$push": {
            "tests": {
                "type": "vrøvleord",
                "answers": JSON.parse(answers)
            }
        }
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect(studentModules[0]); //"worddictate_participant"
            studentModules.shift();
        }
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET CLOZETEST */

//henter clozetest_participant og finder data i databasen, svarende til de indtastede initialer
router.get('/clozetest_participant', function (req, res) {
    var db = req.db;
    var collection = db.get('teachers');

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.findOne({
        'initials': initials
    }, function (e, docs) {
        console.log(docs.tests[g_moduleCount]);
        res.render('clozetest_participant', {
            "data": docs.tests[g_moduleCount],
            title: 'clozetest_participant'
        });
        g_moduleCount++;
    });
});


router.post('/clozetest_addanswer', function (req, res) {
    var db = req.db;

    var answers = req.body.answers;

    var collection = db.get('students');

    collection.update({
        "id": initials
    }, {
        "$push": {
            "tests": {
                "type": 'clozetest',
                "answers": JSON.parse(answers)
            }
        }
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect(studentModules[0]); //"worddictate_participant"
            studentModules.shift();
        }
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET INTERPRET */

//henter clozetest_participant og finder data i databasen, svarende til de indtastede initialer
router.get('/interpret_participant', function (req, res) {
    var db = req.db;
    var collection = db.get('teachers');

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.findOne({
        'initials': initials
    }, function (e, docs) {
        console.log(docs.tests[g_moduleCount]);
        res.render('interpret_participant', {
            "data": docs.tests[g_moduleCount],
            title: 'interpret_participant'
        });
        g_moduleCount++;
    });
});


router.post('/interpret_addanswer', function (req, res) {
    var db = req.db;

    var answers = req.body.answers;
    console.log("non parsed " + answers);
    console.log("parsed " + JSON.parse(answers));
    var collection = db.get('students');
    collection.update({
        "id": initials
    }, {
        "$push": {
            "tests": {
                "type": "tekstforståelse",
                "answers": JSON.parse(answers)
            }
        }
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect(studentModules[0]); //"worddictate_participant"
            studentModules.shift();
        }
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET LETTER */

//henter 'output' og finder data i databasen, svarende til de indtastede initialer
router.get('/letter_participant', function (req, res) {
    var db = req.db;
    var collection = db.get('teachers');

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.findOne({
        'initials': initials
    }, function (e, docs) {
        res.render('letter_participant', {
            "data": docs.tests[g_moduleCount],
            title: 'letter_participant'
        });
        g_moduleCount++;
    });
});


router.post('/letter_addanswer', function (req, res) {
    var db = req.db;

    var answers = req.body.answers;

    var collection = db.get('students');

    collection.update({
        "id": initials
    }, {
        "$push": {
            "tests": {
                "type": "brev",
                "answers": JSON.parse(answers)
            }
        }
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect("finalpage");
        }
    });
});

router.get('/finalpage', function (req, res) {
    res.render('finalpage', {
        title: 'finalpage'
    });
});
// TEEEEEEEEEEEEEEEEEEEEST FILE SYSTEM
router.get('/upload', function (req, res) {
    res.render('upload', {
        title: 'Filesystem'
    });
});

router.post('/upload', function (req, res) {

    var soundTrack;
    var db = req.db;
    var collection = db.get('upload');

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // stores the upload in local directory /view 
    form.uploadDir = path.join(__dirname, '../uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
        soundTrack = file;
        console.log('###########', JSON.stringify(file), '##########');
        fs.rename(file.path, path.join(form.uploadDir, "1"));
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        // this is the callback, it can be populated with data eventually 
        var p = JSON.stringify(soundTrack);
        res.end(p);
        console.log('@@@@@@@@@@@', soundTrack, '@@@@@@@');
        console.log('this is p: ' + p);
        console.log('STRRRRIIIIIIING', JSON.stringify(soundTrack));
        collection.insert({
            "audio": p
        }, function (err, doc) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            }
        });
    });

    // parse the incoming request containing the form data
    form.parse(req);

});


module.exports = router;
