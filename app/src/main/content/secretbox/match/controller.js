'use strict';

angular.module('app').controller('MatchCtrl', function($scope, $mdDialog){

    $scope.close = function() {
        $mdDialog.cancel();
    };
    $scope.markAsRead = function() {
        $mdDialog.hide();
    };

});