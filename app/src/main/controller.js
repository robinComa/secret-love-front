'use strict';

angular.module('app').controller('MainCtrl', function($scope, $mdSidenav, me, $state, LoadApplication){

    $scope.me = me;
    $scope.state = $state;
    $scope.isAppStub = LoadApplication.isAppStub();

    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.loadApp = function(){
        LoadApplication.loadApp();
    };

});