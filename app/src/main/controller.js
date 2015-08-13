'use strict';

angular.module('app').controller('MainCtrl', function($scope, $mdSidenav, me, $state){

    $scope.me = me;
    $scope.state = $state;

    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

});