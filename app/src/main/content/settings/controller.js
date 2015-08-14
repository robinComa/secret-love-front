'use strict';

angular.module('app').controller('SettingsCtrl', function($scope, me){

    $scope.meCopy = angular.copy(me);

    $scope.submit = function(){
        $scope.meCopy.$save().then(function(){
            me.login = $scope.meCopy.login;
            me.email = $scope.meCopy.email;
        });
    };

    $scope.disconnect = function(){

    };

});