'use strict';

angular.module('app').controller('PinCtrl', function($scope, $mdDialog){

    $scope.submit = function(){
        $mdDialog.hide($scope.pin.toString());
    };

});