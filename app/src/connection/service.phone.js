'use strict';

angular.module('app').factory('phone', function($q, $http) {

    var isPhoneDevice = false;
    var isStubMode = true;

    return{
        isConnected: function(){
            return isPhoneDevice || isStubMode;
        },
        isImplemented: function(){
            return isPhoneDevice || isStubMode;
        },
        close: function(){

        },
        getFriends: function(){
            var deferred = $q.defer();
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
            }else{
                deferred.resolve([]);
            }
            return deferred.promise;
        }
    };

});