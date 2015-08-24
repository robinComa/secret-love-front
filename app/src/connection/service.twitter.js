'use strict';

angular.module('app').factory('twitter', function(settings, Connection, $q, $http) {
    return new Connection({
        name: 'twitter',
        isImplemented: false,
        sendTokenRequest: function(){
            var timestamp = (new Date().getTime()).toString();
            var oauth_timestamp = timestamp.substring(0, timestamp.length - 3);

            var authorization = 'OAuth oauth_callback="' + settings.socials.twitter.auth.redirectUri + '",';
            authorization += 'oauth_consumer_key="' + settings.socials.twitter.auth.clientId + '",';
            authorization += 'oauth_nonce="8317b2ae48c58507f3563df90874335b",';
            authorization += 'oauth_signature="RcJu7Hg%2BFihZ8DwIzJqbFivrJOA%3D",';
            authorization += 'oauth_signature_method="HMAC-SHA1",';
            authorization += 'oauth_timestamp="' + oauth_timestamp + '",';
            authorization += 'oauth_version="1.0"';
            console.log(authorization);
            console.log(new Date().getTime() / 1000);
            $http.post('https://api.twitter.com/oauth/request_token', {
                headers: {
                    Authorization: authorization
                }
            }).then(function(data){
                console.log(data);
            }, function(data){
                console.log(data);
            });
            //var url = 'https://api.twitter.com/oauth/authorize';
            //url += '?oauth_token=';
            //url += settings.socials.twitter.auth.clientId;
            //window.location = url;
        },
        getTokenWithCode: function(code){
            var deferred = $q.defer();
            deferred.resolve(code);
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