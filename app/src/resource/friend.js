angular.module('app').factory('Friend', function(settings, $q, Twitter, GooglePlus, Facebook, LinkedIn, Instagram){
    return {
        query: function(){
            var deferred = $q.defer();

            var twitterDeffered = Twitter.query().$promise;
            var googleplusDeffered = GooglePlus.query().$promise;
            var facebookDeffered = Facebook.query().$promise;
            var linkedinDeffered = LinkedIn.query().$promise;
            var instagramDeffered = Instagram.query().$promise;

            twitterDeffered.then(function(friend){
                deferred.notify(friend);
            });
            googleplusDeffered.then(function(friend){
                deferred.notify(friend);
            });
            facebookDeffered.then(function(friend){
                deferred.notify(friend);
            });
            linkedinDeffered.then(function(friend){
                deferred.notify(friend);
            });
            instagramDeffered.then(function(friend){
                deferred.notify(friend);
            });

            $q.all([twitterDeffered, googleplusDeffered, facebookDeffered, linkedinDeffered, instagramDeffered]).then(function(){
                deferred.resolve();
            });

            return deferred.promise;
        }
    };
});