var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



//henter hjemmesiden 'startpage' 
router.get('/startpage', function(req, res) {
    res.render('startpage', { title: 'Startside' });
});


//henter hjemmesiden 'main' 
router.get('/worddictate_teacher', function(req, res) {
    res.render('worddictate_teacher', { title: 'Orddiktat' });
});


//henter 'output' og finder data i databasen, svarende til de indtastede initialer
router.get('/worddictate_participant', function(req, res) {
    var db = req.db; 
    var collection = db.get('worddictate'); 
    
    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.find({'initials' : initials}, {}, function(e, docs) {
        var docLenght = docs.length; 
        res.render('worddictate_participant', {
            "testlist" : docs[docLenght-1],
            title: 'worddictate_participant'
        });
    });
}); 



router.post('/startpage_addinfo', function(req, res) {
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
        
        "date" : date,
        "firstname" : firstname, 
        "lastname" : lastname,
        "is_dyslexic" : dys, 
        "is_familyDyslexic" : fam, 
        "mother_tongue" : tong,
        "lang_at_home" : home
        
    }, function(err, doc) {
        if(err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect("worddictate_teacher"); 
        }
    });
});



var initials; 

router.post('/worddictate_addinfo', function(req, res) {

    
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    initials = req.body.initials; 
    var title = req.body.testTitle;
    var lines = req.body.lines;
    var files = req.body.files; 
    
    // Set our collection
    var collection = db.get('worddictate');

    // Submit to the DB
    collection.insert({
        "initials" : initials,
        "title" : title,
        "lines" : lines,
        "files" : files
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("worddictate_participant");
        }
    });
});


router.post('/worddictate_addanswer', function(req, res) {
    var db = req.db; 
    
    var userinput = req.body.userinput; 
    
    var collection = db.get('worddictate_participant_answer'); 
    
    collection.insert({
        "participant_answer" : userinput
    }, function(err, doc) {
        if(err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect("nextpage");
        }
    }); 
}); 


module.exports = router;