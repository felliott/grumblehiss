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
    node.getFiles().then( function(res) {
      $scope.fileTree = res;
      $scope.$broadcast('fileTree::updated', {fileTree: res});
    });

    $scope.allFolders = [];
    $scope.$on('fileTree::updated', function(event, args) {
      _.forEach(args.fileTree, function(child) {
        if (child.attributes.kind === 'folder') {
          $scope.allFolders.push(child);
        }
      });
    });

    $scope.isFile   = function(inode) { return inode && inode.attributes.kind === 'file'; };
    $scope.isFolder = function(inode) { return inode && inode.attributes.kind === 'folder'; };
    $scope.isFolderExpanded = function(folder) { return folder.showContents; };

    $scope.showSubtree = function(folder) {
      if (!folder.fileTree) {
        $scope.expandFolder(folder);
      }

      folder.showContents = true;
    };
    $scope.hideSubtree = function(folder) { folder.showContents = false; };
    $scope.toggleFolderOpen = function(folder) {
      $scope.isFolderExpanded(folder) ? $scope.hideSubtree(folder) : $scope.showSubtree(folder);
    };

    $scope.expandFolder = function(folder) {
      Restangular.allUrl('files', folder.relationships.files.links.related).getList().then( function(res) {
        folder.fileTree = res;
        $scope.$broadcast('fileTree::updated', {fileTree: res});
      });
    };

    $scope.showActions = function(child) { return child.showActions; };
    $scope.toggleShowActions = function(child) { child.showActions = !child.showActions; };


    $scope.inspectChild = function(child) {
      delete $scope.inspecteeNewFile;
      $scope.inspecteeNewFolder = '';
      $scope.inspecteeRename = '';
      $scope.moveAction = '';
      $scope.inspectee = child;
    };


    // GET
    $scope.download = function(child) {
      return $http.get(child.links.download);
    };

    // PUT
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
    $scope.updateFile = function(child, file) { // file
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


    // POST
    $scope.renameTo = function(child, newName) {
      return $http.post(child.links.move, {
        action: 'move', rename: newName,
        path: child.attributes.path,
        provider: child.attributes.provider,
        resource: $scope.thisNode.id
      });
    };
    $scope.moveOrCopyTo = function(child, action, moveDir) {
      return $http.post(child.links.move, {
        action: action, path: moveDir.attributes.path,
        provider: moveDir.attributes.provider,
        resource: $scope.thisNode.id
        // conflict: true, rename: 'rename',
      });
    };

    // DELETE
    $scope.deleteThis = function(child) {  // file
      var url = child.attributes.kind === 'file'
            ? child.links.download
            : child.links.upload;
      return $http.delete(url);
    };

  });
