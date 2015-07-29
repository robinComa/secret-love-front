angular.module('app').factory('Instagram', function($q, settings, $http, $location, $rootScope, $instagram){

    return {
        query: function(){
            return $instagram.getToken().then(function(token){
                return $http.jsonp('https://api.instagram.com/v1/users/self/follows', {
                    params: {
                        access_token: token,
                        callback: 'JSON_CALLBACK'
                    }
                });
            });
        }
    };
});