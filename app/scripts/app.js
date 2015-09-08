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
    'ngFileUpload'
  ])
  .config(function ($routeProvider, $httpProvider, RestangularProvider) {

    RestangularProvider.setBaseUrl("http://localhost:8000/v2");
    RestangularProvider.setRequestSuffix('/');
    RestangularProvider.setResponseExtractor(function(response) {
        return response.data;
    });
    RestangularProvider.setRestangularFields({
      selfLink: 'links.self'
    });



    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
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
        redirectTo: '/login'
      });
  })
  .run(['$rootScope', '$location', '$cookieStore', '$http', 'Restangular',
    function ($rootScope, $location, $cookieStore, $http, Restangular) {
      $rootScope.$on('$locationChangeStart', function () {
        var basicAuth = $cookieStore.get('basicAuth');
        if (basicAuth) {
          $http.defaults.headers.common['Authorization'] = basicAuth;
          Restangular.setDefaultHeaders({'Authorization': basicAuth});
        }

        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !$http.defaults.headers.common['Authorization']) {
          $location.path('/login');
        }
      });
    }
  ]);
