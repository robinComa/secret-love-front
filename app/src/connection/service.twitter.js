'use strict';

angular.module('app').factory('twitter', function(settings, Connection, $q, $http) {
    return new Connection({
        name: 'twitter',
        isImplemented: true,
        sendTokenRequest: function(){
            $http({
                method: 'GET',
                url: 'https://api.twitter.com/1.1/',
                headers: {
                    Authorization: 'OAuth oauth_consumer_key="r9e5QZVVUIu3ChTXr1w08fm5T", oauth_nonce="d31b6bf4d95ef689cf81ed3341ee8e55", oauth_signature="27Vj%2FRCSisaYyfNJtDSFpG0bd%2FU%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1439931848", oauth_version="1.0"'
                }
            }).then(function(data){
                console.log(data);
            }, function(data){
                console.log(data);
            });
        },
        getTokenWithCode: function(code){
            var deferred = $q.defer();
            return deferred.promise;
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(){
            var deferred = $q.defer();
            // https://dev.twitter.com/rest/tools/console
            // https://api.twitter.com/1.1/friends/ids.json
            // https://api.twitter.com/1.1/users/lookup.json?user_id=6693582,F1717226282,2277815413
            return deferred.promise;
        }
    });
});