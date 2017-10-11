var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Exam = require('./exam.js');

var PetSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    owner: {type: String, required: true},
    age: {type: String, required: true},
    gender: {type: String, required: true},
    description : {type: String},
    examsHad : [{ 
    	type: Schema.Types.ObjectId,
    	ref: 'Exam'
    }]
});

PetSchema.pre('save', function (next) {
    var pet = this;

        next();
    });

module.exports = mongoose.model('Pet', PetSchema);