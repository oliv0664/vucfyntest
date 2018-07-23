var mongoose = require('mongoose');



var Schema = mongoose.Schema;


//
var moduleSchema = new Schema({
    moduleType: String,
    audio: String,
    content: { type: Array, default: [] },
    contentAnswers: { type: Array, default: [] }
}, {
    usePushEach: true
});
//
//var moduleClass = mongoose.model('modules', moduleSchema); 



var teacherSchema = new Schema({
    initials: String,
    totalTests: Number,
    tests: [{
        date: Date,
        totalModules: Number,
        modules: { type: Array, default: [] }
    }]
}, {
    usePushEach: true
});



var teacherClass = mongoose.model('teachers', teacherSchema);
// var moduleClass = mongoose.model('teachers', moduleSchema); 

module.exports = teacherClass;