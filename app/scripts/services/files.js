'use strict';

var services = angular.module('grumblehissApp');

services.factory(
  'MyNodes',
  ['Restangular',
   function (Restangular) {
     var serviceName = '/users/me/nodes';

     Restangular.extendCollection(serviceName, function(collection) {
       return collection;
     });

     Restangular.extendModel(serviceName, function(model) {
       return model;
     });

     var thisService = Restangular.withConfig(function(RestangularConfigurer) {
     }).service(serviceName);

     return thisService;
   }
  ]
);

services.factory(
  'Nodes',
  ['Restangular',
   function (Restangular) {
     var serviceName = 'nodes';

     Restangular.extendCollection(serviceName, function(collection) {
       return collection;
     });

     Restangular.extendModel(serviceName, function(model) {
       model.getFiles = function() { return model.getList('files/'); };
       return model;
     });

     var thisService = Restangular.withConfig(function(RestangularConfigurer) {
     }).service(serviceName);

     return thisService;
   }
  ]
);

services.factory(
  'Files',
  ['Restangular',
   function (Restangular) {
     var serviceName = 'files';

     Restangular.extendCollection(serviceName, function(collection) {
       return collection;
     });

     Restangular.extendModel(serviceName, function(model) {

       // GET
       model.download = function() { // file
         return model.customGET(model.links.download);
       };

       // PUT
       model.createSubfolder = function() { // folder-only
         return model.customPUT(model.links.new_folder);
       };
       model.uploadFile = function() { // folder-only
         return model.customPUT(model.links.upload);
       };
       model.updateFile = function() { // file
         return model.customPUT(model.links.upload);
       };
       // model.rename = function() {  // file+folder
       //   return model.put(model.links.upload);
       // };

       // POST
       model.moveTo = function() { // file+folder
         return model.customPOST(model.links.move, {
           action: 'move', path: 'path', rename: 'rename',
           conflict: true
         });
       };
       model.copyTo = function() { // file+folder
         return model.customPOST(model.links.move, {
           action: 'copy', path: 'path', rename: 'rename',
           conflict: true
         });
       };

       // DELETE
       model.delete = function() {  // file
         if (model.attributes.type === 'folder') {
           throw 'delete() is not valid for a folder. Perhaps you wanted rmTree()?';
         }
         return model.remove();
       };
       model.rmTree = function() { // folder
         if (model.attributes.type === 'file') {
           throw 'rmTree() is not valid for a file. Perhaps you wanted delete()?';
         }
         return model.remove();
       };



       model.viewVersions = function() {};

       return model;
     });

     var thisService = Restangular.withConfig(function(RestangularConfigurer) {
     }).service(serviceName);

     return thisService;

   }
  ]
);



