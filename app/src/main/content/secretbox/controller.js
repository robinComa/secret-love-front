'use strict';

angular.module('app').controller('SecretBoxCtrl', function($scope, SecretBox){

    SecretBox.query().then(function(secretBox){
        $scope.secretBox = secretBox;
    });

});