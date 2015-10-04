'use strict';

angular.module('app').controller('ConnectProxyCtrl', function($scope, $mdDialog){

    $scope.proxy = {};

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.submit = function() {
        if($scope.proxyForm.$valid){
            $mdDialog.hide($scope.proxy);
        }
    };
});