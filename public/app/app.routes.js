angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider


		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		

		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})

		.when('/profile', {
			templateUrl: 'app/views/pages/profile/me.html',
			controller: 'meController',
			controllerAs: 'me',
			access: {
        		restricted: true
      		}
		})
		

		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		.when('/users/edit', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})


		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/userProfile.html',
			controller: 'userViewController',
			controllerAs: 'user'
		})

		.when('/pets', {
			templateUrl: 'app/views/pages/pets/all.html',
			controller: 'petController',
			controllerAs: 'pet'
		})

		.when('/pets/create', {
			templateUrl: 'app/views/pages/pets/single.html',
			controller: 'petCreateController',
			controllerAs: 'pet'
		})

		.when('/pets/:pet_id/edit', {
			templateUrl: 'app/views/pages/pets/single.html',
			controller: 'petEditController',
			controllerAs: 'pet'
		})

		.when('/pets/:pet_id/new', {
			templateUrl: 'app/views/pages/exams/single.html',
			controller: 'examCreateController',
			controllerAs: 'exam'
		})


		.when('/pets/:pet_id', {
			templateUrl: 'app/views/pages/pets/petProfile.html',
			controller: 'petViewController',
			controllerAs: 'pet'
		})

		.when('/exams', {
			templateUrl: 'app/views/pages/exams/all.html',
			controller: 'examController',
			controllerAs: 'exam'
		})

		.when('/exams/:exam_id', {
			templateUrl: 'app/views/pages/exams/single.html',
			controller: 'examEditController',
			controllerAs: 'exam'
		})

		.otherwise({
      		redirectTo: '/'
    	});

	$locationProvider.html5Mode(true);

});
