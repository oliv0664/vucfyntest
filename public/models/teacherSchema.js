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
        _index: {
            type: Schema.Types.ObjectId,
            index: true,
            required: true, 
            auto: true
        },
        date: Date,
        totalModules: Number,
        modules: { type: Array, default: [] }
	}]
});



var teacherClass = mongoose.model('teachers', teacherSchema);
// var moduleClass = mongoose.model('teachers', moduleSchema); 

module.exports = teacherClass;
