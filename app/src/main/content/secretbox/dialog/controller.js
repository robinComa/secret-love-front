'use strict';

angular.module('app').controller('DialogCtrl', function(settings,$scope, dialogs, Dialog, SecretBox, $stateParams){

    var initMessage = function(){
        $scope.newMessage = new Dialog();
        console.log($scope.friend);
        $scope.newMessage.to = {
            id: $scope.friend.id,
            type: $scope.friend.type
        };
    };

    SecretBox.query().then(function(secretBox){
        var secretBoxItem = secretBox.filter(function(secretBoxItem){
            return secretBoxItem.friend.id === $stateParams.id && secretBoxItem.friend.type === $stateParams.type;
        })[0];
        if(secretBoxItem){
            $scope.friend = secretBoxItem.friend;
            $scope.dialogs = dialogs;

            initMessage();

            $scope.sendMessage = function(){
                $scope.newMessage.$save().then(function(){
                    $scope.newMessage.when = (new Date()).getTime();
                    $scope.newMessage.me = true;
                    $scope.dialogs.push($scope.newMessage);
                    initMessage();
                });
            };
        }
    });

});