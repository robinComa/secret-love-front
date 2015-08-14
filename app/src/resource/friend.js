'use strict';

angular.module('app').factory('Friend', function(settings, $q, $resource, $injector, $http){

    var Friend = $resource(settings.endpoint + 'friends');

    Friend.query = function(){
        var deferred = $q.defer();

        $http.get(settings.endpoint + 'friends').then(function(response){
            var loveFriends = response.data;

            var promises = [];

            var areInLove = function(loveFriends, friend){
                return loveFriends.some(function(loveFriend){
                    return angular.equals(loveFriend, friend);
                });
            };

            var isVisible = function(){
                return true;
            };

            angular.forEach(settings.socials, function(social, name){
                var socialService = $injector.get(name);
                var promise = socialService.getFriends();
                promise.then(function(friends){
                    deferred.notify(friends.map(function(friend){
                        friend.love = areInLove(loveFriends, friend);
                        friend.visibility = isVisible();
                        return friend;
                    }));
                });
                promises.push(promise);
            });

            $q.all(promises).then(function(friends){
                var friendsList = friends.reduce(function(previous, current){
                    return previous.concat(current);
                });
                deferred.resolve(friendsList);
            });
        });

        return deferred.promise;
    };

    return Friend;
});