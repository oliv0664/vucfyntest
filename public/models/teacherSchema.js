var mongoose = require('mongoose'); 



var Schema = mongoose.Schema; 



var moduleSchema = new Schema({

	type: String,
	audio: String,
	content: { type: Array, "default": [] } 

}); 




var teacherSchema = new Schema({
    
	initials: String, 
	totalTests: Number,
	tests: {
		date: Date,
		totalModules: Number,
		modules: [moduleSchema]
	}
    
}); 



var teacherClass = mongoose.model('teachers', teacherSchema);

module.exports = teacherClass;