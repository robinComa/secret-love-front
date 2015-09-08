'use strict';

angular.module('app').controller('ForgotPasswordCtrl', function($scope, Me, $state, $mdDialog, $translate, LoadApplication){

    $scope.me = new Me();

    $scope.submit = function(ev){
        if($scope.loginForm.$valid){
            $scope.me.$forgotPassword().then(function(){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('forgot.password.success.dialog.title'))
                        .content($translate.instant('forgot.password.success.dialog.description'))
                        .ariaLabel($translate.instant('forgot.password.success.dialog.action'))
                        .ok($translate.instant('forgot.password.success.dialog.action'))
                        .targetEvent(ev)
                );
            }, function(){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('forgot.password.issue.dialog.title'))
                        .content($translate.instant('forgot.password.issue.dialog.description'))
                        .ariaLabel($translate.instant('forgot.password.issue.dialog.action'))
                        .ok($translate.instant('forgot.password.issue.dialog.action'))
                        .targetEvent(ev)
                );
            });
        }
    };

});