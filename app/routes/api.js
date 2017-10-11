var bodyParser = require('body-parser'); 	
var User = require('../models/user');
var Pet = require('../models/pet');
var Exam = require('../models/exam');
var jwt = require('jsonwebtoken');
var config = require('../../config');


var superSecret = config.secret;

module.exports = function (app, express) {

    var apiRouter = express.Router();

    apiRouter.post('/authenticate', function (req, res) {

        
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (err, user) {

            if (err) throw err;


            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {


                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {

                    var token = jwt.sign({
                        name: user.name,
                        username: user.username
                    }, superSecret, {
                        expiresIn: '12h'
                    });

                    res.json({
                        success: true,
                        message: 'Token Kreiran!',
                        token: token
                    });
                }

            }

        });
    });

    apiRouter.use(function (req, res, next) {
       
        console.log('Neko je dosao !');

      
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

     
        if (token) {

    
            jwt.verify(token, superSecret, function (err, decoded) {

                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'Neuspesna autentifikacija tokena.'
                    });
                } else {
                   
                    req.decoded = decoded;

                    next(); 
                }
            });

        } else {

            
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });


    apiRouter.get('/', function (req, res) {
        res.json({message: 'Dobrodosli u Api!'});
    });

    
    apiRouter.route('/users')

    
        .post(function (req, res) {

            var user = new User();		
            user.name = req.body.name;  
            user.username = req.body.username;  
            user.password = req.body.password;  
            user.examsDone = [];
            user.save(function (err) {
                if (err) {
                   
                    if (err.code == 11000)
                        return res.json({success: false, message: 'A user with that username already exists. '});
                    else
                        return res.send(err);
                }

              
                res.json({message: 'User created!'});
            });

        })

        
        .get(function (req, res) {

            User.find({}, function (err, users) {
                if (err) res.send(err);

               
                res.json(users);
            });
        });


    apiRouter.route('/users/:user_id')


        .get(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);
            }).populate('examsDone').exec(function(err, user) {
                // return that user
                res.json(user);
            });
        })


        .put(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {

                if (err) res.send(err);

              
                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;

             
                user.save(function (err) {
                    if (err) res.send(err);

            
                    res.json({message: 'User updated!'});
                });

            });
        })

     
        .delete(function (req, res) {
            User.remove({
                _id: req.params.user_id
            }, function (err, user) {
                if (err) res.send(err);

                res.json({message: 'Successfully deleted'});
            });
        });


    apiRouter.route('/users/:user_id/exams')


        .get(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);

            }).populate({ path : 'examsDone', populate : {path : 'pet', model : Pet, select : '-examsHad'}}).exec(function(err, user) {
                                    if (err){
                                             res.send({success:false, message:'Error, couldnt populate with tasks.'});
                                             return;
                                             }
                                 res.json(user.examsDone); 
                    });
        })



 
    apiRouter.get('/me', function (req, res) {
        res.send(req.decoded);
    });


///////////////////////////////////////////PETS//////////////////////////////PETS//////////////////////////////////////////////////////////////////////

    apiRouter.route('/pets')

  
        .post(function (req, res) {

            var pet = new Pet();      
            pet.name = req.body.name;  
            pet.type = req.body.type;
            pet.owner = req.body.owner;  
            pet.age = req.body.age;  
            pet.gender = req.body.gender;
            pet.description = req.body.description;
            pet.examsHad = [];

            pet.save(function (err) {
                res.json({message: 'Ljubimac kreiran!'});
            });

        })

        
        .get(function (req, res) {

            Pet.find({}, function (err, pets) {
                if (err) res.send(err);

              
                res.json(pets);
            });
        });



    apiRouter.route('/pets/:pet_id')

        .get(function (req, res) {
            Pet.findById(req.params.pet_id, function (err, pet) {
                if (err) res.send(err);

            }).populate('examsHad').exec(function(err, pet) {
                             if (err){
                                 res.send({success:false, message:'Error, nemoguce popunjavanje sa  pregledima.'});
                                 return;
                            }
                        res.json(pet); 
                    });
        })

        
        .put(function (req, res) {
            Pet.findById(req.params.pet_id, function (err, pet) {

                if (err) res.send(err);

                if (req.body.name) pet.name = req.body.name;
                if (req.body.type) pet.type = req.body.type;
                if (req.body.owner) pet.owner = req.body.owner;
                if (req.body.age) pet.age = req.body.age;
                if (req.body.gender) pet.gender = req.body.gender;
                if (req.body.description) pet.description = req.body.description;

                pet.save(function (err) {
                    if (err) res.send(err);

                    res.json({message: 'Podaci ljubimca azurirani!'});
                });

            });
        })

       
        .delete(function (req, res) {
            Pet.remove({
                _id: req.params.pet_id
            }, function (err, pet) {
                if (err) res.send(err);

                res.json({message: 'Ljubimc uspesno obrisan'});
            });
        });

    apiRouter.route('/pets/:pet_id/exams') 

        .get(function (req, res) {

            Pet.findById(req.params.pet_id, function (err, pet) {
                if (err) res.send(err);

            }).populate('examsHad').exec(function(err, pet) {
                                    if (err){
                                             res.send({success:false, message:'Error, couldnt populate with exams.'});
                                             return;
                                             }
                                 res.json(pet.examsHad); 
                               })
        })

        
        .post(function (req, res) {

            var exam = new Exam();    
            exam.description = req.body.description;  
            //exam.created_at = req.body.created_at;
            exam.created_by = req.decoded.username;  
            exam.pet = req.params.pet_id; 

             exam.save(function (err) {
                 if (err) res.send(err);
       
                console.log("pregled created!");
            });
        
            Pet.findById(req.params.pet_id, function (err, pet) {

                if (err) res.send(err);

                pet.examsHad.push(exam._id);

           
                pet.save(function (err) {
                    if (err) res.send(err);

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

/////////////////////////////////////////EXAMS/////////////////////////////////////////////////EXAMS///////////////////////////////

apiRouter.route('/exams')
    // NE KORISTI ZBOG POLJA PET// Exams samo pravimo preko ljubimca ne direktno
   
        .post(function (req, res) {

            var exam = new Exam();      // create a new instance of the Exam model
            exam.description = req.body.description;  
            exam.created_at = req.body.created_at;
            exam.created_by = req.decoded.username;  // set string username iz logovanog korisnika
            exam.pet = req.body.pet; // tesko ce biti postavi pet-a jedini u view nekako
            // exam.pet = [];        //da izaberemo pet-a i da mu uzmemo _id i storujemo ovde

            exam.save(function (err) {

           
                res.json({data: exam , message: 'Pregled created!'});
            });

        })

        
        .get(function (req, res) {

            Exam.find({}, function (err, exams) {
                if (err) res.send(err);

                // return the users
                res.json(exams);
            })
        });



    apiRouter.route('/exams/:exam_id')

 
        .get(function (req, res) {
            Exam.findById(req.params.exam_id, function (err, exam) {
                if (err) res.send(err);

     
                res.json(exam);
            });
        })

 
        .put(function (req, res) {
            Exam.findById(req.params.exam_id, function (err, exam) {

                if (err) res.send(err);

                var currentDate = new Date();
                // set the new user information if it exists in the request
                if (req.body.description) exam.description = req.body.description;
                if (req.body.created_at) exam.created_at = currentDate;
                //if (req.body.created_by) exam.created_by = req.body.created_by;

                exam.save(function (err) {
                    if (err) res.send(err);

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