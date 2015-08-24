'use strict';

angular.module('app').controller('DialogCtrl', function(settings,$scope, dialog, Message){

    $scope.dialog = dialog;

    $scope.newMessage = new Message();

    $scope.sendMessage = function(){
        $scope.newMessage.$save().then(function(){
            $scope.newMessage.when = (new Date()).getTime();
            $scope.dialog.messages.push($scope.newMessage);
            $scope.newMessage = new Message();
        });
    };

});