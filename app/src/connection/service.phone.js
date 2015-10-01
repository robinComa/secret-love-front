'use strict';

angular.module('app').factory('phone', function($q, $http, $cache, $timeout) {

    var isPhoneDevice = false;
    var isStubMode = true;

    return{
        getToken: function(){
            var token = 'OK';
            $cache.token.phone.setData(token);
            return $q.when(token);
        },
        isConnected: function(){
            return $cache.token.phone.getData() !== null;
        },
        isImplemented: function(){
            return isPhoneDevice || isStubMode;
        },
        close: function(){
            var deferred = $q.defer();
            $timeout(function(){
                $cache.token.phone.invalid();
                deferred.resolve();
            }, 1);
            return deferred.promise;
        },
        getFriends: function(){
            var deferred = $q.defer();
            if(this.isImplemented() && this.isConnected()){
                if(isStubMode){
                    $http.get('stub/data/friends/phone.json').then(function(response){
                        var friends = response.data.map(function(friend){
                            return {
                                id: friend.id,
                                name: friend.displayName,
                                picture: 'data:image/jpg;base64,' + friend.photos[0],
                                type: 'phone'
                            };
                        });
                        deferred.notify(friends);
                        deferred.resolve(friends);
                    }, deferred.reject);
                }else if(isPhoneDevice){
                    deferred.resolve([]);
                }
            }else{
                deferred.resolve([]);
            }
            return deferred.promise;
        },
        getMe: function(){
            var deferred = $q.defer();
            deferred.resolve({
                type: 'phone',
                id: null
            });
            return deferred.promise;
        }
    };

});