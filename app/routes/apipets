
var bodyParser = require('body-parser'); 	// get body-parser
var User = require('../models/user');
var Pet = require('../models/pet');
var Exam = require('../models/exam');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {

    var apiRouter = express.Router();
   
    apiRouter.route('/pets')

    // create a user (accessed at POST http://localhost:8080/users)
        .post(function (req, res) {

            var pet = new Pet();      // create a new instance of the User model
            pet.name = req.body.name;  // set the users name (comes from the request)
            pet.type = req.body.type;
            pet.owner = req.body.owner;  // set the users username (comes from the request)
            pet.age = req.body.age;  // set the users password (comes from the request)
            pet.gender = req.body.gender;
            pet.description = req.body.description;
            pet.examsHad = [];

            pet.save(function (err) {
                // return a message
                res.json({message: 'Pet created!'});
            });

        })

        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function (req, res) {

            Pet.find({}, function (err, pets) {
                if (err) res.send(err);

                // return the users
                res.json(pets);
            });
        });



    apiRouter.route('/pets/:pet_id')

    // get the user with that id
        .get(function (req, res) {
            Pet.findById(req.params.pet_id, function (err, pet) {
                if (err) res.send(err);

                // return that user
            }).populate('examsHad').exec(function(err, pet) {
                                    if (err){
                                             res.send({success:false, message:'Error, couldnt populate with exams.'});
                                             return;
                                             }
                                 res.json(pet); //get only examsDone
                    });
        })

        // update the user with this id
        .put(function (req, res) {
            Pet.findById(req.params.pet_id, function (err, pet) {

                if (err) res.send(err);

                // set the new user information if it exists in the request
                if (req.body.name) pet.name = req.body.name;
                if (req.body.type) pet.type = req.body.type;
                if (req.body.owner) pet.owner = req.body.owner;
                if (req.body.age) pet.age = req.body.age;
                if (req.body.gender) pet.gender = req.body.gender;
                if (req.body.description) pet.description = req.body.description;

                // save the user
                pet.save(function (err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({message: 'Pet updated!'});
                });

            });
        })

        // delete the user with this id
        .delete(function (req, res) {
            Pet.remove({
                _id: req.params.pet_id
            }, function (err, pet) {
                if (err) res.send(err);

                res.json({message: 'Successfully deleted'});
            });
        });

    apiRouter.route('/pets/:pet_id/exams') // dobijes cisto exams od specific pet

    // get the user Pregledi!!!
        .get(function (req, res) {
            Pet.findById(req.params.pet_id, function (err, pet) {
                if (err) res.send(err);
                // return that user
            }).populate('examsHad').exec(function(err, pet) {
                                    if (err){
                                             res.send({success:false, message:'Error, couldnt populate with exams.'});
                                             return;
                                             }
                                 res.json(pet.examsHad); //get only examsDone
                    });


        })

        // create a exam for that specific pet // add to pet model and to user model exam ref
        .post(function (req, res) {

            var exam = new Exam();      // create a new instance of the Exam model
            exam.description = req.body.description;  
            exam.created_at = req.body.created_at;
            exam.created_by = req.decoded.username;  // set string username iz logovanog korisnika
            exam.pet = req.params.pet_id; 

             exam.save(function (err) {
                 if (err) res.send(err);
                // return a message
                //res.json({ message: 'Pregled created!'});
                console.log("pregled created!");
            });
             // update pet too ? simulate joints? 
            Pet.findById(req.params.pet_id, function (err, pet) {

                if (err) res.send(err);

                pet.examsHad.push(exam._id);

                // save the user
                pet.save(function (err) {
                    if (err) res.send(err);
                    // return a message
                    //res.json({data: pet, message: 'Pet updated!'});
                    console.log("pet updated because pregled created");
                });

            });

            User.findOne({'username': exam.created_by}, function (err, user) {

            if (!user) {
                if (err) res.send(err);
            } else {

                user.examsDone.push(exam._id);
                user.save(function (err) {
                    if (err) res.send(err);
                    console.log("user upadated becouse pregled created!");
                    res.json({ message: 'Pet Exam Created!'});
                });
            }

        });

        });

    return apiRouter;
};