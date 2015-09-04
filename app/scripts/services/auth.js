'use strict';

var services = angular.module('fileApiTestappApp');

// mostly cribbed from http://jasonwatmore.com/post/2014/05/26/AngularJS-Basic-HTTP-Authentication-Example.aspx

services.factory('AuthService',
  ['$http', 'Restangular', function($http, Restangular) {
     var service = {};

     function _getBasicAuth(username, password) {
       return 'Basic ' + window.btoa(username + ':' + password);
     }

     service.Login = function(username, password) {
       return $http.get(
         'http://localhost:8000/v2/users/me/',
         { headers: {'Authorization':_getBasicAuth(username, password)} }
       );
     };

     service.SetCredentials = function (username, password) {
       $http.defaults.headers.common['Authorization'] = _getBasicAuth(username, password);
       Restangular.setDefaultHeaders({'Authorization': _getBasicAuth(username, password)});
     };

     service.ClearCredentials = function() {
       delete $http.defaults.headers.common['Authorization'];
       Restangular.setDefaultHeaders({'Authorization': ''});
     };

     return service;
   }
  ]
);

