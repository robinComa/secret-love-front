angular.module('app').factory('$googlePlus', function(settings, $connection, $http, $q, FriendModel) {

    var LIMIT_TOKEN_STATUS = 401;
    var UNAUTH_STATUS = 403;

    var connection =  new $connection({
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
            var deferred = $q.defer();
            $http.jsonp('https://www.googleapis.com/plus/v1/people/me/people/visible', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                if(response.data.error && (response.data.error.code === LIMIT_TOKEN_STATUS || response.data.error.code === UNAUTH_STATUS)){
                    close().then(function(){
                        getNewToken().then(function(){
                            deferred.reject(response.data.error.message);
                        }, deferred.reject);
                    });
                }else{
                    deferred.resolve(response.data.items.map(function(friend){
                        return new FriendModel(null, friend.displayName, friend.image.url, 'googlePlus');
                    }));
                }
            }, deferred.reject);
            return deferred.promise;
        }
    });

    return connection;

});