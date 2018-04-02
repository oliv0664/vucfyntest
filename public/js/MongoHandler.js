var path = require('path');
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/vucfyntest';
var Grid = require('gridfs-stream');
var fs = require('fs');

var empty = require('empty-folder'); 

var options = {
    useMongoClient: true
};
mongoose.connect(mongoDB, options);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.on('connected', function(){console.log('connected correctly to db.');  });

Grid.mongo = mongoose.mongo;

// module.exports = { db: db, grid: Grid}

module.exports = {
    writeToDB: function(nameInFolder, nameInDB) {
        console.log("$$$$$$"); 
        db.once('open', function () {
            console.log('- Connection Open -');
            var gfs = Grid(db.db);
    
            var filePath = path.join(__dirname, '../readFrom/' + nameInFolder);
    
            var writestream = gfs.createWriteStream({
                filename: nameInDB
            });
    
            fs.createReadStream(filePath).pipe(writestream);
    
            writestream.on('close', function (file) {
                console.log(file.filename + ' Written to DB');

                //when files are uploaded, they are removed from 'readFrom' folder
                empty('./public/readfrom', false, function(err, removed, failed) {
                    if(err) { console.error(err); }
            
                    console.log("REMOVED " + removed); 
                    console.log("FAILED " + failed); 
                });
            });
        });
    },

    readFromDB: function(nameInFolder, nameInDB) {
        db.once('open', function () {
            console.log('- Connection Open -');
            var gfs = Grid(db.db);
    
            var fs_write_stream = fs.createWriteStream(path.join(__dirname, '../writeTo/' + nameInFolder));
    
            var readstream = gfs.createReadStream({
                filename: nameInDB
            });
    
            readstream.pipe(fs_write_stream);
            fs_write_stream.on('close', function () {
                console.log('File has been written fully!');
            });
        });
    },

    test: function() {
        console.log("TEST FUNCTION FROM APP"); 
    }
}
//saves file to db, from folder called "readFrom"



//retrieves file from db, to folder called "writeTo"
// ****** REMEMBER! .mp4 extension on the filenames!! ********


// @param (file name from the folder, filename to be called in the db)
// remember .mp4 file extension!
// writeToDB('test.mp3', 'new_audio.mp3'); 


// @param (file name to be called in folder, filename in the db)
// remember .mp4 file extension!
// readFromDB('video_yourname.mp4', 'new_video.mp4'); 