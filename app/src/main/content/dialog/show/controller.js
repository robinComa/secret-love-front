'use strict';

angular.module('app').controller('DialogShowCtrl', function(settings,$scope, dialog){

    $scope.dialog = dialog;

    $scope.getSocialIcon = function(social){
        return settings.socials[social].icon;
    };

});