'use strict';

angular.module('app').controller('AuthCtrl', function($scope, Me, $state, $mdDialog, $translate){

    $scope.me = new Me();

    $scope.submit = function(ev){
        if($scope.loginForm.$valid){
            $scope.me.$authenticate().then(function(){
                $state.go('friends-list');
            }, function(){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('auth.connect.issue.dialog.title'))
                        .content($translate.instant('auth.connect.issue.dialog.description'))
                        .ariaLabel($translate.instant('auth.connect.issue.dialog.action'))
                        .ok($translate.instant('auth.connect.issue.dialog.action'))
                        .targetEvent(ev)
                );
            });
        }
    };

});