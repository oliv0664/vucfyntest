var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/filepicker', function (req, res, next) {
    res.render('filepicker', {
        title: 'Filepicker'
    });
});

//var initials = "oni";
/*      HER ER ALLE TEACHER SIDERNE       */


/* ALLE FUNKTIONER DER ER TILKNYTTET MAIN */

//henter hjemmesiden 'main' 
router.get('/main', function (req, res) {
    res.render('main', {
        title: 'Main'
    });
});


var initials;
router.post('/index_addinfo', function (req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    initials = req.body.initials;

    // Set our collection
    var collection = db.get('owners');

    // Submit to the DB
    collection.insert({
        "initials": initials
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // And forward to success page
            res.redirect("worddictate_teacher");
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
    var lines = req.body.lines;
    var files = req.body.files;

    // Set our collection
    var collection = db.get('worddictate');

    // Submit to the DB
    collection.insert({
        "initials": initials,
        "lines": lines,
        "files": files
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // And forward to success page
            res.redirect("nonsense_teacher");
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

    var files = req.body.files;

    var collection = db.get('nonsense');

    collection.insert({
        "initials": initials,
        "files": files
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect("clozetest_teacher");
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
    var lines = req.body.lines;
    var files = req.body.files;

    // Set our collection
    var collection = db.get('clozetest');

    // Submit to the DB
    collection.insert({
        "initials": initials,
        "lines": lines,
        "files": files
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // And forward to success page
            res.redirect("clozetest_participant");
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
    res.redirect("startpage");
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

    var collection = db.get('startpage');

    collection.insert({

        "date": date,
        "firstname": firstname,
        "lastname": lastname,
        "is_dyslexic": dys,
        "is_familyDyslexic": fam,
        "mother_tongue": tong,
        "lang_at_home": home

    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect("worddictate_participant");
        }
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET WORDDICTATE */

//henter 'worddictate_participant' og finder data i databasen, svarende til de indtastede initialer
router.get('/worddictate_participant', function (req, res) {
    var db = req.db;
    var collection = db.get('worddictate');

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.find({
        'initials': initials
    }, {}, function (e, docs) {
        var docLenght = docs.length;
        res.render('worddictate_participant', {
            "testlist": docs[docLenght - 1],
            title: 'worddictate_participant'
        });
    });
});


router.post('/worddictate_addanswer', function (req, res) {
    var db = req.db;

    var userinput = req.body.userinput;
    var timestamp = req.body.timestamp;

    var collection = db.get('worddictate_answer');

    collection.insert({
        "participant_answer": userinput,
        "timestamp": timestamp
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect("nonsense_participant");
        }
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET NONSENSE */

//henter 'output' og finder data i databasen, svarende til de indtastede initialer
router.get('/nonsense_participant', function (req, res) {
    var db = req.db;
    var collection = db.get('nonsense');

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.find({
        'initials': initials
    }, {}, function (e, docs) {
        var docLenght = docs.length;
        res.render('nonsense_participant', {
            "testlist": docs[docLenght - 1],
            title: 'nonsense_participant'
        });
    });
});


router.post('/nonsense_addanswer', function (req, res) {
    var db = req.db;

    var userinput = req.body.userinput;

    var collection = db.get('nonsense_answer');

    collection.insert({
        "participant_answer": userinput
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect("clozetest_participant");
        }
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET CLOZETEST */

//henter clozetest_participant og finder data i databasen, svarende til de indtastede initialer
router.get('/clozetest_participant', function (req, res) {
    var db = req.db;
    var collection = db.get('clozetest');

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.find({
        'initials': initials
    }, {}, function (e, docs) {
        var docLenght = docs.length;
        res.render('clozetest_participant', {
            "testlist": docs[docLenght - 1],
            title: 'clozetest_participant'
        });
    });
});


router.post('/clozetest_addanswer', function (req, res) {
    var db = req.db;

    var userinput = req.body.userinput;
    var timestamp = req.body.timestamp;

    var collection = db.get('clozetest_answer');

    collection.insert({
        "participant_answer": userinput,
        "timestamp": timestamp
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect("finalpage");
        }
    });
});





module.exports = router;
