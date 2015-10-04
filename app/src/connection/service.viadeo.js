'use strict';

angular.module('app').factory('viadeo', function(Connection, $http, $q, $cache, $mdDialog, Proxy, Friend) {

    return new Connection({
        name: 'viadeo',
        isImplemented: true,
        sendTokenRequest: function(){
            var deferred = $q.defer();
            $mdDialog.show({
                controller: 'ConnectProxyCtrl',
                templateUrl: 'src/connection/proxy/view.html',
                parent: angular.element(document.querySelector('.state-connect')[0]),
                clickOutsideToClose:true
            }).then(function(answer) {
                $cache.token.viadeo.setData(answer);
                deferred.resolve(answer);
            }, deferred.reject);
            return deferred.promise;
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(token){
            var deferred = $q.defer();
            Proxy.getViadeoFriends(token).$promise.then(function(response){
                var friends = response.map(function(friend){
                    return new Friend({
                        id: friend.contactId,
                        name: friend.firstname + ' ' + friend.lastname,
                        picture: friend.photoUrl,
                        type: 'viadeo'
                    });
                });
                deferred.notify(friends);
                deferred.resolve(friends);
            }, deferred.reject);
            return deferred.promise;
        },
        getMe: function(token){
            var deferred = $q.defer();
            Proxy.getViadeoMe(token).$promise.then(function(response){
                response.type = 'viadeo';
                deferred.resolve(response);
            }, deferred.reject);
            return deferred.promise;
        }
    });

});