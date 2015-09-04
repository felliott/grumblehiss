'use strict';

/**
 * @ngdoc function
 * @name fileApiTestappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fileApiTestappApp
 */
angular.module('fileApiTestappApp')
  .controller('MainCtrl', function ($scope, MyNodes, Nodes) {
    MyNodes.getList().then( function(res) {
      $scope.nodeList = res;
      _.forEach($scope.nodeList, function(node) {
        node.files = Nodes.one(node.id).getFiles().$object;
      });
    });
  })
  .controller('LoginCtrl', function ($scope, $location, AuthService) {
    $scope.loginFailed = false;

    $scope.login = function(username, password) {
      $scope.loginFailed = false;
      AuthService.Login(username, password).then(
        function(response) {
          AuthService.SetCredentials(username, password);
          $location.path('/');
        },
        function(response) {
          $scope.loginFailed = true;
        }
      );
    };
  });
