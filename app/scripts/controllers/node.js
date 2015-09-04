'use strict';

/**
 * @ngdoc function
 * @name fileApiTestappApp.controller:NodeCtrl
 * @description
 * # NodeCtrl
 * Controller of the fileApiTestappApp
 */
angular.module('fileApiTestappApp')
  .controller('NodeCtrl', function ($scope, node, Restangular) {
    $scope.thisNode = node;
    $scope.nodeFiles = node.getFiles().$object;

    $scope.isFolder = function(file) { return file.attributes.item_type === 'folder'; };
    $scope.expandFolder = function(folder) {
      folder.dir_contents = Restangular.allUrl('files/', folder.links.related.href).getList().$object;
    };


  });
