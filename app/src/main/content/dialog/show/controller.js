'use strict';

angular.module('app').controller('DialogShowCtrl', function(settings,$scope, dialog, Message){

    dialog.read = true;

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