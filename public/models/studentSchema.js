var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var studentSchema = new Schema({
    
	studentID: String, 
    teacherID: String,
	totalTests: Number,
    
	   
}); 



var studentClass = mongoose.model('students', studentSchema);
// var moduleClass = mongoose.model('teachers', moduleSchema); 

module.exports = studentClass;