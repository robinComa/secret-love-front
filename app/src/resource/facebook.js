angular.module('app').factory('Facebook', function(settings, $http, $facebook){

    return {
        query: function(){
            return $facebook.getToken().then(function(token){
                return $http.jsonp('https://graph.facebook.com/v2.4/me/friends?fields=id,name,picture', {
                    params: {
                        access_token: token,
                        callback: 'JSON_CALLBACK'
                    }
                });
            });
        }
    };
});