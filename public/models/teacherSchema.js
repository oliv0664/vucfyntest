var mongoose = require('mongoose');



var Schema = mongoose.Schema;


//
var moduleSchema = new Schema({
    moduleType: String,
    audio: String,
    content: {
        type: Schema.Types.Mixed,
        default: {}

    }
});
//
//var moduleClass = mongoose.model('modules', moduleSchema); 



var teacherSchema = new Schema({
    initials: String,
    totalTests: Number,
    tests: [{
        date: Date,
        totalModules: Number,
        modules: [moduleSchema]
	}]
});



var teacherClass = mongoose.model('teachers', teacherSchema);
// var moduleClass = mongoose.model('teachers', moduleSchema); 

module.exports = teacherClass;
