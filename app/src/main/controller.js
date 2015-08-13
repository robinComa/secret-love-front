'use strict';

angular.module('app').controller('MainCtrl', function($scope, $mdSidenav, me){

    $scope.login = me.login;

    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

});