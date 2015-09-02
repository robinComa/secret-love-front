'use strict';

angular.module('app').controller('DialogCtrl', function(settings,$scope, dialogs, Dialog, SecretBox, $stateParams){

    SecretBox.query().then(function(secretBox){
        var secretBoxItem = secretBox.filter(function(secretBoxItem){
            return secretBoxItem.friend.id === $stateParams.id && secretBoxItem.friend.type === $stateParams.type;
        })[0];
        $scope.friend = secretBoxItem.friend;
        $scope.dialogs = dialogs;
    });

    $scope.newMessage = new Dialog();

    $scope.sendMessage = function(){
        $scope.newMessage.$save().then(function(){
            $scope.newMessage.when = (new Date()).getTime();
            $scope.newMessage.me = true;
            $scope.dialogs.push($scope.newMessage);
            $scope.newMessage = new Dialog();
        });
    };

});