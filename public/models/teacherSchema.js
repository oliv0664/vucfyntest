var mongoose = require('mongoose'); 



var Schema = mongoose.Schema; 



var teacherSchema = new Schema({
    
	initials: String, 
	totalTests: Number,
	tests: { type: Array, "default": [] }
    
}); 


var teacherClass = mongoose.model('teachers', teacherSchema);
module.exports = teacherClass;