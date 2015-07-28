angular.module('app').controller('FriendsCtrl', function($scope, $timeout, Friend){

    $scope.friends = [];
    Friend.query().then(function(){
        console.log('All friends loaded');
    }, function(error){
        console.log('error');
    }, function(friends){
        $scope.friends = $scope.friends.concat(friends);
    });

    var icons = {
        LOVE : 'favorite',
        NOT_LOVE : 'favorite_outline',
        SYNC : 'sync',
        SYNC_PROBLEM: 'sync_problem'
    };

    $scope.toogleLove = function(friend){

        var friendCopy = angular.copy(friend);
        friendCopy.love = !friendCopy.love;
        friend.love = null;

        friendCopy.$save().then(function(){
            friend.love = friendCopy.love;
        }).catch(function(){
            friend.love = undefined;
            $timeout(function(){
                friend.love = !friendCopy.love;
            }, 3000);
        });
    };

    $scope.getLoveIcon = function(friend){
        if(friend.love === true){
            return icons.LOVE;
        }else if(friend.love === false){
            return icons.NOT_LOVE;
        }else if(friend.love === null){
            return icons.SYNC;
        }else if(friend.love === undefined){
            return icons.SYNC_PROBLEM;
        }
    };

});