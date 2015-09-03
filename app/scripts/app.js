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
    'ngTouch'
  ])
  .config(function ($routeProvider, $httpProvider) {
    var authuser = 'test',
        authpass = 'test',
        authkey = window.btoa(authuser + ':' + authpass);

    $httpProvider.defaults.headers.common.Authorization = 'Basic ' + authkey;

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
      .otherwise({
        redirectTo: '/'
      });
  });
