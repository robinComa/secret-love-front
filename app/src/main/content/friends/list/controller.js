'use strict';

angular.module('app').controller('FriendsListCtrl', function($scope){

    $scope.openMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    $scope.getLoveIcon = function(friend){
        if(friend.love === true){
            return 'favorite';
        }else if(friend.love === false){
            return 'favorite_outline';
        }else if(friend.love === undefined){
            return 'sync_problem';
        }
    };

});