'use strict';

/**
 * @ngdoc function
 * @name fileApiTestappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fileApiTestappApp
 */
angular.module('fileApiTestappApp')
  .controller('MainCtrl', function ($scope, MyNodes) {
    $scope.nodeList = MyNodes.getList().$object;
  });
