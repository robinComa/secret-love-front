angular.module('app').factory('Friend', function(settings, $q, $twitter, $googlePlus, $facebook, $linkedIn, $instagram){
    return {
        query: function(){
            var deferred = $q.defer();

            var twitterDeffered = $twitter.getFriends();
            var googleplusDeffered = $googlePlus.getFriends();
            var facebookDeffered = $facebook.getFriends();
            var linkedinDeffered = $linkedIn.getFriends();
            var instagramDeffered = $instagram.getFriends();

            twitterDeffered.then(function(friend){
                deferred.notify(friend);
            });
            googleplusDeffered.then(function(friends){
                deferred.notify(friends);
            });
            facebookDeffered.then(function(friend){
                deferred.notify(friend);
            });
            linkedinDeffered.then(function(friend){
                deferred.notify(friend);
            });
            instagramDeffered.then(function(friends){
                deferred.notify(friends);
            });

            $q.all([twitterDeffered, googleplusDeffered, facebookDeffered, linkedinDeffered, instagramDeffered]).then(function(result){
                deferred.resolve(result.reduce(function(previous, current){
                    return previous.concat(current);
                }));
            });

            return deferred.promise;
        }
    };
});