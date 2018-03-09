var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ready = false;

var mongo = require('mongodb');
//var monk = require('monk');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/vucfyntest';

// var url = 'localhost:27017/vucfyntest'
//var url = 'mongodb://vucfyntest:test@ds237475.mlab.com:37475/vucfyntestdb'

var Grid = require('gridfs-stream');
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






//get file with database model/schema for teachers 
var teacherClass = require('./public/models/teacherSchema.js');

var worddictate = {
    "type" : "orddiktat",
    "file" : "",
    "content" : [
            {
                    "line1" : "Hans",
                    "answer" : "forældre",
                    "line2" : "tror ham ikke.",
                    "file" : ""
            },
            {
                    "line1" : "Hun så en",
                    "answer" : " lærer",
                    "line2" : " stjæle en cykel.",
                    "file" : ""
            },
            {
                    "line1" : "Der står et",
                    "answer" : "nøgent",
                    "line2" : "træ i haven.",
                    "file" : ""
            },
            {
                    "line1" : "En rask",
                    "answer" : "diskussion",
                    "line2" : " renser luften.",
                    "file" : ""
            },
            {
                    "line1" : "Pigen ventede på prinsen på den ",
                    "answer" : "hvide",
                    "line2" : "hest.",
                    "file" : ""
            },
            {
                    "line1" : "Han går rundt og ",
                    "answer" : "hører",
                    "line2" : "ingenting.",
                    "file" : ""
            },
            {
                    "line1" : "Han var en",
                    "answer" : "lysende",
                    "line2" : "begavelse.",
                    "file" : ""
            },
            {
                    "line1" : "Politiet udsteder",
                    "answer" : "kørekort",
                    "line2" : ".",
                    "file" : ""
            },
            {
                    "line1" : "Han har en fin ",
                    "answer" : "fornemmelse",
                    "line2" : "for andre mennesker.",
                    "file" : ""
            },
            {
                    "line1" : "Der er for mange cyklister på ",
                    "answer" : "fortovene",
                    "line2" : ".",
                    "file" : ""
            }
    ]
}; 

var nonsense = {
    "type" : "vrøvleord",
    "file" : "",
    "content" : [
            {
                    "answer" : "mof",
                    "file" : ""
            },
            {
                    "answer" : "tul",
                    "file" : ""
            },
            {
                    "answer" : "nod",
                    "file" : ""
            },
            {
                    "answer" : "vus",
                    "file" : ""
            },
            {
                    "answer" : "slød",
                    "file" : ""
            }
    ]
}; 

var clozetest = {
    "type" : "clozetest",
    "file" : "",
    "content" : [
            {
                    "line1" : " Liff er en ung pige på 20 år. Da hun blev færdig med gymnasiet, ville hun holde en skolepause",
                    "line2" : "hun gik i gang med at læse til eksportingeniør.",
                    "file" : ""
            },
            {
                    "line1" : "Liff tog til Australien og rejste rundt med en veninde i en måneds",
                    "line2" : ".",
                    "file" : ""
            },
            {
                    "line1" : "Derefter startede hun på business college i Sydney. Det var en skole for asiater,  og Liff var den eneste",
                    "line2" : ".",
                    "file" : ""
            },
            {
                    "line1" : "Fagligt lærte hun ikke noget, men udviklede sig rent",
                    "line2" : ".",
                    "file" : ""
            },
            {
                    "line1" : "I december ",
                    "line2" : "år vendte hun tilbage til Danmark,",
                    "file" : ""
            },
            {
                    "line1" : "og for at tjene penge ",
                    "line2" : "hun som  kassedame i et supermarked.",
                    "file" : ""
            }
    ]
}; 

