var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});


router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});
*/




//henter hjemmesiden 'main' 
router.get('/main', function(req, res) {
    res.render('main', { title: 'Orddiktat' });
});


//henter 'output' og finder data i databasen, svarende til de indtastede initialer
router.get('/output', function(req, res) {
    var db = req.db; 
    var collection = db.get('test'); 
    
    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    collection.find({'initials' : initials}, {}, function(e, docs) {
        var docLenght = docs.length; 
        console.log("first");
        console.log(""); 
        console.log(docs);
        console.log("");
        console.log(docs[docLenght-1].title);
        console.log("");
        res.render('output', {
            "testlist" : docs[docLenght-1],
            title: 'output'
        });
    });
}); 




var initials; 

router.post('/addname', function(req, res) {

    
    // Set our internal DB variable
    var db = req.db;
    console.log("second"); 
    // Get our form values. These rely on the "name" attributes
    initials = req.body.initials; 
    console.log(initials); 
    
    var title = req.body.testTitle;
    console.log(title);
    
    var lines = req.body.lines; 
    console.log(lines); 
    
    
    /*var textArray = [];
    
    for(var i=0; i<lineCount; i++) {
        textArray[i] = req.body.lineText1 + i; 
    }
    */
    // Set our collection
    var collection = db.get('test');

    // Submit to the DB
    collection.insert({
        "initials" : initials,
        "title" : title,
        "lines" : lines
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("output");
        }
    });
});


module.exports = router;