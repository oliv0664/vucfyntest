var mongoose = require('mongoose'); 



var Schema = mongoose.Schema; 



var moduleSchema = new Schema({

	type: String,
	audio: String,
	content: { type: Array, default: [] } 

}); 

var moduleClass = mongoose.model('modules', moduleSchema); 



var teacherSchema = new Schema({
    
	initials: String, 
	totalTests: Number,
	tests: [{
		date: Date,
		totalModules: Number,
		modules: [{
			type: String,
			audio: String, 
			content: { type: [moduleSchema], default: [] }
		}]
	}]
    
}); 



var teacherClass = mongoose.model('teachers', teacherSchema);
// var moduleClass = mongoose.model('teachers', moduleSchema); 

module.exports = teacherClass;