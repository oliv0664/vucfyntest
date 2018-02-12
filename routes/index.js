var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var nodemailer = require('nodemailer');

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
router.get('/error', function (req, res, next) {
    res.render('error', {
        title: 'page not found'
    });
});

//var initials = "oni";
/*      HER ER ALLE TEACHER SIDERNE       */



/* TEMPLATE */
//router.get('/template', function (req, res) {
//    var db = req.db;
//    var collection = db.get('letter');
//
//    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
//    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
//    collection.find({
//        'initials': initials
//    }, {}, function (e, docs) {
//        var docLenght = docs.length;
//        res.render('template', {
//            "testlist": docs[docLenght - 1],
//            title: 'TEMPLATE'
//        });
//    });
//});


/* ALLE FUNKTIONER DER ER TILKNYTTET MAIN */

//henter hjemmesiden 'main' 
//console.log("FIRST " + authorizeLink.getId());

function getId() {
    var id = '5a785e4b3867e72b94b2baba';
    return id;
}



//note Luca> getId burde måske have en callback function som andet parameter, så den venter indtil koden fra app.js og authorizeLink.js er done. 
router.get('/welcome' + getId(), function (req, res) {
    //TODO : get logic
    //    var doc = db.get('teachers').findOne({
    //        _id: teacherID
    //    });
    //console.log('THIS IS LUCATEST: ');
    res.render('welcome', {
        title: 'main page'
    });
    //    var temparray = collection
});


var teacherID = '5a785e4b3867e72b94b2baba';
var studentID = 'test';

router.post('/welcome_addinfo', function (req, res) {
    var db = req.db;
    console.log(req);
    studentID = req.body.id;
    console.log(studentID); 
    var collection = db.get('students');
    console.log("third"); 
    console.log(collection); 

    collection.insert({
        "teacherID": teacherID,
        "studentID": studentID
    }, function (err, doc) {
        if (err) {
            console.log("fourth ERROR"); 
            res.send("There was a problem adding the information to the database.");
        } else {
            console.log("fourth SUCCESS"); 
            res.redirect('startpage'); //"worddictate_participant"
            //studentModules.shift();
        }
    });
});

var studentModules = ['worddictate_participant', 'letter_participant']; //'nonsense_participant', 'clozetest_participant', 'interpret_participant', 

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
    console.log(req.body);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var age = req.body.age;
    var mothertong_dk = req.body.mothertong_dk;
    var tong_input = req.body.tong_input;
    var years_in_dk = req.body.years_in_dk;
    var edu_in_dk = req.body.edu_in_dk;
    var pass_test = req.body.pass_test;
    var eg_test = req.body.eg_test;



    var speciel_edu = req.body.speciel_edu;
    var speciel_edu_adult = req.body.speciel_edu_adult;
    var eg_edu = req.body.eg_edu;

    var years_in_edu = req.body.years_in_edu;
    var years_in_edu_home = req.body.years_in_edu_home;
    var exam_finish = req.body.exam_finish;
    var eg_exam = req.body.eg_exam;
    var eg_exam_country = req.body.eg_exam_country;
    var edu_finish = req.body.edu_finish;
    var eg_edu_finish = req.body.eg_edu_finish;
    var eg_edu_finish_country = req.body.eg_edu_finish_country;
    var read_write_con = req.body.read_write_con;
    var eg_con = req.body.eg_con;

    var in_job = req.body.in_job;
    var eg_job = req.body.eg_job;
    var read_write_in_job = req.body.read_write_in_job;
    var eg_read_write_in_job = req.body.eg_read_write_in_job;
    var read_in_job = req.body.read_in_job;
    var write_in_job = req.body.write_in_job;
    var lang_in_job = req.body.lang_in_job;

    var why_fvu = req.body.why_fvu;

    var improvement = req.body.improvement;
    var eg_improvement = req.body.eg_improvement;

    var collection = db.get('students');

    collection.update({
        "studentID": studentID
    }, {
        $set: {
            //"id": initials,
            "firstname": firstname,
            "lastname": lastname,
            "age": age,
            "mothertong_dk": mothertong_dk,
            "tong_input": tong_input,
            "years_in_dk": years_in_dk,
            "edu_in_dk": edu_in_dk,
            "pass_test": pass_test,
            "eg_test": eg_test,
            "speciel_edu": speciel_edu,
            "speciel_edu_adult": speciel_edu_adult,
            "eg_edu": eg_edu,
            "years_in_edu": years_in_edu,
            "years_in_edu_home": years_in_edu_home,
            "exam_finish": exam_finish,
            "eg_exam": eg_exam,
            "eg_exam_country": eg_exam_country,
            "edu_finish": edu_finish,
            "eg_edu_finish": eg_edu_finish,
            "eg_edu_finish_country": eg_edu_finish_country,
            "read_write_con": read_write_con,
            "eg_con": eg_con,
            "in_job": in_job,
            "yeareg_jobs_in_dk": eg_job,
            "read_write_in_job": read_write_in_job,
            "eg_read_write_in_job": eg_read_write_in_job,
            "read_in_job": read_in_job,
            "write_in_job": write_in_job,
            "lang_in_job": lang_in_job,
            "why_fvu": why_fvu,
            "improvement": improvement,
            "eg_improvement": eg_improvement,
            //"time": "12:00:00",
            "tests": []
        }
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            console.log("######## student modules: " + studentModules);
            res.redirect(
                //"worddictate_participant"

                studentModules[0]
            );
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
    console.log("studentModules[0]: " + studentModules[0]);
    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.findOne({
        _id: teacherID
        //        initials: 'TEST2' //5a3fc35311aedd22b0e3de9d
    }, function (e, docs) {
        //        console.log('test data from db: ' + docs.tests[0].content[0].line1);

        res.render('worddictate_participant', {
            "data": docs.tests[0],
            title: 'worddictate_participant'
        });
        g_moduleCount++;
    });
});


