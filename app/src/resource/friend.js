angular.module('app').factory('Friend', function(settings, $q, Twitter, GooglePlus, Facebook, LinkedIn, Instagram, GooglePlusAdapter, InstagramAdapter, FacebookAdapter, LinkedinAdapter, TwitterAdapter){
    return {
        query: function(){
            var deferred = $q.defer();

            var twitterDeffered = Twitter.query();
            var googleplusDeffered = GooglePlus.query();
            var facebookDeffered = Facebook.query();
            var linkedinDeffered = LinkedIn.query();
            var instagramDeffered = Instagram.query();

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
            instagramDeffered.then(function(friend){
                deferred.notify(InstagramAdapter.adaptToModels(friend));
            });

            $q.all([twitterDeffered, googleplusDeffered, facebookDeffered, linkedinDeffered, instagramDeffered]).then(function(){
                deferred.resolve();
            });

            return deferred.promise;
        }
    };
});