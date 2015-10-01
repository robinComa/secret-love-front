'use strict';

angular.module('app').factory('googlePlus', function(settings, Connection, $http, $q, Friend) {

    var LIMIT_TOKEN_STATUS = 401;
    var UNAUTH_STATUS = 403;

    var connection =  new Connection({
        name: 'googlePlus',
        isImplemented: true,
        sendTokenRequest: function(){
            var url = 'https://accounts.google.com/o/oauth2/auth';
            url += '?client_id=' + settings.socials.googlePlus.auth.clientId;
            url += '&redirect_uri=' + settings.socials.googlePlus.auth.redirectUri;
            url += '&response_type=token';
            url += '&state=security_token';
            url += '&approval_prompt=force';
            url += '&include_granted_scopes=true';
            url += '&scope=' + settings.socials.googlePlus.auth.scope.join(' ');
            window.location = url;
            return $q.when();
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(token, getNewToken, close){

            var getFriendPage = function(nextPageToken){
                var subDeferred = $q.defer();
                $http.jsonp('https://www.googleapis.com/plus/v1/people/me/people/visible', {
                    params: {
                        access_token: token,
                        callback: 'JSON_CALLBACK',
                        maxResults: 100,
                        fields : 'items(id, displayName,image/url,objectType),nextPageToken',
                        pageToken: nextPageToken
                    }
                }).then(function(response){
                    if(response.data.error && (response.data.error.code === LIMIT_TOKEN_STATUS || response.data.error.code === UNAUTH_STATUS)){
                        close().then(function(){
                            getNewToken().then(function(){
                                subDeferred.reject(response.data.error.message);
                            }, subDeferred.reject);
                        });
                    }else{
                        subDeferred.resolve(response.data);
                    }
                }, subDeferred.reject);
                return subDeferred.promise;
            };

            var deferred = $q.defer();

            var calbackResponse = function(response){
                var friends = response.items.reduce(function(friends, friend){
                    if(friend.objectType === 'person'){
                        friends.push(new Friend({
                            id: friend.id,
                            name: friend.displayName,
                            picture: friend.image.url,
                            type: 'googlePlus'
                        }));
                    }
                    return friends;
                }, []);

                deferred.notify(friends);

                if(response.nextPageToken){
                    getFriendPage(response.nextPageToken).then(calbackResponse, deferred.reject);
                }else{
                    deferred.resolve();
                }

            };
            getFriendPage().then(calbackResponse, deferred.reject);

            return deferred.promise;
        },
        getMe: function(token){
            var deferred = $q.defer();
            $http.jsonp('https://www.googleapis.com/plus/v1/people/me', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                var me = {
                    id: response.data.id,
                    name: response.data.displayName,
                    picture: response.data.image.url,
                    type: 'googlePlus'
                };
                deferred.resolve(me);
            }, deferred.reject);
            return deferred.promise;
        }
    });

    return connection;

});