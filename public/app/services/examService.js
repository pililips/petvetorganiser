angular.module('examService', [])

    .factory('Exam', function ($http) {

        var examFactory = {};


        examFactory.get = function (id) {
            return $http.get('/api/exams/' + id);
        };

  
        examFactory.all = function () {
            return $http.get('/api/exams/');
        };



        examFactory.create = function (id, examData) {
            return $http.post('/api/pets/' + id +'/exams', examData);
        };



        examFactory.update = function (id, examData) {
            return $http.put('/api/exams/' + id, examData);
        };


        examFactory.delete = function (id) {
            return $http.delete('/api/exams/' + id);
        };

        examFactory.getPet = function (id) {
            return $http.get('/api/pets/' + id);
        };

        examFactory.getPetExams = function (id) {
            return $http.get('/api/pets/' + id + 'exams');
        };

        return examFactory;

    });