var mongoose = require('mongoose'); 



var Schema = mongoose.Schema; 



var teacherSchema = new Schema({
    
	initials: String, 
    
	totalTests: Number,
    
	tests: []

}); 



module.exports = mongoose.model('new_teachers', teacherSchema);