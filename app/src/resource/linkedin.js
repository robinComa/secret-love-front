angular.module('app').factory('LinkedIn', function($linkedin, $http){
    return {
        query: function(){
            return $linkedin.getToken().then(function(token){
                return $http.jsonp('https://api.linkedin.com/v1/people/~:(num-connections)', {
                    params: {
                        format: 'jsonp',
                        oauth2_access_token: token,
                        callback: 'JSON_CALLBACK'
                    }
                });
            });
        }
    };
});