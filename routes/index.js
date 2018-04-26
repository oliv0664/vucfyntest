var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var nodemailer = require('nodemailer');
var empty = require('empty-folder');


var mailSender = require('./../public/js/email_handler');
var teacherClass = require('./../public/models/teacherSchema.js');
var teacher = new teacherClass();
var studentClass = require('./../public/models/studentSchema.js');
var mongo = require('./../public/js/mongoHandler.js');
var mongoose = require('mongoose');

var teacherID;
var studentID;
var initials;
var teacherModules = [];
var studentModules = [];
var kursistModules = [];

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
function setupStudentModules(modulesArray) {
    var tempArray = [];
    for (var i = 0; i < modulesArray.length; i++) {
        console.log("MODULETYPE " + modulesArray[i].moduleType);
        tempArray.push(modulesArray[i].moduleType + '_kursist');
    }
    tempArray.push('finalpage');
    return tempArray;
}

function getId() {
    var id = '5a785e4b3867e72b94b2baba';
    console.log('getID is running');
    return id;
}

var testIndex;

function getTestIndex() {
    return testIndex;
}

function setTestIndex(index) {
    testIndex = index;
}


router.post('/welcome_addinfo', function (req, res) {

    //var db = req.db;
    console.log('before anything: ', studentModules);
    studentID = req.body.id;
    teacherID = req.app.get('idTeacher');
    console.log(studentID + " YNLPYPHTASCSACASC");

    //var collection = db.get('students');
    teacherClass.find().where({
        'tests._id': teacherID
    }).exec(function (err, teacher) {
        if (err) {
            res.send(err);
        } else {
            // find relevnt teacher data to student 
            console.log(teacher[0].tests[0].modules[0].moduleType);
            // make student object with data
            var id_serv = JSON.stringify(teacherID);

            for (var i = 0; i < teacher[0].tests.length; i++) {

                var id_db = JSON.stringify(teacher[0].tests[i]._id);
                if (id_db == id_serv) {

                    kursistModules = setupStudentModules(teacher[0].tests[i].modules);

                    studentClass.findOneAndUpdate({
                        studentID: studentID
                    }, 'modules', function (err, student) {
                        if (err) {
                            res.send(err);
                        } else {

                            if (!student) {
                                student = new studentClass({
                                    studentID: studentID,
                                    teacherID: teacherID,
                                    studentinfo: {},
                                    modules: []
                                });
                                console.log("STUDENT: " + student);

                                student.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    res.redirect(kursistModules[0]);
                                    kursistModules.shift();
                                });
                            } else {
                                res.send(alert('ID ER TAGET!'));
                            }
                        }
                    });

                }

            }

        }

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

    for (modules in data) {
        if (modules == "startpage") {
            studentModules.push(modules);
        } else {
            console.log(modules);
            temp = modules.split(' ');
            console.log(temp + " " + temp[0] + " " + temp[1]);
            teacherModules.push(temp[0]);
            studentModules.push(temp[1]);
        }
    }
    teacherModules.push('nextpage');
    studentModules.push('finalpage');

    console.log(teacherModules);
    console.log(studentModules);

    //find et teacher dokument med initialerne 
    teacherClass.findOne({
        initials: initials
    }, function (err, teacher) {
        if (err) {
            console.log(err);
        } else {

            //hvis der ikke eksisterer en teacher med de initialer
            if (!teacher) {
                console.log("NEW TEACHER");
                //opret en ny
                teacher = new teacherClass({
                    initials: initials,
                    totalTests: 1,
                    tests: []
                });
                //ellers tilføj til eksisterende
            } else {
                console.log("ADD TO EXISTING TEACHER");
                teacher.totalTests++;
            }

            //push en ny test i tests arrayet
            teacher.tests.push({
                date: new Date(),
                totalModules: teacherModules.length,
                modules: []
            });

            //gem til db og redirect view 
            teacher.save(function (err, test) {
                if (err) {
                    console.log(err);
                } else {
                    setTestIndex(test.tests[test.tests.length - 1].id)
                    console.log("SAVED: " + test.tests[test.tests.length - 1].id);
                    res.redirect(teacherModules[0]);
                    teacherModules.shift();
                }
            });
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

    //this code uploads all files from view to readFrom folder
    //then it uploads all files to MongoDB
    //mangler en bedre navngivning af filer i DB, så de kan findes igen 

    // arrays that should hold data fields from the client form
    var inputContent = [];
    var inputContentAnswers = [];

    // 
    var form = new formidable.IncomingForm();

    // parse the request and handle fields data

    form.parse(req, function (err, fields, files) {

        console.log("asdasdasdasdasdasd", fields);
        // organize data fields into temporary arrays for reference 
        var tempInputContent = Object.keys(fields).filter(input => input.length < 12);
        var tempInputContentAnswers = Object.keys(fields).filter(input => input.length > 12);

        var j = 0;
        for (i = 0; i < tempInputContentAnswers.length * 2; i = i + 2) {
            console.log("I " + i);
            // here we use reference to get the exact property from the object 
            // remember answers are separated 
            inputContent.push({
                index: "question " + j,
                line1: fields[tempInputContent[i]],
                line2: fields[tempInputContent[i + 1]]
            });

            inputContentAnswers.push({
                index: "answer " + j,
                answer: fields[tempInputContentAnswers[j]]
            });
            j++;
        }

    });

    // handle all the files together with fields data
    // the output  - mod - is an object containing module data
    formHandler(form, inputContent, inputContentAnswers, function (mod) {

        // find the correct teachers test 

        teacherClass.findOneAndUpdate({
            initials: initials
        }, 'tests', function (err, teacher) {
            if (err) {
                res.send(err);
            } else {
                console.log("TEACHER: " + teacher);
                teacher.tests[teacher.tests.length - 1].modules.push(mod);

                teacher.save(function (err) {
                    if (err) console.log(err);
                    res.redirect(teacherModules[0]);
                    teacherModules.shift();
                });
            }
        });
    });


});

/* ALLE FUNKTIONER DER ER TILKNYTTET NONSENSE*/

router.get('/nonsense_teacher', function (req, res) {
    res.render('nonsense_teacher', {
        title: 'Vrøvleord'
    });
});


router.post('/nonsense_addinfo', function (req, res) {
    var inputContent = [];
    var inputContentAnswers = [];

    var form = new formidable.IncomingForm();

    // parse the request and handle fields data
    form.parse(req, function (err, fields, files) {

        console.log("FIELDS: ", fields);

        // organize data fields into temporary arrays for reference 
        var tempInputContentAnswers = Object.keys(fields);
        var j = 0;
        for (i = 0; i < tempInputContentAnswers.length * 2; i = i + 2) {
            console.log("I " + i);
            // here we use reference to get the exact property from the object 
            // remember answers are separated 
            inputContent.push({
                index: "question " + j
            });

            inputContentAnswers.push({
                index: "answer " + j,
                answer: fields[tempInputContentAnswers[j]]
            });
            j++;
        }

    });

    // handle all the files together with fields data
    // the output  - mod - is an object containing module data
    formHandler(form, inputContent, inputContentAnswers, function (mod) {

        // find the correct teachers test 
        teacherClass.findOneAndUpdate({
            initials: initials
        }, 'tests', function (err, teacher) {
            if (err) {
                res.send(err);
            } else {
                console.log("TEACHER: " + teacher);
                teacher.tests[teacher.tests.length - 1].modules.push(mod);

                teacher.save(function (err) {
                    if (err) console.log(err);
                    res.redirect(teacherModules[0]);
                    teacherModules.shift();
                });
            }
        });
    });
});




/* ALLE FUNKTIONER DER ER TILKNYTTET CLOZETEST*/

router.get('/clozetest_teacher', function (req, res) {
    res.render('clozetest_teacher', {
        title: 'Clozetest'
    });
});


router.post('/clozetest_addinfo', function (req, res) {

    //    // TODO MONGOOSE 4
    //    // Set our internal DB variable
    //    var db = req.db;
    //    // Get our form values. These rely on the "name" attributes 
    //    var file = req.body.file;
    //    var content = req.body.content;
    //
    //    // Set our collection
    //    var collection = db.get('teachers');
    //    // Submit to the DB
    //    collection.update({
    //        "initials": initials
    //    }, {
    //        "$push": {
    //            "tests": {
    //                "type": "clozetest",
    //                "file": file,
    //                "content": JSON.parse(content)
    //            }
    //        }
    //    }, function (err, doc) {
    //        if (err) {
    //            // If it failed, return error
    //            res.send("There was a problem adding the information to the database.");
    //        } else {
    //            // And forward to success page
    ////            // REDIRECT SHOULD BE IN HERE WHEN MONGOOSE LOGIC IS
    //
    //
    //        }
    //    });
    res.redirect(teacherModules[0]);
    teacherModules.shift();
    console.log('next module should be ' + teacherModules[0]);
});


/* ALLE FUNKTIONER DER ER TILKNYTTET INTERPRET*/

router.get('/interpret_teacher', function (req, res) {
    res.render('interpret_teacher', {
        title: 'Tekstforståelse'
    });
});


router.post('/interpret_addinfo', function (req, res) {
    // TODO MONGOOSE 5
    //    // Set our internal DB variable
    //    var db = req.db;
    //    // Get our form values. These rely on the "name" attributes 
    //    var file = req.body.file;
    //    var content = req.body.content;
    //    console.log(content);
    //    // Set our collection
    //    var collection = db.get('teachers');
    //
    //    // Submit to the DB
    //    collection.update({
    //        "initials": initials
    //    }, {
    //        "$push": {
    //            "tests": {
    //                "type": "tekstforståelse",
    //                "file": file,
    //                "content": JSON.parse(content)
    //            }
    //        }
    //    }, function (err, doc) {
    //        if (err) {
    //            // If it failed, return error
    //            res.send("There was a problem adding the information to the database.");
    //        } else {
    //            // And forward to success page
    ////            // REDIRECT SHOULD BE IN HERE WHEN MONGOOSE LOGIC IS
    //        }
    //    });
    res.redirect(teacherModules[0]);
    teacherModules.shift();
    console.log('next module should be ' + teacherModules[0]);
});




/* ALLE FUNKTIONER DER ER TILKNYTTET LETTER*/

router.get('/letter_teacher', function (req, res) {
    res.render('letter_teacher', {
        title: 'Brev'
    });
});


router.post('/letter_addinfo', function (req, res) {

    //    // TODO MONGOOSE 6
    //    var db = req.db;
    //
    //    var file = req.body.file;
    //    var time = req.body.time;
    //
    //    var collection = db.get('teachers');
    //    collection.update({
    //        "initials": initials
    //    }, {
    //        "$push": {
    //            "tests": {
    //                "type": "brev",
    //                "file": file,
    //                "content": [{
    //                    "time": time
    //                }]
    //            }
    //        }
    //    }, function (err, doc) {
    //        if (err) {
    //            res.send("There was a problem adding the information to the database.");
    //        } else {
    ////            // REDIRECT SHOULD BE IN HERE WHEN MONGOOSE LOGIC IS
    //        }
    //    });
    res.redirect(teacherModules[0]);
    teacherModules.shift();
    console.log('next module should be ' + teacherModules[0]);
});



/* NEXTPAGE ER EN DUMMY DER SENDER DIG VIDERE TIL KURSISTSIDEN*/

router.get('/nextpage', function (req, res) {
    res.render('nextpage', {
        title: 'Nextpage'
    });
});


router.post('/nextpage', function (req, res) {
    res.redirect(kursistModules[0]);
    kursisModules.shift();
    console.log('next module should be ' + kursisModules[0]);
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

    // var db = req.db;
    //    console.log(req.body);
    //    console.log("DOES THIS EXISt " + studentID);
    //    var firstname = req.body.firstname;
    //    var lastname = req.body.lastname;
    //    var age = req.body.age;
    //    var mothertong_dk = req.body.mothertong_dk;
    //    var tong_input = req.body.tong_input;
    //    var years_in_dk = req.body.years_in_dk;
    //    var edu_in_dk = req.body.edu_in_dk;
    //    var pass_test = req.body.pass_test;
    //    var eg_test = req.body.eg_test;
    //
    //
    //
    //    var speciel_edu = req.body.speciel_edu;
    //    var speciel_edu_adult = req.body.speciel_edu_adult;
    //    var eg_edu = req.body.eg_edu;
    //
    //    var years_in_edu = req.body.years_in_edu;
    //    var years_in_edu_home = req.body.years_in_edu_home;
    //    var exam_finish = req.body.exam_finish;
    //    var eg_exam = req.body.eg_exam;
    //    var eg_exam_country = req.body.eg_exam_country;
    //    var edu_finish = req.body.edu_finish;
    //    var eg_edu_finish = req.body.eg_edu_finish;
    //    var eg_edu_finish_country = req.body.eg_edu_finish_country;
    //    var read_write_con = req.body.read_write_con;
    //    var eg_con = req.body.eg_con;
    //
    //    var in_job = req.body.in_job;
    //    var eg_job = req.body.eg_job;
    //    var read_write_in_job = req.body.read_write_in_job;
    //    var eg_read_write_in_job = req.body.eg_read_write_in_job;
    //    var read_in_job = req.body.read_in_job;
    //    var write_in_job = req.body.write_in_job;
    //    var lang_in_job = req.body.lang_in_job;
    //
    //    var why_fvu = req.body.why_fvu;
    //
    //    var improvement = req.body.improvement;
    //    var eg_improvement = req.body.eg_improvement;
    //
    ////    var collection = db.get('students');
    //
    //    
    //   studentClass.find()({
    //        "studentID": studentID
    //    }, {
    //        $set: {
    //            //"id": initials,
    //            "Fornavn": firstname,
    //            "Efternavn": lastname,
    //            "Alder": age,
    //            "Har du andet end dansk som modersmål": mothertong_dk,
    //            "Hvad er dit modersmål": tong_input,
    //            "Hvor længe har du boet i Danmark": years_in_dk,
    //            "Har du fået undervisning i dansk": edu_in_dk,
    //            "Har du bestået nogen prøver": pass_test,
    //            "Evt hvilke(n)": eg_test,
    //            "Har du modtaget specialundervisningen i skolen": speciel_edu,
    //            "Har du modtaget specialundervisning som voksen": speciel_edu_adult,
    //            "Evt i hvilke(t) fag og hvor længe": eg_edu,
    //            "Hvor længe har du gået i skole": years_in_edu,
    //            "Hvor længe har du gået i skole i dit hjemland": years_in_edu_home,
    //            "Har du afsluttende eksamen fra din skole": exam_finish,
    //            "Evt i hvilke(n)": eg_exam,
    //            "Fra hvilket land": eg_exam_country,
    //            "Har du en uddannelse": edu_finish,
    //            "Evt hvilken": eg_edu_finish,
    //            "Evt fra hvilket land": eg_edu_finish_country,
    //            "Har dine læse- og stavevanskeligheder haft betydning for skole og uddannelse": read_write_con,
    //            "Evt på hvilken måde": eg_con,
    //            "Er du i job": in_job,
    //            "Evt hvilket": eg_job,
    //            "Indgår der læsning eller skrivning i dit job": read_write_in_job,
    //            "Evt hvordan": eg_read_write_in_job,
    //            "Hvordan klarer du at læse på jobbet": read_in_job,
    //            "Hvordan klarer du at skrive på jobbet": write_in_job,
    //            "Hvilket sprog taler du mest på dit job": lang_in_job,
    //            "Hvorfor vil du gerne gå til FVU-læsning": why_fvu,
    //            "Hvad vil du gerne blive bedre til": improvement,
    //            "Andet": eg_improvement,
    //            //"time": "12:00:00",
    //            "tests": []
    //        }
    //    }, function (err, doc) {
    //        if (err) {
    //
    //            res.send("There was a problem adding the information to the database.");
    //
    //        } else {

    console.log("######## student modules: " + kursisModules[0]);
    res.redirect(kursisModules[0]);
    kursisModules.shift();

    //        }
});
//});


//initials = 'tintin';
var g_moduleCount = 0;

/* ALLE FUNKTIONER DER ER TILKNYTTET WORDDICTATE */

//henter 'worddictate_participant' og finder data i databasen, svarende til de indtastede initialer
router.get('/orddiktat_kursist', function (req, res) {

    console.log("TEACHER ID: " + typeof JSON.stringify(teacherID));
    // teacherID = JSON.stringify(teacherID); 

    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 

    teacherClass.find({
        "tests._id": teacherID
    }, function (err, teacher) {
        if (err) {
            console.log(err);
        } else {

            var id_serv = JSON.stringify(teacherID);

            for (var i = 0; i < teacher[0].tests.length; i++) {
                var id_db = JSON.stringify(teacher[0].tests[i]._id);

                if (id_db == id_serv) {
                    var fileName = "tt";
                    var audio_files = [];
                    var promises = [];
                    var content = teacher[0].tests[i].modules[0].content; //0 = orddiktat
                    var moduleType = teacher[0].tests[i].modules[0].moduleType;

                    promises.push(mongo.readFromDB('descriptionAudio.mp3', teacher[0].tests[i].modules[0].audio.file_id));
                    for (var j = 0; j < teacher[0].tests[i].modules[0].content.length; j++) {
                        promises.push(mongo.readFromDB('file' + j + '.mp3', teacher[0].tests[i].modules[0].content[j].file.file_id));
                    }
                    Promise.all(promises).then(function (result) {

                        for (var k = 0; k < result.length; k++) {
                            result[k] = result[k].slice(2);
                        }

                        res.render('template', {
                            content: content,
                            'title': moduleType,
                            descriptionAudio: result.shift(),
                            description: "Dette er en beskrivelse af testen",
                            audioFiles: result
                        });

                    });
                } else {
                    console.log("NO MATCH");
                }
            }


        }
    });
});


router.post('/worddictate_addanswer', function (req, res) {

    //det første der sker, er at 'writeTo' mappen tømmes 
    empty('./public/writeTo', false, function (err, removed, failed) {
        if (err) {
            console.error(err);
        }
    });

    console.log('test');
    // arrays that should hold data fields from the client form
    var inputAnswers = [];
    // var inputContentAnswers = [];

    // 
    var form = new formidable.IncomingForm();

    // parse the request and handle fields data

    form.parse(req, function (err, fields, files) {

        inputAnswers = [];
        var temp = Object.keys(fields);
        for (i = 0; i < temp.length; i++) {
            inputAnswers.push(fields[temp[i]]);
        }
        var mod = {
            moduleType: 'Orddiktat',
            answers: inputAnswers
        }

        studentClass.findOneAndUpdate({
            studentID: studentID
        }, 'modules', function (err, student) {
            if (err) {
                res.send(err);
            } else {
                console.log("STUDENT: " + student);
                student.modules.push(mod);

                student.save(function (err) {
                    if (err) console.log(err);
                    res.redirect(kursisModules[0]);
                    kursisModules.shift();
                });
            }
        });
    });

});



/* ALLE FUNKTIONER DER ER TILKNYTTET NONSENSE */

//henter 'output' og finder data i databasen, svarende til de indtastede initialer
router.get('/vroevleord_kursist', function (req, res) {

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    teacherClass.find({
        "tests._id": teacherID
    }, function (err, teacher) {
        if (err) {
            console.log(err);
        } else {

            var id_serv = JSON.stringify(teacherID);

            for (var i = 0; i < teacher[0].tests.length; i++) {
                var id_db = JSON.stringify(teacher[0].tests[i]._id);

                if (id_db == id_serv) {
                    var fileName = "tt";
                    var audio_files = [];
                    var promises = [];
                    var content = teacher[0].tests[i].modules[0].content; //0 = orddiktat
                    var moduleType = teacher[0].tests[i].modules[0].moduleType;

                    promises.push(mongo.readFromDB('descriptionAudio.mp3', teacher[0].tests[i].modules[0].audio.file_id));
                    for (var j = 0; j < teacher[0].tests[i].modules[0].content.length; j++) {
                        promises.push(mongo.readFromDB('file' + j + '.mp3', teacher[0].tests[i].modules[0].content[j].file.file_id));
                    }
                    Promise.all(promises).then(function (result) {

                        for (var k = 0; k < result.length; k++) {
                            result[k] = result[k].slice(2);
                        }

                        res.render('template', {
                            content: content,
                            'title': moduleType,
                            descriptionAudio: result.shift(),
                            description: "Dette er en beskrivelse af testen",
                            audioFiles: result
                        });

                    });
                } else {
                    console.log("NO MATCH");
                }
            }


        }
    });
    //            "data": docs.tests[1],
    //            title: 'nonsense_participant'
    //        g_moduleCount++;
});


router.post('/nonsense_addanswer', function (req, res) {

    //det første der sker, er at 'writeTo' mappen tømmes 
    empty('./public/writeTo', false, function (err, removed, failed) {
        if (err) {
            console.error(err);
        }
    });

    console.log('test');
    // arrays that should hold data fields from the client form
    var inputAnswers = [];
    // var inputContentAnswers = [];

    // 
    var form = new formidable.IncomingForm();

    // parse the request and handle fields data

    form.parse(req, function (err, fields, files) {

        inputAnswers = [];
        var temp = Object.keys(fields);
        for (i = 0; i < temp.length; i++) {
            inputAnswers.push(fields[temp[i]]);
        }
        var mod = {
            moduleType: 'Vroelveord',
            answers: inputAnswers
        }

        studentClass.findOneAndUpdate({
            studentID: studentID
        }, 'modules', function (err, student) {
            if (err) {
                res.send(err);
            } else {
                console.log("STUDENT: " + student);
                student.modules.push(mod);

                student.save(function (err) {
                    if (err) console.log(err);
                    res.redirect(kursisModules[0]);
                    kursisModules.shift();
                });
            }
        });
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
            res.redirect(kursisModules[0]);
            kursisModules.shift();
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
            res.redirect(kursisModules[0]);
            kursisModules.shift();
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
            res.redirect(kursisModules[0]);
        }
    });
});

var testResult;
router.get('/finalpage', function (req, res) {
    res.render('finalpage', {
        title: 'finalpage'
    });
});

router.get('/getAllData', function (req, res) {
    console.log('initials test: ' + initials);

    teacherClass.find({
        initials: initials
    }, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log(docs);

            res.send(JSON.stringify(docs[0].tests[docs[0].tests.length - 1]._id));
        }
    });


    // var db = req.db;
    // var collection = db.get('teachers');
    // collection.findOne({
    //     "initials": initials
    // }, function (e, docs) {

    //     console.log('Who am I? ', docs._id);
    //     res.send(JSON.stringify(docs._id));
    // });
});

