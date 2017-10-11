angular.module('mainCtrl', [])

    .controller('mainController', function ($rootScope, $location, Auth) {

        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();


        $rootScope.$on('$routeChangeStart', function () {
            vm.loggedIn = Auth.isLoggedIn();

            Auth.getUser()
                .then(function (response) {console.log('Auth.getUser', response);
                    vm.user = response.data;
                });
        });


        vm.doLogin = function () {
            vm.processing = true;


            vm.error = '';

            Auth.login(vm.loginData.username, vm.loginData.password)
                .then(function (data) {console.log('Auth.login', data);
                    vm.processing = false;


                    if (data.success)
                        $location.path('/pets');
                    else
                        vm.error = data.message;

                });
        };


        vm.doLogout = function () {
            Auth.logout();
            vm.user = {};

            $location.path('/login');
        };

    });
