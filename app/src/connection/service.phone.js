'use strict';

angular.module('app').provider('phone', function(){

  this.stub = false;

  this.$get = function($q, $http, $cache, $timeout, $mdDialog, $translate, LoadApplication) {

      var isPhoneDevice = true;
      var isStubMode = this.stub;

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
            return isPhoneDevice;
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

              if(this.isImplemented && this.isConnected()){
                  if(isStubMode){
                      $http.get('stub/data/friends/phone.json').then(function(response){
                          var friends = response.data.map(mapContactToFriend);
                          deferred.notify(friends);
                          deferred.resolve(friends);
                      }, deferred.reject);
                  }else if(navigator.contacts){
                    navigator.contacts.find([navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name], function(contacts){
                      var friends = [];
                      contacts.forEach(function(contact){
                        if(contact.phoneNumbers){
                          contact.phoneNumbers.forEach(function(phoneNumber){
                            friend.push({
                              id: phoneNumber.value,
                              name: contact.displayName + ' (' + phoneNumber.type + ')',
                              picture: (function(photos){
                                var photo = photos[0];
                                if(photo.type === 'base64'){
                                  return 'data:image/jpg;base64,' + photo.value;
                                }
                                return photo.value;
                              })(contact.photos),
                              type: 'phone'
                            })
                          });
                        }
                      });
                      deferred.resolve(friends);
                    }, deferred.reject, {
                      hasPhoneNumber: true
                    });
                    console.log(navigator.contacts)
                  }
              }else{
                  deferred.reject('navigator.contacts API is missing');
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

  };

});
