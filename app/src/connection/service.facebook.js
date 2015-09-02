'use strict';

angular.module('app').factory('facebook', function(settings, Connection, Friend, $http, $q) {

    return new Connection({
        name: 'facebook',
        isImplemented: true,
        sendTokenRequest: function(){
            var url = 'https://www.facebook.com/v2.0/dialog/oauth';
            url += '?app_id=' + settings.socials.facebook.auth.clientId;
            url += '&redirect_uri=' + settings.socials.facebook.auth.redirectUri;
            url += '&scope=' + settings.socials.facebook.auth.scope.join(',');
            window.location = url;
            return $q.when();
        },
        getTokenWithCode: function(code){
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'https://graph.facebook.com/oauth/access_token',
                params: {
                    code: code,
                    client_id: settings.socials.facebook.auth.clientId,
                    client_secret: settings.socials.facebook.auth.clientSecret,
                    redirect_uri: settings.socials.facebook.auth.redirectUri
                }
            }).then(function(resp){
                var token = resp.data.match(/access_token\=([^&]+)/)[1];
                deferred.resolve(token);
            });
            return deferred.promise;
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(token){
            var deferred = $q.defer();
            $http.jsonp('https://graph.facebook.com/v2.4/me/taggable_friends?limit=1000&fields=id,name,picture', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                deferred.notify(response.data.data.map(function(friend){
                    return new Friend({
                        id: friend.name,
                        name: friend.name,
                        picture: friend.picture.data.url,
                        type: 'facebook'
                    });
                }));
                deferred.resolve();
            });
            return deferred.promise;
        }
    });

});