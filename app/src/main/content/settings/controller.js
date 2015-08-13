'use strict';

angular.module('app').controller('SettingsCtrl', function($scope, me){

    $scope.me = me;

    $scope.submit = function(){
        $scope.me.$save();
    };

});