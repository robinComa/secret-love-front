'use strict';

angular.module('app').factory('SecretBox', function(settings, $resource){

    return $resource(settings.endpoint + 'secretbox');

});