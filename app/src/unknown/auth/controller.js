'use strict';

angular.module('app').controller('AuthCtrl', function($scope, Me){

    $scope.me = new Me();

    $scope.submit = function(){
        if($scope.loginForm.$valid){
            $scope.me.$save().then(function(){

            }, function(){

            });
        }
    };

});