angular.module('examCtrl', ['examService'])

    .controller('examController', function (Exam) {

        var vm = this;


        vm.processing = true;


        Exam.all()
            .then(function (response) {data = response.data; console.log('Exam.all', data);


                vm.processing = false;


                vm.exams = data;
            });



        vm.deleteExam = function (id) {
            vm.processing = true;

            Exam.delete(id)
                .then(function (response) {data = response.data; console.log('Exam.delete', data);

                    Exam.all()
                        .then(function (response) {data = response.data; console.log('Exam.delete Exam.all', data);
                            vm.processing = false;
                            vm.exams = data;
                        });

                });
        };

    })


    .controller('examCreateController', function ($routeParams,Exam) {

        var vm = this;
        vm.type = 'create';

        vm.saveExam = function () {
            vm.processing = true;
            vm.message = '';


            Exam.getPet($routeParams.pet_id)
            .then(function (response) {data = response.data;console.log('Exam.getPet', data);
                vm.pet = data._id;
                console.log(data._id);
            });

            Exam.create($routeParams.pet_id, vm.examData)
                .then(function (response) {data = response.data; console.log('Exam.create', data);
                    vm.processing = false;
                    vm.examData = {};
                    vm.message = data.message;
                });
        };

    })


    .controller('examEditController', function ($routeParams, Exam) {

        var vm = this;


        vm.type = 'edit';


        Exam.get($routeParams.exam_id)
            .then(function (response) {data = response.data;console.log('Exam.get', data);
                vm.examData = data;
            });


        vm.saveExam = function () {
            vm.processing = true;
            vm.message = '';

            Exam.update($routeParams.exam_id, vm.examData)
                .then(function (response) {data = response.data; console.log('Exam.update', data);
                    vm.processing = false;


                    Exam.get($routeParams.exam_id)
                        .then(function (response) {data = response.data;
                            vm.examData = data;
                        });

                    vm.message = data.message;
                });
        };

    });