router.post('/worddictate_addanswer', function (req, res) {
    var db = req.db;
    console.log(' ************* ' + studentID);
    var answers = req.body.answers;

    var collection = db.get('students');

    collection.update({
        "studentID": studentID
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
            res.redirect(
                //"nonsense_participant"
                studentModules[0]
            );
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
        _id: teacherID
    }, function (e, docs) {
        //console.log(docs.tests[g_moduleCount]);
        res.render('nonsense_participant', {
            "data": docs.tests[1],
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
        "studentID": studentID
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
            res.redirect(
                //"clozetest_participant"
                studentModules[0]
            );
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
        _id: teacherID
    }, function (e, docs) {
        //console.log(docs.tests[g_moduleCount]);
        res.render('clozetest_participant', {
            "data": docs.tests[2],
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
        "studentID": studentID
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
            res.redirect(
                //"interpret_participant"
                studentModules[0]
            );
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
        _id: teacherID
    }, function (e, docs) {
        //console.log(docs.tests[g_moduleCount]);
        res.render('interpret_participant', {
            "data": docs.tests[3],
            title: 'interpret_participant'
        });
        g_moduleCount++;
    });
});


router.post('/interpret_addanswer', function (req, res) {
    var db = req.db;

    var answers = req.body.answers;
    //console.log("non parsed " + answers);
    //console.log("parsed " + JSON.parse(answers));
    var collection = db.get('students');
    collection.update({
        "studentID": studentID
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
            res.redirect(
                //"letter_participant"
                studentModules[0]
            );
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
        _id: teacherID
        //        initials: 'TEST2'

    }, function (e, docs) {
        res.render('letter_participant', {
            "data": docs.tests[4],
            title: 'letter_participant'
        });
        g_moduleCount++;
    });
});

router.post('/letter_addanswer', function (req, res) {
    var db = req.db;

    var answers = req.body.answers;
    console.log(answers);

    var collection = db.get('students');

    collection.update({
        "studentID": studentID
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

var testResult;
router.get('/finalpage', function (req, res) {
    var db = req.db;
    var collection = db.get('students');
    collection.findOne({
        "studentID": studentID
    }, function (e, docs) {

        testResult = docs;

        res.render('finalpage', {
            title: 'finalpage'
        });
    });
});

router.get('/getAllData', function (req, res) {
    console.log('initials test: ' + initials);
    var db = req.db;
    var collection = db.get('teachers');
    collection.findOne({
        "initials": initials
    }, function (e, docs) {

        console.log('Who am I? ', docs._id);
        res.send(JSON.stringify(docs._id));
    });
});

router.post('/send_mail', function (req, res) {
    var mail = req.body.mail;
    console.log(mail);

    mailSender(mail, testResult);
    res.redirect("finalpage");
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




function mailSender(mailTo, results) {
    console.log(results);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vucfyn.test@outlook.dk', //vucfyn.diktat.test@gmail.com 
            pass: 'Outlookvucfyntest2018'  //Gmailvucfyntest2018
        }
    });

    var mailOptions = {
        from: 'vucfyn.test@outlook.dk', //vucfyn.diktat.test@gmail.com
        to: mailTo, 
        subject: 'screeningtest resultater',
        text: JSON.stringify(results)
        //html: '<h1>Testresultater</h1><ul><li>Lærer ID: ' + results.teacherID + '</li><li>Kursist ID: ' + results.studentID + '</li><li>Kursist info: </li><li>dato ' + results.date + '</li><li>er ordblind' + results.is_dyslexic + '</li><li>har ordblindhed i familien ' + results.is_familyDyslexic + '</li><li>modersmål ' + results.mother_tongue + '</li><li>sprog i hjemmet' + results.lang_at_home + '</li><li>Test resultater</li><li>testtype ' + results.tests[0].type + '</li><li>svar 1 ' + results.tests[0].answers[0].answer + '</li><li>point ' + results.tests[0].answers[0].point + '</li><li>tid ' + results.tests[0].answers[0].time + '</li><li>svar 2 ' + results.tests[0].answers[1].answer + '</li><li>point ' + results.tests[0].answers[1].point + '</li><li>tid ' + results.tests[0].answers[1].time + '</li><li>svar 3' + results.tests[0].answers[2].answer + '</li><li>point ' + results.tests[0].answers[2].point + '</li><li>tid ' + results.tests[0].answers[2].time + '</li><li>testtype ' + results.tests[1].type + '</li><li>svar 1 ' + results.tests[1].answers[0].answer + '</li><li>point ' + results.tests[1].answers[0].point + '</li><li>tid ' + results.tests[1].answers[0].time + '</li><li>svar 2 ' + results.tests[1].answers[1].answer + '</li><li>point ' + results.tests[1].answers[1].point + '</li><li>tid ' + results.tests[1].answers[1].time + '</li><li>svar 3' + results.tests[1].answers[2].answer + '</li><li>point ' + results.tests[1].answers[2].point + '</li><li>tid ' + results.tests[1].answers[2].time + '</li><li>testtype ' + results.tests[2].type + '</li><li>svar 1 ' + results.tests[2].answers[0].answer + '</li><li>point ' + results.tests[2].answers[0].point + '</li><li>tid ' + results.tests[2].answers[0].time + '</li><li>svar 2 ' + results.tests[2].answers[1].answer + '</li><li>point ' + results.tests[2].answers[1].point + '</li><li>tid ' + results.tests[2].answers[1].time + '</li><li>svar 3' + results.tests[2].answers[2].answer + '</li><li>point ' + results.tests[2].answers[2].point + '</li><li>tid ' + results.tests[2].answers[2].time + '</li><li>testtype ' + results.tests[3].type + '</li><li>' + results.tests[3].answers.texts[0].time + '</li><li>svar 1 ' + results.tests[3].answers.questions[0].answer + '</li><li>point ' + results.tests[3].answers.questions[0].point + '</li><li>tid ' + results.tests[3].answers.quesitons[0].time + '</li><li>svar 2 ' + results.tests[3].answers.questions[1].answer + '</li><li>point ' + results.tests[3].answers.questions[1].point + '</li><li>tid ' + results.tests[3].answers.quesitons[1].time + '</li><li>svar 3' + results.tests[3].answers.questions[2].answer + '</li><li>point ' + results.tests[3].answers.questions[2].point + '</li><li>tid ' + results.tests[3].answers.questions[2].time + '</li><li>testtype ' + results.tests[4].type + '</li><li>tid ' + results.tests[4].answers[0].time + '</li></ul>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Mail ERROR");
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;
