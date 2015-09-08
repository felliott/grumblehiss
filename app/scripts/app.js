'use strict';

/**
 * @ngdoc overview
 * @name grumblehissApp
 * @description
 * # grumblehissApp
 *
 * Main module of the application.
 */
angular
  .module('grumblehissApp', [
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
