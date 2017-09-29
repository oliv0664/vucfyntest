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


router.get('/main', function(req, res) {
    res.render('main', { title: 'Orddiktat' });
});

router.get('/output', function(req, res) {
    var db = req.db; 
    var collection = db.get('test'); 
    collection.find({},{}, function(e, docs) {
        console.log("first");
        console.log(""); 
        console.log(docs);
        console.log("");
        console.log(docs[0].title);
        console.log("");
        res.render('output', {
            "testlist" : docs,
            title: 'output'
        });
    });
}); 



router.post('/addname', function(req, res) {

    // Set our internal DB variable
    var db = req.db;
    console.log("second"); 
    // Get our form values. These rely on the "name" attributes
    var initials = req.body.initials; 
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