var interpret = {
    "type" : "tekstforståelse",
    "file" : "",
    "content" : {
            "texts" : [
                    {
                            "text" : "Katrine Marie Guldager: Sæde 97\nNovellen erfra 2000.\n\nKlokken var nøjagtigt 17.14 da Kirsten Lis Goplev fik en medpassager i toget på vej til\nKøbenhavn. Fin Geplev som netop var nået til side 114 i en opslået bog, lod brillerne\nglide ned på næsetippen og betragtede for en kort stund den fremmede. Kvinden der =\nsatte sig på sæde 97 havde meget mærkeligt afvisende over sig, og Fru Goplev\nSpekulerede intenst på hvor hun mon var på vej lien. Hendes brillestel var grønt. Snart\nkunne Fru Goplev ikke l'engere samle tankerne om sin renten og lod sit blik glide ind\nover kvinden for dog at opsamle et tegn en antydning, en åbning ind i medpassagerens\nverden.\n\nDet var efter at togstewardessen havde vaeret der og solgt kvinden en kop kaffe at Fru\nGoplev simpelt hen kastede sig lige ud i det.\n\n— Ja, jeg skal hele vej en til København. Skal du også det?\n\n— Nej. svarede kvinden og så ud som om hun kunne standse samtalen ved at stirre ned\ni den varme kaffe. … Det var dog den mest elendige kaffe jeg længe har smagt, kom. hun\nså alligevel til at sige, som om hun spildte.\n\n—- Jeg har min egen kaffe med på termokande, udbrød Fru Goplev beredvilligt. Du er\nmeget velkommen til at få lidt af den Den smager godt.. .Det gør den Virkelig.\n\nDen fremmede kvinde ville gerne afslå. Der var faktisk intet hun hellere ville.\nAlligevel modtog hun Fm Goplevs kaffe\n\nDa Fru Goplev atter havde placeret termekanden i sin håndtaske, rakte hun hånden\n\n' frem og præsenterede sig. Det mente han var god tone. Kvinden på sæde 97\n\npræsenterede sig som Henny Jensen.\n\nDet var tydeligt at Fru Geplev sad og endevendte sin hjerne for at finde på noget at\nsige, og hendes fortvivlelse bredte sig snart til kvinden på sæde 97 som brød stilheden\nidet hun sagde:\n\n— Jeg skal på kirkegården. Jeg skal besøge min datters grav.\n\n… Det var dog ferfærdeligt Fm Goplev så et øjeblik ud som om hun selv var på vej\ntil kirkegården. — Og du rejser alene\n\n— DU mener ...\n\n… Din mand\n\n— Ja, ja, ja, afbrød Henny Jensen og tog endnu en slurk af kaffen.\n\n— Er den bedre end den anden Kaffen, mener jeg. =\n\n» Ja tak og du skal til København …?\n\n— J a, jeg skal såmænd bare til København. Ja faktisk skal jeg til en meget vigtig\njobsamtale. Jeg har forberedt mig. Det er derfor jeg nu sidder her med denne roman, Fru\nGoplev kastede et blik ned i sin bog. — For dog at tænke på noget andet. Det er meget\nvigtigt at jeg får det arbejde forstår du, ellers kan jeg ikke beholde mit hus. Og ganske\nvist er mine børn flyttet hjemmefra. Men jeg hører til der. Jeg kan simpelthen ikke be\nandre steder og så må man jo betale det det koster.\n\nFru Geplev blev afbrudt af billetkontielleren som indtog en afventende positien i\nmidtergangen. Fru Goplev kunne ikke finde sin billet Hun hav de ganske sikkert købt en.\nHan havde nemlig planlagt det hele en 30 40 gange. Planen var at hun skulle ankomme\ntil Københavns Hovedbanegård nøjagtigt klokken 19.22.",
                            "file" : ""
                    },
                    {
                            "text" : "Klokken 19.25 skulle hun\n\n mødes med Hans Høj Jacobsen under ureti afgangshallen og kort efter ville de sætte sig\nind i hans bil, køre til hans lejlighed og spise, mens de diskuterede den forestående\njobsamtale. Netop fordi jobsamtalen var så vigtig kunne Fru Goplev alle togtiderne i\nhovedet. Hun havde gennemgået dem igen og igen og havde man bedt hende om det,\nkunne hun redegøre for det nøjagtige indhold af sin lille håndtaske, hun kunne beskrive\nnøjagtigt hvilket tøj hun ville bære den følgende dag, og hun havde endda indstuderet et\npar indledende bemaerkninger, Men billetten var vaek. Fru Goplev endevendte hele\nhåndtasken, mens hun kiggede over på den fremmede og rystede på hovedet. — Jeg ved\nvirkelig ikke hvad der foregår. Jeg plejer at have helt styr på den slags.\n\nMen da hun omsider havde opgivet at finde sin billet, viste det sig at han faktisk ikke\nhavde kontanter nok til at købe en ny. Situationen var ved at blive lidt besværlig.\n\nBilletkontrolløren kom tilbage og understregede at han ikke kunne lade hende rejse\nvidere uden billet.\n\n— Jamen har De ingen kreditkort? spurgte kontrolløren utålmodigt.\n\nMen Fru Goplev kunne ikke drømme om at bruge kreditkort, hun havde aldrig haft et,\nog hun kunne heller ikke drømme om at anskaffe sig et.\n\n— Lad mig hjælpe dig, sagde Henny Jensen. — Vi. udveksler adresser og så kan du altid\nsende mig de penge.\n\n— Åh! Mange tak. Det er vel nok sødt af dig. Jeg sender pengene i morgen,\nselvfølgelig, det skal du ikke være i tvivl om.\n\nFru Goplev var så taknemmelig at hun var lige ved at begynde at lyse.\n\nI mellemtiden var det blevet mørkt. Man kørte igennem tunnelen. Man standsede ved\nKorsør. Fru Goplev følte togets opbremsning i hele kroppen.\n\nDa den ene passager de havde haft over for sig steg af, lænede Fru Goplev sig lidt ind\nmod sin medpassager. \"\n\n— Hvad døde hun af, din datter?\n\n» Det var en rideulykke.\n\nHenny Jensen lod blikket glide hen til vinduet, men alt hvad hun så var sig selv.\n\n— Er det lang tid siden? spurgte Fru Goplev og så ud som om hun var ved at græde.\n\nPassageren på sæde 97 svarede ikke. Hun tømte kaffen og så ud som om hun havde\ndrukket gift.\n\n—- Jeg er Virkelig glad for at du lånte mig de penge, det er jeg virkelig meget glad\nfor sagde Fnr Goplev.\n\n— Det var så lidt.\n\n— Ja, men jeg blev virkelig reddet ud af en slem knibe.\n\n\" Du har bare lånt lidt penge, det er det hele, ikke noget særligt. Og nu skaljeg vist\naf. Det var hyggeligt at møde dig.\n\nDet næsten rev i Fru Goplev, han følte en stærk trang til at stige af, til at følge den\nanden kvinde ud i mørket. Men følelsen forsvandt lige så hurtigt som den kom. Hun\nhavde jo en meget vigtig jobsamtale. Og et hus hun for alt i verden ville beholde.\n\nKlokken var nøjagtigt 19.22 da han ankom til Københavns Hovedbanegård og\nklokken 19.25 genkendte hun Hans Høj Jacobsens stolte skikkelse. Hele aftenen gik med\nat tale om den virksomhed Fru Goplev ville ansættes i, og da hun omsider ankom til\nsamtalen den følgende dag, var hun væbnet til tænderne. Hun fik jobbet og lønnen var\ngod. Brevet til Henny Jensen fik hun aldrig sendt",
                            "file" : ""
                    }
            ],
            "questions" : [
                    {
                            "question" : "Hvor er fru Goplev på vej hen?",
                            "answers" : [
                                    "Til København for at besøge familie",
                                    "På kirkegården",
                                    "Til Korsør",
                                    "Til København til jobsamtale"
                            ],
                            "rightAnswer" : "Til København til jobsamtale"
                    },
                    {
                            "question" : "Hvordan reagerer den fremmede kvinde, da fru Goplev tilbyder hende kaffe?",
                            "answers" : [
                                    "Hun svarer ikke",
                                    "Hun modtager kaffen",
                                    "Hun skubber til termokanden",
                                    "Hun afslår kaffen"
                            ],
                            "rightAnswer" : "Hun svarer ikke"
                    },
                    {
                            "question" : "Hvorfor søger fru Goplev job?",
                            "answers" : [
                                    "Ellers kan hun ikke beholde sit hus",
                                    "Fordi hendes børn bor i København",
                                    "Fordi hendes mand er død",
                                    "Fordi hun gerne vil gøre karriere"
                            ],
                            "rightAnswer" : "Fordi hendes mand er død"
                    },
                    {
                            "question" : "Hvordan bliver fru Goplevs problem med billetten løst?",
                            "answers" : [
                                    "Hun finder billetten i sin håndtaske",
                                    "Hun betaler en ny billet med sit kreditkort",
                                    "Hun står af toget i Korsør",
                                    "Hun låner penge til en ny billet af Henny Jensen "
                            ],
                            "rightAnswer" : "Hun låner penge til en ny billet af Henny Jensen"
                    },
                    {
                            "question" : "Hvorfor står Henny Jensen af toget?",
                            "answers" : [
                                    "Hun skal til Korsør",
                                    "Hun har ingen billet",
                                    "Hun vil ikke tale mere med fru Goplev",
                                    "Hun skal til jobsamtale"
                            ],
                            "rightAnswer" : "Hun har ingen billet"
                    }
            ]
    }
}; 

