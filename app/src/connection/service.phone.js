'use strict';

angular.module('app').provider('phone', function($cacheProvider){

  var cordova = window.location.hash.split(/[\?\&]{1}/).filter(function(params){
    return params.match(/=/);
  }).reduce(function(previous, item){
    var param = item.split(/=/);
    previous[param[0]] = decodeURIComponent(param[1]);
    return previous;
  }, {});

  if(cordova.referrer){
    $cacheProvider.phoneReferrer.setData(cordova.referrer);
  }else{
    cordova.referrer = $cacheProvider.phoneReferrer.getData();
  }

  this.$get = function($q, $http, $cache, $timeout, $mdDialog, $translate) {

    var getContacts = function(){
      var deferred = $q.defer();
      if(cordova.request === 'contacts'){
        var response = JSON.parse(cordova.response);
        deferred.resolve(response);
      }else{
        window.location = cordova.referrer+'?request=contacts';
      }
      return deferred.promise;
    };

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
            var iAmIframe = function () {
                try {
                    return window.self !== window.top;
                } catch (e) {
                    return true;
                }
            };
            return iAmIframe();
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

              var mapContactToFriend = function(contacts){
                var friends = [];
                contacts.forEach(function(contact){
                  if(contact.phoneNumbers){
                    contact.phoneNumbers.forEach(function(phoneNumber){
                      friends.push({
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
                      });
                    });
                  }
                });
                return friends;
              };

              if(this.isImplemented && this.isConnected()){
                  if(isStubMode){
                      $http.get('stub/data/friends/phone.json').then(function(response){
                          var friends = response.data.map(mapContactToFriend);
                          deferred.notify(friends);
                          deferred.resolve(friends);
                      }, deferred.reject);
                  }else{
                    getContacts().then(function(contacts){
                      deferred.resolve(mapContactToFriend(contacts));
                    }, deferred.reject);
                  }
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
