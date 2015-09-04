'use strict';

var services = angular.module('fileApiTestappApp');

services.factory(
  'MyNodes',
  ['Restangular', '$upload',
   function (Restangular, $upload) {
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
  ['Restangular', '$upload',
   function (Restangular, $upload) {
     var serviceName = '/nodes';

     Restangular.extendCollection(serviceName, function(collection) {
       return collection;
     });

     Restangular.extendModel(serviceName, function(model) {
       model.getFiles = function() { return model.getList('files'); };
       return model;
     });

     var thisService = Restangular.withConfig(function(RestangularConfigurer) {
     }).service(serviceName);

     return thisService;
   }
  ]
);

// services.factory(
//   'Files',
//   ['Restangular', '$upload',
//    function (Restangular, $upload) {

//    }
//   ]
// );



