'use strict';

angular.module('app').factory('instagram', function(settings, Connection, $q, $http, Friend){

    var LIMIT_TOKEN_STATUS = 429;
    var INVALID_TOKEN_STATUS = 400;

    var connection =  new Connection({
        name: 'instagram',
        isImplemented: true,
        sendTokenRequest: function(){
            var url = 'https://instagram.com/oauth/authorize/';
            url += '?client_id=' + settings.socials.instagram.auth.clientId;
            url += '&redirect_uri=' + settings.socials.instagram.auth.redirectUri;
            url += '&response_type=token';
            url += '&scope=' + settings.socials.instagram.auth.scope.join('+');
            window.location = url;
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(token, getNewToken, close){
            var deferred = $q.defer();
            $http.jsonp('https://api.instagram.com/v1/users/self/follows', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK',
                    count: 1000
                }
            }).then(function(response){
                if(response.data.meta.code === LIMIT_TOKEN_STATUS || response.data.meta.code === INVALID_TOKEN_STATUS){
                    close().then(function(){
                        getNewToken().then(function(){
                            deferred.reject(response.data.meta.error_message);
                        }, deferred.reject);
                    });
                }else{
                    deferred.resolve(response.data.data.map(function(friend){
                        var name = friend.username;
                        if(friend.full_name){
                            name += ' (' + friend.full_name + ')';
                        }
                        return new Friend({
                            id: friend.id,
                            name: name,
                            picture: friend.profile_picture,
                            type: 'instagram'
                        });
                    }));
                }
            }, deferred.reject);
            return deferred.promise;
        }
    });

    return connection;

});