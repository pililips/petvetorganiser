angular.module('userCtrl', ['userService', 'examService'])

    .controller('userController', function (User) {

        var vm = this;

        vm.processing = true;

        User.all()
            .then(function (response) {data = response.data; console.log('User.all', data);


                vm.processing = false;

                vm.users = data;
            });


        vm.deleteUser = function (id) {
            vm.processing = true;

            User.delete(id)
                .then(function (response) {data = response.data; console.log('User.delete', data);


                    User.all()
                        .then(function (response) {data = response.data; console.log('User.delete User.all', data);
                            vm.processing = false;
                            vm.users = data;
                        });

                });
        };

    })


    .controller('userCreateController', function (User) {

        var vm = this;


        vm.type = 'create';

        vm.saveUser = function () {
            vm.processing = true;
            vm.message = '';


            User.create(vm.userData)
                .then(function (response) {data = response.data; console.log('User.create', data);
                    vm.processing = false;
                    vm.userData = {};
                    vm.message = data.message;
                });

        };

    })

    .controller('userEditController', function ($routeParams, User) {

        var vm = this;


        vm.type = 'edit';


            User.getMe()
                .then(function (response) {data = response.data;console.log('User.getMe', data);

                User.all()
                    .then(function (response) {dataAll = response.data; console.log('User.all', dataAll);

                        console.log(dataAll);
                        dataAll.forEach(function(el, i) {

                            if (el.username.toString() == data.username.toString()){ profileData = el;}


                        });

                        vm.userData = profileData;



                });

                });

        vm.saveUser = function () {
            vm.processing = true;
            vm.message = '';


            User.update(vm.userData._id, vm.userData)
                .then(function (response) {data = response.data; console.log('User.update', data);
                    vm.processing = false;



                    User.get(vm.userData._id)
                        .then(function (response) {data = response.data;
                            vm.userData = data;
                        });


                    vm.message = data.message;
                });
        };

    })


    .controller('userViewController', function ($routeParams, User) {

        var vm = this;


        User.get($routeParams.user_id)
            .then(function (response) {data = response.data;console.log('User.get', data);
                vm.userData = data;
                vm.numberExams = data.examsDone.length;
                console.log(data.examsDone.length);

                User.getUserExams(data._id)
                    .then(function (response) {dataExams = response.data;console.log('User.getUserExams', dataExams);
                        vm.dataExams = dataExams;
                        vm.numberExams = dataExams.length;

                    });

            });

    })

    .controller('meController', function (User, Exam) {

        var vm = this;

        User.getMe()
            .then(function (response) {data = response.data;console.log('User.getMe', data);



            User.all()
                .then(function (response) {dataAll = response.data; console.log('User.all', dataAll);


                    dataAll.forEach(function(el, i) {

                        if (el.username.toString() == data.username.toString()){ profileData = el;}


                    });

                    vm.profileData = profileData;

                User.getUserExams(profileData._id)
                    .then(function (response) {dataExams = response.data;console.log('User.getUserExams', dataExams);
                        vm.dataExams = dataExams;
                        vm.numberExams = dataExams.length;

                    });




            });

            });

            vm.deleteExam = function (id) {
            vm.processing = true;

                Exam.delete(id)
                    .then(function (response) {data = response.data; console.log('Exam.delete', data);

                    User.getMe()
                        .then(function (response) {data = response.data;console.log('User.getMe', data);

                            User.all()
                                .then(function (response) {dataAll = response.data; console.log('User.all', dataAll);

                                    dataAll.forEach(function(el, i) {
                                    if (el.username.toString() == data.username.toString()){ profileData = el;}
                                    });

                                    vm.profileData = profileData;
     
                                    User.getUserExams(profileData._id)
                                        .then(function (response) {dataExams = response.data;console.log('User.getUserExams', dataExams);
                                            vm.dataExams = dataExams;
                                            vm.numberExams = dataExams.length;

                                    });

                            });

                    });

                });
            };

    });

