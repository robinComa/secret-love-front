'use strict';

angular.module('app').factory('SecretBox', function(settings, $resource, $q, $cache){

    var SecretBox = $resource(settings.endpoint + 'secretbox/:type/:id');

    return {
        query: function(){
            var cache = $cache.secretBox.getData();
            if(cache){
                return $q.when(cache);
            }

            var deferred = $q.defer();
            SecretBox.query(function(secretBox){
                $cache.secretBox.setData(secretBox);
                deferred.resolve(secretBox);
            }, deferred.reject);
            return deferred.promise;
        },
        save: function(friend){
            var deferred = $q.defer();
            SecretBox.save(friend).$promise.then(function(){
                var secretBox = $cache.secretBox.getData();
                secretBox.push({
                    friend: {
                        id: friend.id,
                        type: friend.type,
                        verified: false,
                        inLove: false
                    },
                    lastUpdate: (new Date()).getTime(),
                    hasNews: false,
                    messages: null
                });
                $cache.secretBox.setData(secretBox);
                deferred.resolve();
            }, deferred.reject);
            return deferred.promise;
        },
        delete: function(friend){
            var deferred = $q.defer();
            SecretBox.delete(friend).$promise.then(function(){
                var secretBox = $cache.secretBox.getData();
                var getIndex = function(type, id){
                    for(var i in secretBox){
                        if(secretBox[i].friend.type === type && secretBox[i].friend.id === id){
                            return i;
                        }
                    }
                };
                secretBox.splice(getIndex(friend.type, friend.id), 1);
                $cache.secretBox.setData(secretBox);
                deferred.resolve();
            }, deferred.reject);
            return deferred.promise;
        }
    };

});