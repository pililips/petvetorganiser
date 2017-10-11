var bodyParser = require('body-parser'); 	// get body-parser
var User = require('../models/user');
var Pet = require('../models/pet');
var Exam = require('../models/exam');
var jwt = require('jsonwebtoken');
var config = require('../../config');

module.exports = function (app, express) {

    var apiRouter = express.Router();



//////////////////////////////////////////////////////////////////////////////////////////
apiRouter.route('/exams')
    // NE KORISTI ZBOG POLJA PET// Exams samo pravimo preko ljubimca ne direktno
    // create a exam (accessed at POST http://localhost:8080/users)
        .post(function (req, res) {

            var exam = new Exam();      // create a new instance of the Exam model
            exam.description = req.body.description;  
            exam.created_at = req.body.created_at;
            exam.created_by = req.decoded.username;  // set string username iz logovanog korisnika
            exam.pet = req.body.pet; // tesko ce biti postavi pet-a jedini u view nekako
            // exam.pet = [];        //da izaberemo pet-a i da mu uzmemo _id i storujemo ovde

            exam.save(function (err) {

                // return a message
                res.json({data: exam , message: 'Pregled created!'});
            });

        })

        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function (req, res) {

            Exam.find({}, function (err, exams) {
                if (err) res.send(err);

                // return the users
                res.json(exams);
            });
        });



    apiRouter.route('/exams/:exam_id')

    // get the user with that id
        .get(function (req, res) {
            Exam.findById(req.params.exam_id, function (err, exam) {
                if (err) res.send(err);

                // return that user
                res.json(exam);
            });
        })

        // update the user with this id
        .put(function (req, res) {
            Exam.findById(req.params.exam_id, function (err, exam) {

                if (err) res.send(err);

                var currentDate = new Date();
                // set the new user information if it exists in the request
                if (req.body.description) exam.description = req.body.description;
                if (req.body.created_at) exam.created_at = currentDate;
                //if (req.body.created_by) exam.created_by = req.body.created_by;

                // save the user
                exam.save(function (err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({message: 'Exam updated!'});
                });

            });
        })

        // delete the user with this id // kaskadno brisanje... brises exam ali i exams kod pet i usera
        .delete(function (req, res) {


            Exam.findById(req.params.exam_id, function (err, exam) {

                //res.json(exam);
                User.findOne({'username': exam.created_by}, function (err, user) {

                    if (!user) {
                        if (err) res.send(err);

                    } else {

                        user.examsDone.forEach(function(el, i) {
                        // el - current element, i - index
                        //console.log(el.toString());
                        //console.log(exam._id.toString());
                            //console.log(el.toString() == exam._id.toString());
                            if (el.toString() == exam._id.toString()) user.examsDone.splice(i,1);
                           // console.log(i);
                            console.log(user.examsDone);
                        });
                        
                        user.save(function (err) {
                            if (err) res.send(err);

                        });
                    
                    }

                });

                Pet.findOne({'_id': exam.pet }, function (err, pet) {

                    if (!pet) {
                        if (err) res.send(err);

                    } else {

                        console.log(pet);
                        console.log('----------------------');
                        console.log(exam);
                        console.log('----------------------');

                        pet.examsHad.forEach(function(el, i) {
                        // el - current element, i - index
                        console.log(el);
                        console.log(exam._id);
                            console.log(el.toString() == exam._id.toString());
                            if (el.toString() == exam._id.toString()) pet.examsHad.splice(i,1);
                            console.log(pet.examsHad);
                        });

                        pet.save(function (err) {
                            if (err) res.send(err);

                        });
                    
                    }

                });


                //res.send({data : exam});
            });



           Exam.remove({_id: req.params.exam_id
            }, function (err) {

                if (err) res.send(err);

                res.json({ message: 'Obrisan Exam i polje u examsDone i u examsHad!'});
            });


        });

    return apiRouter;
};