'use strict';

angular.module('app').controller('DialogCtrl', function(settings, $scope, dialogs){

    $scope.unreadDialogs = dialogs.filter(function(message){
        return !message.read;
    });

    $scope.readDialogs = dialogs.filter(function(message){
        return message.read;
    });

});