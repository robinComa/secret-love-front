'use strict';

angular.module('app').factory('viadeo', function(Connection, $http, $q) {

    return new Connection({
        name: 'viadeo',
        isImplemented: true,
        sendTokenRequest: function(){
            window.localStorage.setItem('cache_token_viadeo', 'connected');
        },
        sendConnectionClose: function(){

        },
        getFriends: function(token){
            $http.get('http://www.viadeo.com/r/addressbook/search/?1441920821260&type=contact&maxResults=120&pageNumber=1', {
                params: {
                    format: 'jsonp',
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                console.log(response);
            }, function(error){
                console.error(error);
            })

            return $q.when([]);
        },
        getMe: function(){
            var deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        }
    });

});