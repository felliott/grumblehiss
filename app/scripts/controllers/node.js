'use strict';

/**
 * @ngdoc function
 * @name fileApiTestappApp.controller:NodeCtrl
 * @description
 * # NodeCtrl
 * Controller of the fileApiTestappApp
 */
angular.module('fileApiTestappApp')
  .controller('NodeCtrl', function ($scope, node) {
    $scope.thisNode = node;

    $scope.nodeFiles = node.getFiles().$object;
  });
