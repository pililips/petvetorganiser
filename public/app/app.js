angular.module('PetVetApp', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService', 'petCtrl', 'petService', 'examCtrl', 'examService'])


.config(function($httpProvider) {


	$httpProvider.interceptors.push('AuthInterceptor');

});