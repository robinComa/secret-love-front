'use strict';

angular.module('app').factory('Dialog', function(settings, $resource){

    return $resource(settings.endpoint + 'dialogs/:type/:id');

});