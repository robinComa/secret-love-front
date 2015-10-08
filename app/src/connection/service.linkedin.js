'use strict';

angular.module('app').factory('linkedin', function(settings, Connection, $http, $q) {

    return new Connection({
        name: 'linkedin',
        isImplemented: false,
        sendTokenRequest: function(){
            var url = 'https://www.linkedin.com/uas/oauth2/authorization';
            url += '?client_id=' + settings.socials.linkedin.auth.clientId;
            url += '&redirect_uri=' + settings.socials.linkedin.auth.redirectUri;
            url += '&response_type=code';
            url += '&state=abcde';
            url += '&scope=' + settings.socials.linkedin.auth.scope.join(' ');
            window.location = url;
            return $q.when();
        },
        getTokenWithCode: function(code){
            var deferred = $q.defer();
            $http.post('https://www.linkedin.com/uas/oauth2/accessToken', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: settings.socials.linkedin.auth.redirectUri,
                    client_id: settings.socials.linkedin.auth.clientId,
                    client_secret: settings.socials.linkedin.auth.clientSecret
                }
            }).then(function(resp){
                deferred.resolve(resp.data.access_token);
            });
            return deferred.promise;
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(token){
            var deferred = $q.defer();
            $http.jsonp('https://api.linkedin.com/v1/people/~?format=json', {
                params: {
                    format: 'jsonp',
                    oauth2_access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                console.log(response);
                deferred.resolve(response);
            }, deferred.reject);
            return deferred.promise;
        },
        getMe: function(token){
            var deferred = $q.defer();
            $http.jsonp('https://api.linkedin.com/v1/people/~?format=json', {
                params: {
                    format: 'jsonp',
                    oauth2_access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                console.log(response);
                deferred.resolve(response);
            }, deferred.reject);
            return deferred.promise;
        }
    });

});