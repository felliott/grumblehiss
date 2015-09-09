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
      _.forEach($scope.fileTree, function(child) { child.parent = _.clone($scope.thisNode.plain()); });
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
        _.forEach(folder.fileTree, function(child) {
          child.parent = _.clone(_.omit(Restangular.stripRestangular(folder), 'fileTree'));
        });
        $scope.$broadcast('fileTree::updated', {fileTree: res});
      });
    };

    $scope.showActions = function(child) { return child.showActions; };
    $scope.toggleShowActions = function(child) { child.showActions = !child.showActions; };


    $scope.inspectChild = function(child, parent) {
      delete $scope.inspecteeNewFile;
      $scope.inspectParent = parent;
      $scope.inspecteeNewFolder = '';
      $scope.inspecteeRename = child.attributes.name;
      $scope.moveAction = '';
      $scope.moveTarget = parent.attributes.path;
      $scope.inspectee = child;
    };


    // GET
    $scope.download = function(child) {
      return $http.get(child.links.download);
    };
    $scope.downloadUrlFor = function(child) {
      if (!child) {
        return '';
      }
      else if (child.attributes.kind === 'file') {
        return child.links.download;
      }
      return child.links.upload + '?zip=';
    };


    // PUT
    $scope.createSubfolder = function(child, folderName) {
      if (child.attributes.kind !== 'folder') {
        throw 'nope';
      }
      return $http.put(child.links.new_folder, '', {params: {name: folderName}})
        .then(
          function(res) {
            addAlert(
              'success', 'Succesfully created subfolder "' + folderName + '"'
            );
          },
          function(res) {
            addAlert(
              'danger', 'Failed to create subfolder "' + folderName +
                '" because: ' + res.statusText
            );
          }
        );
    };
    $scope.uploadFile = function (child, file) {
      _uploadFile(child, file).then(
          function(res) {
            addAlert(
              'success', 'Succesfully uploaded "' + file.name +
                '" to "' + child.attributes.name + '".'
            );
          },
          function(res) {
            addAlert(
              'danger', 'Failed to upload "' + file.name +
                '" to "' + child.attributes.name + '" because: ' + res.statusText
            );
          }
      );
    };
    $scope.updateFile = function(child, file) {
      _uploadFile(child, file).then(
          function(res) {
            addAlert(
              'success', 'Succesfully updated "' + file.name + '".'
            );
          },
          function(res) {
            addAlert(
              'danger', 'Failed to update "' + file.name +
                '" because: ' + res.statusText
            );
          }
      );
    };
    function _uploadFile(child, file) {
      return Upload.http({
        method: 'PUT',
        url: child.links.upload,
        data: file,
        params: {
          kind: 'file',
          name: file.name
        }
      });
    }

    // POST
    $scope.renameTo = function(child, newName) {
      return $http.post(child.links.move, {action: 'rename', rename: newName})
        .then(
          function(res) {
            addAlert(
              'success', '"' + child.attributes.name +
                '" was renamed to "' + newName + '".'
            );
            child.attributes.name = res.data.name;
          },
          function(res) {
            addAlert(
              'danger', 'Could not rename "' + child.attributes.name +
                '" to "' + newName + '" because: ' + res.statusText
            );
          }
        );

    };
    $scope.moveOrCopyTo = function(child, action, moveDir) {
      return $http.post(child.links.move, {
        action: action, path: moveDir
        // resource: $scope.thisNode.id
        // conflict: true, rename: 'rename',
      })
        .then(
          function(res) {
            addAlert(
              'success', child.attributes.name +
                ' was ' + (action === 'move' ? 'moved' : 'copied') +
                ' to "' + moveDir + '".'
            );
          },
          function(res) {
            addAlert(
              'danger', 'Could not ' + action + ' ' + child.attributes.name +
                ' to "' + moveDir + '" because: ' + res.statusText
            );
          }
        );
    };

    // DELETE
    $scope.deleteThis = function(child) {  // file
      var url = child.attributes.kind === 'file'
            ? child.links.download
            : child.links.upload;
      return $http.delete(url).then(
        function(res) {
          addAlert(
            'success', child.attributes.kind + ' ' +
              child.attributes.name + ' was successfully deleted.'
          );
        },
        function(res) {
          addAlert(
            'danger', 'Could not delete ' + child.attributes.name +
              ' because: ' + res.statusText
          );
        }
      );
    };


    function addAlert(type, msg) {
      $scope.alerts.push({class: 'alert-' + type, msg: msg});
    }

    $scope.alerts = [];
    $scope.dismissAlert = function(alertIdx) {
      $scope.alerts.splice(alertIdx, 1);
    };

  });
