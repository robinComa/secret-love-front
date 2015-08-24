'use strict';

angular.module('app').controller('SidenavCtrl', function(settings, $scope, $interval, secretBox){

    $scope.nbSecretBoxNews = secretBox.filter(function(secret){
        return secret.hasNews;
    }).length;

    var duration = 2000;
    var i = 0;
    var keys = Object.keys(settings.socials);

    $scope.selectedIcon = settings.socials[keys[i]].icon;

    $interval(function(){
        $scope.selectedIcon = settings.socials[keys[i % keys.length]].icon;
        i++;
    }, duration);

    $scope.option = {
        rotation: 'none',
        duration: duration,
        easing : 'sine-out'
    };

});