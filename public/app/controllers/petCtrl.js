angular.module('petCtrl', ['petService'])

    .controller('petController', function (Pet) {

        var vm = this;

        vm.processing = true;

        Pet.all()
            .then(function (response) {data = response.data; console.log('Pet.all', data);

                vm.processing = false;

                vm.pets = data;
            });


        vm.deletePet = function (id) {
            vm.processing = true;

            Pet.delete(id)
                .then(function (response) {data = response.data; console.log('Pet.delete', data);


                    Pet.all()
                        .then(function (response) {data = response.data; console.log('Pet.delete Pet.all', data);
                            vm.processing = false;
                            vm.pets = data;
                        });

                });
        };

    })


    .controller('petCreateController', function (Pet) {

        var vm = this;


        vm.type = 'create';


        vm.savePet = function () {
            vm.processing = true;
            vm.message = '';

            Pet.create(vm.petData)
                .then(function (response) {data = response.data; console.log('Pet.create', data);
                    vm.processing = false;
                    vm.petData = {};
                    vm.message = data.message;
                });

        };

    })


    .controller('petEditController', function ($routeParams, Pet) {

        var vm = this;


        vm.type = 'edit';


        Pet.get($routeParams.pet_id)
            .then(function (response) {data = response.data;console.log('Pet.get', data);
                vm.petData = data;
            });


        vm.savePet = function () {
            vm.processing = true;
            vm.message = '';


            Pet.update($routeParams.pet_id, vm.petData)
                .then(function (response) {data = response.data; console.log('Pet.update', data);
                    vm.processing = false;

                    Pet.get($routeParams.pet_id)
                        .then(function (response) {data = response.data;
                            vm.petData = data;
                        });

                    vm.message = data.message;
                });
        };

    })


    .controller('petViewController', function ($routeParams, Pet) {

        var vm = this;


        Pet.get($routeParams.pet_id)
            .then(function (response) {data = response.data;console.log('Pet.get', data);
                vm.petData = data;
                vm.numberExams = data.examsHad.length;
                console.log(data.examsHad.length);

                Pet.getPetExams(data._id)
                    .then(function (response) {dataExams = response.data;console.log('Pet.getPetExam', dataExams);
                        vm.dataExams = dataExams;
                        vm.numberExams = dataExams.length;

                    });

            });

    });