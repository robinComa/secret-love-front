'use strict';

angular.module('app').factory('Friend', function(settings, $q, $resource, $injector, $http, SecretBox){

    var Friend = $resource(settings.endpoint + 'friends');

    Friend.query = function(){
        var deferred = $q.defer();

        SecretBox.query().$promise.then(function(loveFriends){

            var promises = [];
            var friends = [];

            var equals = function(friend1, friend2){
                return friend1.id === friend2.id && friend1.name === friend2.name;
            };

            var areInLove = function(loveFriends, friend){
                return loveFriends.some(function(loveFriend){
                    return equals(loveFriend, friend);
                });
            };

            var isVisible = function(){
                return true;
            };

            angular.forEach(settings.socials, function(social, name){
                var socialService = $injector.get(name);
                var promise = socialService.getFriends();
                promise.then(function(){

                }, function(){

                }, function(friends){
                    deferred.notify(friends.map(function(friend){
                        friend.love = areInLove(loveFriends, friend);
                        friend.visibility = isVisible();
                        friends.push(friend);
                        return friend;
                    }));
                });
                promises.push(promise);
            });

            $q.all(promises).then(function(){
                deferred.resolve(friends);
            });
        });

        return deferred.promise;
    };

    return Friend;
});