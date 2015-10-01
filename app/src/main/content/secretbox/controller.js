'use strict';

angular.module('app').controller('SecretBoxCtrl', function($scope, SecretBox, $mdDialog){

    var isMatch = function(secret){
        return secret.friend.inLove && secret.hasNews && secret.messages && secret.messages.length === 0;
    };

    $scope.close = function() {
        $mdDialog.cancel();
    };
    $scope.markAsRead = function() {
        $mdDialog.hide();
    };

    SecretBox.query().then(function(secretBox){
        secretBox.forEach(function(secret){
            if(secret && isMatch(secret)){
                $scope.matchFriend = secret.friend;
                $mdDialog.show({
                    scope: $scope,
                    controller: 'MatchCtrl',
                    templateUrl: 'src/main/content/secretbox/match/view.html',
                    clickOutsideToClose:true
                }).then(function() {

                }, function() {

                });
            }
        });
        $scope.secretBox = secretBox;
    });

});