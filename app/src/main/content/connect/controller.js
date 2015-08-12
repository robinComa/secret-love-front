'use strict';

angular.module('app').controller('ConnectCtrl', function($scope, settings, $translate, $mdDialog, $googlePlus, $instagram, $facebook, $linkedIn, $twitter){

    $scope.connections = settings.socials;

    var getSocialServiceByName = function(name){
        switch (name) {
            case 'googlePlus':
                return $googlePlus;
            case 'instagram':
                return $instagram;
            case 'facebook':
                return $facebook;
            case 'linkedin':
                return $linkedIn;
            case 'twitter':
                return $twitter;
        }
    };
    $scope.connectToogle = function(event, name){
        var socialService = getSocialServiceByName(name);
        if(socialService.isConnected()){
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title($translate.instant('connect.disconnect.confirmation.title'))
                .content($translate.instant('connect.disconnect.confirmation.content', {
                    name: $translate.instant('connect.label.' + name)
                }))
                .ariaLabel($translate.instant('connect.disconnect.confirmation.title'))
                .ok($translate.instant('connect.disconnect.confirmation.ok'))
                .cancel($translate.instant('connect.disconnect.confirmation.cancel'))
                .targetEvent(event);
            $mdDialog.show(confirm).then(function() {
                socialService.close();
            });
        }else{
            socialService.getToken().then(function(){

            });
        }
    };

    $scope.isConnected = function(name){
      return getSocialServiceByName(name).isConnected();
    };

    $scope.isNotImplemented = function(name){
        return !getSocialServiceByName(name).isImplemented();
    };

});