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

     return Restangular.service(serviceName);
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

     return Restangular.service(serviceName);
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
       return model;
     });

     return Restangular.service(serviceName);

   }
  ]
);



