angular.module('petService', [])

    .factory('Pet', function ($http) {


        var petFactory = {};

        petFactory.get = function (id) {
            return $http.get('/api/pets/' + id);
        };

        petFactory.all = function () {
            return $http.get('/api/pets/');
        };


        petFactory.create = function (petData) {
            return $http.post('/api/pets/', petData);
        };


        petFactory.update = function (id, petData) {
            return $http.put('/api/pets/' + id, petData);
        };


        petFactory.delete = function (id) {
            return $http.delete('/api/pets/' + id);
        };

 
        petFactory.getPetExams = function (id) {
            return $http.get('/api/pets/' + id + '/exams');
        };


        return petFactory;

    });