angular.module('app').factory('$instagram', function(settings, $connection, $q, $http){
    return new $connection({
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
        getFriends: function(token){
            return $http.jsonp('https://api.instagram.com/v1/users/self/follows', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            });
        }
    });
});