'use strict';

angular.module('app').controller('FriendsFaceCtrl', function($scope){

    $scope.filter = {
        visibility: true,
        love: [false],
        type: ['instagram', 'googlePlus', 'facebook']
    };

    $scope.$watch(function(){
        return $scope.filteringFriends;
    }, function(friends){
        var ramdomIndex = Math.floor(Math.random()*friends.length);
        $scope.friend = friends[ramdomIndex];
    }, true);

});