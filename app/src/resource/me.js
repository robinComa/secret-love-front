'use strict';

angular.module('app').factory('Me', function(settings, $resource, $q, $injector){

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
        logout: {
            method:'GET',
            params: {
                action: 'logout'
            }
        },
        forgotPassword: {
            method:'POST',
            params: {
                action: 'forgot-password'
            }
        },
        update: {
            method:'PUT'
        },
        disconnect: {
            method:'PUT',
            params: {
                action: 'disconnect'
            }
        },
        connect: {
            method:'POST',
            params: {
                action: 'connect'
            }
        }
    });

    Me.getSocialsMe = function(){

        var promises = [];

        angular.forEach(settings.socials, function(social, name){
            var socialService = $injector.get(name);
            if(socialService.isConnected()){
                var promise = socialService.getMe();
                promises.push(promise);
            }
        });

        return $q.all(promises);
    };

    return Me;

});