router.post('/send_mail', function (req, res) {

    var testID;

    studentClass.findOne({
        'studentID': studentID
    }, function (err, student) {
        if (err) {
            console.log(err);
        } else {


            // var mail = req.body.mail;
            // console.log(mail);

            // var msg = mailSender.htmlBuilder(testResult);
            // mailSender.sendMail(mail, msg);

            // res.redirect("finalpage");
            //code to get correct answers 
            testID = student.teacherID;

            // for(var i=0; i<student.modules.length; i++) {
            //     student_answers.push({
            //         moduleType: student.modules[i].moduleType,
            //         answers: student.modules[i].answers 
            //     });  
            // } 


            teacherClass.findOne({
                'tests._id': testID
            }, function (err, teacher) {
                if (err) {
                    console.log(err);
                } else {
                    //code to get correct answers
                    console.log("FINAL TEACHER ", teacher);

                    var id_serv = JSON.stringify(testID);

                    for (var i = 0; i < teacher.tests.length; i++) {
                        var id_db = JSON.stringify(teacher.tests[i]._id);

                        if (id_serv == id_db) {
                            var final_score = evaluateScore(i, student, teacher);
                            var mail = req.body.mail;
                            var msg = mailSender.htmlBuilder(final_score);
                            mailSender.sendMail(mail, msg);
                        }
                    }
                }
            });
        }
    });
});


