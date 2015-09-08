'use strict';

/**
 * @ngdoc function
 * @name grumblehissApp.controller:NodeCtrl
 * @description
 * # NodeCtrl
 * Controller of the grumblehissApp
 */
angular.module('grumblehissApp')
  .controller('NodeCtrl', function ($scope, node, Restangular, $http, Upload) {
    $scope.thisNode = node;
    $scope.fileTree = node.getFiles().$object;

    $scope.isFolder = function(inode) { return inode.attributes.kind === 'folder'; };
    $scope.expandFolder = function(folder) {
      folder.fileTree = Restangular.allUrl('files', folder.relationships.files.links.related).getList().$object;
    };

    $scope.deleteFile = function(file) {
      if (window.confirm("Really?")) {
        file.remove().then(
          function() { console.log('deleted'); },
          function() { console.log('nope'); }
        );
      }
    };


    $scope.renameEntity = function(child, newName) {
      return $http.post(child.links.move, {
        action: 'move', path: child.attributes.path, rename: newName
      });
    };


    $scope.download = function(child) {
      return $http.get(child.links.download);
    };


    // $scope.updateFile = function(child) { // file
    //   return $http.put(child.links.upload, {});
    // };

    $scope.createSubfolder = function(child, folderName) {
      if (child.attributes.kind !== 'folder') {
        throw 'nope';
      }
      return $http.put(child.links.new_folder, '', {params: {name: folderName}});
    };

    $scope.uploadFile = function (child, file) {
        Upload.http({
          method: 'PUT',
          url: child.links.upload,
          data: file,
          params: {
            kind: 'file',
            name: file.name
          }
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
        });
    };


    $scope.moveTo = function(child, path) {
      return $http.post(child.links.move, {
        action: 'move', path: path
        // conflict: true, rename: 'rename',
      });
    };

    $scope.copyTo = function(child, path) { // file+folder
      return $http.post(child.links.move, {
        action: 'copy', path: 'path', rename: 'rename',
        conflict: true
      });
    };

    // DELETE
    $scope.rmFile = function(child) {  // file
      if (child.attributes.type === 'folder') {
        throw 'delete() is not valid for a folder. Perhaps you wanted rmTree()?';
      }
      return $http.delete(child.links.download);
    };

    $scope.rmTree = function(child) { // folder
      if (child.attributes.type === 'file') {
        throw 'rmTree() is not valid for a file. Perhaps you wanted delete()?';
      }
      return $http.delete(child.links.upload);
    };



  });
