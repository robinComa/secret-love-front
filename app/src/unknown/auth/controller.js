'use strict';

angular.module('app').controller('AuthCtrl', function($scope, Me, $state, $mdDialog, $translate, LoadApplication){

    $scope.me = new Me();

    $scope.submit = function(ev){
        if($scope.loginForm.$valid){
            $scope.me.$authenticate().then(function(){
                $state.go('friends-list');
            }, function(error){
                var descriptionLabel;
                switch (error.status){
                    case 403:
                        descriptionLabel = 'auth.connect.issue.dialog.password';
                        break;
                    case 404:
                        descriptionLabel = 'auth.connect.issue.dialog.email';
                        break;
                    default:
                        descriptionLabel = 'auth.connect.issue.dialog.description';
                        break;
                }
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('auth.connect.issue.dialog.title'))
                        .content($translate.instant(descriptionLabel))
                        .ariaLabel($translate.instant('auth.connect.issue.dialog.action'))
                        .ok($translate.instant('auth.connect.issue.dialog.action'))
                        .targetEvent(ev)
                );
            });
        }
    };

    $scope.loadDemo = function(){
        LoadApplication.loadAppStub();
    };

});