'use strict';

angular.module('app').factory('Proxy', function(settings, $resource){

    var Proxy = $resource(settings.endpoint + 'proxy/:action', null, {
        getViadeoFriends: {
            method:'POST',
            params: {
                action: 'viadeo-friends'
            },
            isArray: true
        },
        getViadeoMe: {
            method:'POST',
            params: {
                action: 'viadeo-me'
            }
        }
    });

    return Proxy;

});