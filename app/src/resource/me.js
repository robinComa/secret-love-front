'use strict';

angular.module('app').factory('Me', function(settings, $resource){

    var Me = $resource(settings.endpoint + 'me/:action', null, {
        isUnique: {
            method:'POST',
            params: {
                action: 'unique'
            }
        },
        authenticate: {
            method:'POST',
            params: {
                action: 'authenticate'
            }
        },
        update: {
            method:'PUT'
        }
    });

    return Me;

});