function evaluateScore(testIndex, student, teacher) {
    var final_score = [];
    for (var j = 0; j < student.modules.length; j++) {
        for (var k = 0; k < student.modules[j].answers.length; k++) {
            var point = 0;
            var student_answer = student.modules[j].answers[k];
            var correct_answer = teacher.tests[testIndex].modules[j].contentAnswer[k].answer;
            if (student_answer == correct_answer) {
                point = 1;
            }
            final_score.push({
                student_answer: student_answer,
                correct_answer: correct_answer,
                point: point
            });
        }
    }
    return final_score;
}


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


//
//router.get('/template', function (req, res) {
//    res.render('template', {
//        title: 'Template'
//    });
//});

function formHandler(incForm, inputCont, inputContAns, callback) {

    var files = [];


    incForm.on('fileBegin', function (name, file) {
        console.log("1");
        //check if there is audio file
        if (file.name != '') {
            file.path = 'public/readFrom/' + file.name;
        }
    });

    incForm.on('file', function (name, file) {
        files.push([file]);
    });

    incForm.on('end', function () {
        console.log("3");
        console.log('FILES FILES FIES ', files[1][0].name);
        //this is where the fun begins 

        var promises = [];
        for (var i = 0; i < files.length; i++) {
            promises.push(
                new Promise(function (resolve, reject) {
                    // files.map(function (item) {

                    var fileUpload = files[i][0].name;
                    console.log("4 " + fileUpload);
                    var mongo = require('../public/js/MongoHandler');
                    //when MongoHandler is done with upload to MongoDB return result
                    //check if there is audiofile
                    if (fileUpload != '') {
                        return mongo.writeToDB(fileUpload, fileUpload)
                            .then(function (result) {
                                console.log("FILEUPLOAD " + i + " FINISHED ", result);
                                // file_data[i] = result;
                                resolve(result);
                            }, function (err) {
                                console.log(err);
                            });
                    }
                })
            );
        }

        //once all the promises are done
        Promise.all(promises).then(function (file_data) {
            //when files are uploaded, they are removed from 'readFrom' folder
            empty('./public/readfrom', false, function (err, removed, failed) {
                if (err) {
                    console.error(err);
                }
            });


            //this is the content from the teacher test
            //this should be saved in mongoDB 'teachers' collection 
            for (var i = 1; i < file_data.length; i++) {
                console.log("FILES FILES FILES ", inputCont[i - 1]);
                inputCont[i - 1].file = file_data[i];
            }

            
            var testStringUrl;
            function poop(){
                // this is a tiny bit hardcoded
                var possibleQueries = ['orddiktat','vroevleord', 'clozetest'];
                var url = window.location.href;
                console.log(url);
                return url;
            }
            testStringUrl = poop();
            
            var mod = {
                moduleType: "orddiktat",
                audio: file_data[0],
                content: inputCont,
                contentAnswer: inputContAns
            };

            console.log("MODULE: ", mod);



            return callback(mod);

        });
    });
};





module.exports = router;
