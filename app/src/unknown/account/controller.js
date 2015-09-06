'use strict';

angular.module('app').controller('AccountCtrl', function($scope, Me, $state, $mdDialog, $translate){

    $scope.me = new Me();

    $scope.submit = function(ev){
        if($scope.accountForm.$valid){
            $scope.me.$save().then(function(){
                $state.go('friends-list');
            }, function(){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('account.connect.issue.dialog.title'))
                        .content($translate.instant('account.connect.issue.dialog.description'))
                        .ariaLabel($translate.instant('account.connect.issue.dialog.action'))
                        .ok($translate.instant('account.connect.issue.dialog.action'))
                        .targetEvent(ev)
                );
            });
        }
    };

});