'use strict';

angular.module('app').controller('FriendsFilterCtrl', function(settings, $scope, $mdBottomSheet){

    $scope.socials = settings.socials;

    $scope.filter = {
        visibility: true
    };

    $scope.cancel = function() {
        $mdBottomSheet.cancel();
    };
    $scope.submit = function(answer) {
        $mdBottomSheet.hide(answer);
    };

});