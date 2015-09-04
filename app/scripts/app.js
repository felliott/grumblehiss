'use strict';

/**
 * @ngdoc overview
 * @name fileApiTestappApp
 * @description
 * # fileApiTestappApp
 *
 * Main module of the application.
 */
angular
  .module('fileApiTestappApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',

    'restangular',
    'angularFileUpload'
  ])
  .config(function ($routeProvider, $httpProvider, RestangularProvider) {
    var authuser = 'test',
        authpass = 'test',
        authkey = window.btoa(authuser + ':' + authpass);

    RestangularProvider.setBaseUrl("http://localhost:8000/v2");
    RestangularProvider.setDefaultHeaders({'Authorization': 'Basic ' + authkey});
    RestangularProvider.setRequestSuffix('/');
    RestangularProvider.setResponseExtractor(function(response) {
        return response.data;
    });
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/node/:nodeId', {
        templateUrl: 'views/node.html',
        controller: 'NodeCtrl',
        controllerAs: 'node',
        resolve: {
          node: ['$route', 'Nodes', function($route, Nodes) {
            return Nodes.one($route.current.params.nodeId).get();
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
