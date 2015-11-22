'use strict';

angular.module('app').factory('phone', function($q, $http, $cache, $timeout, $mdDialog, $translate) {

    var isPhoneDevice = false;
    var isStubMode = true;

    return{
        getToken: function(){
            var deferred = $q.defer();
            $mdDialog.show({
                controller: 'ConnectPhoneCtrl',
                templateUrl: 'src/connection/phone/view.html',
                parent: angular.element(document.querySelector('.state-connect')),
                clickOutsideToClose:true
            }).then(function(phone) {
                $cache.token.phone.setData(phone);
                deferred.resolve(phone);
                $cache.token.phone.setData(phone);
            }, deferred.reject);
            return deferred.promise;
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
                id: $cache.token.phone.getData(),
                name: $translate.instant('connect.phone.me.label'),
                picture: 'img/user-icon-silhouette.png'
            });
            return deferred.promise;
        }
    };

});
