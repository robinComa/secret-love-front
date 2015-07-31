angular.module('app').factory('GooglePlus', function($google, $http){

    return {
        query: function(){
            return $google.getToken().then(function(token){
                return $http.jsonp('https://www.googleapis.com/plus/v1/people/me/people/visible', {
                    params: {
                        access_token: token,
                        callback: 'JSON_CALLBACK'
                    }
                });
            });
        }
    };
});