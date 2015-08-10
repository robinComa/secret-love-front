angular.module('app').factory('Friend', function(settings, $q, $twitter, $googlePlus, $facebook, $linkedIn, $instagram, GooglePlusAdapter, InstagramAdapter, FacebookAdapter, LinkedinAdapter, TwitterAdapter){
    return {
        query: function(){
            var deferred = $q.defer();

            var twitterDeffered = $twitter.getFriends();
            var googleplusDeffered = $googlePlus.getFriends();
            var facebookDeffered = $facebook.getFriends();
            var linkedinDeffered = $linkedIn.getFriends();
            var instagramDeffered = $instagram.getFriends();

            twitterDeffered.then(function(friend){
                deferred.notify(TwitterAdapter.adaptToModels(friend));
            });
            googleplusDeffered.then(function(friend){
                deferred.notify(GooglePlusAdapter.adaptToModels(friend));
            });
            facebookDeffered.then(function(friend){
                deferred.notify(FacebookAdapter.adaptToModels(friend));
            });
            linkedinDeffered.then(function(friend){
                deferred.notify(LinkedinAdapter.adaptToModels(friend));
            });
            instagramDeffered.then(function(friends){
                deferred.notify(InstagramAdapter.adaptToModels(friends));
            });

            $q.all([twitterDeffered, googleplusDeffered, facebookDeffered, linkedinDeffered, instagramDeffered]).then(function(){
                deferred.resolve();
            });

            return deferred.promise;
        }
    };
});