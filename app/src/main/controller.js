'use strict';

angular.module('app').controller('MainCtrl', function($scope, $mdSidenav, me){

    $scope.me = me;

    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

});