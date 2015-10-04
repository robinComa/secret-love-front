'use strict';

angular.module('app').controller('SidenavCtrl', function(settings, $scope, $interval, SecretBox){

    SecretBox.query().then(function(secretBox){
        $scope.secretBox = secretBox;
        $scope.nbSecretBoxNews = $scope.secretBox.filter(function(secret){
            return secret.hasNews;
        }).length;
    });

});