var letter = {
    "type" : "brev",
    "file" : "",
    "content" : [
            {
                    "time" : "12:15"
            }
    ]
}; 

// //example of save and retrieve from db 
// // //save new instance of the teachermodel, with specific input 
// var teacher_instance = new teacherModel( { initials: 'lca' } ); 

// //save the teachers instance to database 
// teacher_instance.save(function (err) {
//    if (err) return handleError(err);
//    // saved!
// });


console.log("test 1");
var initials = "FTW NOOB ORC"; 

teacherClass.findOneAndUpdate({ initials: initials },
    {
        $set: {
            "totalTests": 5,
            "tests": [worddictate, nonsense, clozetest, interpret, letter] 
        }
    },
    { upsert: true },
    function(err, user) {
        if(err) res.send(err); 
    }
);



//console.log(teacher_instance);
//
//console.log("#########");
//
//teacherModel.find(function (err, teachers) {
//    if (err) return console.error(err);
//    console.log(teachers);
//})



Grid.mongo = mongoose.mongo;



//saves file to db, from folder called "readFrom"
function writeToDB(nameInFolder, nameInDB) {
    db.once('open', function () {
        console.log('- Connection Open -');
        var gfs = Grid(db.db);

        var filePath = path.join(__dirname, 'public/readFrom/' + nameInFolder);

        var writestream = gfs.createWriteStream({
            filename: nameInDB
        });

        fs.createReadStream(filePath).pipe(writestream);

        writestream.on('close', function (file) {
            console.log(file.filename + ' Written to DB');
        });
    });
}



