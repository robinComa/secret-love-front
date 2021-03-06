'use strict';

angular.module('app').controller('FriendsFaceCtrl', function($scope){

    $scope.refreshFace = function(friends){
        if(friends.length > 0){
            var randomIndex = Math.floor(Math.random()*friends.length);
            $scope.friend = friends[randomIndex];
        }else{
            $scope.friend = null;
        }
    };

    $scope.$watch(function(){
        return $scope.filteringFriends;
    }, $scope.refreshFace, true);

});