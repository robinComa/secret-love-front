'use strict';

angular.module('app').controller('ConnectCtrl', function($scope, settings, $translate, $mdDialog, $injector){

    $scope.connections = settings.socials;

    var disconnectAction = function(socialService){
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
    };

    $scope.connectToogle = function(event, name){
        var socialService = $injector.get(name);
        if(socialService.isConnected()){
            disconnectAction(socialService);
        }else{
            socialService.getToken().then(function(){

            });
        }
    };

    $scope.isConnected = function(name){
      return $injector.get(name).isConnected();
    };

    $scope.isNotImplemented = function(name){
        return !$injector.get(name).isImplemented();
    };

});