'use strict';

angular.module('app').factory('Message', function(settings, $resource){

    return $resource(settings.endpoint + 'messages');

});