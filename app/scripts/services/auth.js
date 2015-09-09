'use strict';

var services = angular.module('grumblehissApp');

// mostly cribbed from http://jasonwatmore.com/post/2014/05/26/AngularJS-Basic-HTTP-Authentication-Example.aspx

services.factory('AuthService',
  ['$http', 'Restangular', '$cookieStore', 'API_CONFIG',
   function($http, Restangular, $cookieStore, API_CONFIG) {
     var service = {};

     function _getBasicAuth(username, password) {
       return 'Basic ' + window.btoa(username + ':' + password);
     }

     service.Login = function(username, password) {
       return $http.get(
         API_CONFIG.BASE_URL + '/users/me/',
         { headers: {'Authorization':_getBasicAuth(username, password)} }
       );
     };

     service.SetCredentials = function (username, password) {
       var basicAuth = _getBasicAuth(username, password);
       $http.defaults.headers.common.Authorization = basicAuth;
       Restangular.setDefaultHeaders({'Authorization': basicAuth});
       $cookieStore.put('basicAuth', basicAuth);
     };

     service.ClearCredentials = function() {
       delete $http.defaults.headers.common.Authorization;
       Restangular.setDefaultHeaders({'Authorization': ''});
       $cookieStore.remove('basicAuth');
     };

     return service;
   }
  ]
);

