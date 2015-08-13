'use strict';

angular.module('app').factory('Me', function(settings, $resource){

    return $resource(settings.endpoint + 'me');

});