//retrieves file from db, to folder called "writeTo"
// ****** REMEMBER! .mp4 extension on the filenames!! ********
function readFromDB(nameInFolder, nameInDB) {
    db.once('open', function () {
        console.log('- Connection Open -');
        var gfs = Grid(db.db);

        var fs_write_stream = fs.createWriteStream(path.join(__dirname, 'public/writeTo/' + nameInFolder));

        var readstream = gfs.createReadStream({
            filename: nameInDB
        });

        readstream.pipe(fs_write_stream);
        fs_write_stream.on('close', function () {
            console.log('File has been written fully!');
        });
    });
}


// @param (file name from the folder, filename to be called in the db)
// remember .mp4 file extension!
// writeToDB('morslilledreng.mp4', 'new_video.mp4'); 


// @param (file name to be called in folder, filename in the db)
// remember .mp4 file extension!
// readFromDB('video_yourname.mp4', 'new_video.mp4'); 



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
    if (isWelcome === '/welcome') {
        // begin interception
//        console.log('Checking url for teacher ID...')
        req.db = db;
        console.log('Checking db for entries');
        User.find()
        
        var idUrl = req.url.slice(8);
        var collection = db.get('teachers');

        // get the id reference to the collection docs
        collection.find({}).then((docs) => {
            var match = false;

            for (i = 0; i < docs.length; i++) {

                idTeacher = docs[i]._id;

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

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
