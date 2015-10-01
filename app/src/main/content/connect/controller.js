'use strict';

angular.module('app').controller('ConnectCtrl', function($scope, settings, $translate, $mdDialog, $injector, $cache, Me){

    $scope.connections = settings.socials;

    var disconnectAction = function(socialService, name){
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
            Me.disconnect({type: name}).$promise.then(function(){
                $scope.connectionModel[name] = false;
                socialService.close();
            });
        }, function(){
            $scope.connectionModel[name] = true;
        });
    };

    $scope.toggleConnection = function(name){
        var socialService = $injector.get(name);
        $cache.friends.invalid();
        if(socialService.isConnected()){
            disconnectAction(socialService, name);
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

    $scope.connectionModel = {};
    for(var type in settings.socials){
        $scope.connectionModel[type] = $scope.isConnected(type);
    }

});