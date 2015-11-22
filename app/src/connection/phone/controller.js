'use strict';

angular.module('app').controller('ConnectPhoneCtrl', function($scope, $mdDialog){

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.submit = function() {
        if($scope.phoneForm.$valid){
            $mdDialog.hide($scope.phone);
        }
    };
});
