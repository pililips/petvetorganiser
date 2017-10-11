var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Pet = require('./pet.js');
var User = require('./user.js');

var ExamSchema = new Schema({
    description : {type: String, required: true},
  	created_at:{type:Date, default: Date.now},
  	created_by: {type:String, required: true},
    pet : {
    	type: Schema.Types.ObjectId,
    	ref: 'Pet'
    }
});

ExamSchema.pre('save', function (next) {
    var exam = this;
    var currentDate = new Date();
    exam.created_at = currentDate;
     // Date.now je dovoljan ako se nigde ne pokusava upisati neka vrednost u created_at
        next();
    });

module.exports = mongoose.model('Exam', ExamSchema);