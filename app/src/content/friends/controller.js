angular.module('app').controller('FriendsCtrl', function($scope, $timeout, User){

    $scope.users = User.query();

    var icons = {
        LOVE : 'favorite',
        NOT_LOVE : 'favorite_outline',
        SYNC : 'sync',
        SYNC_PROBLEM: 'sync_problem'
    };

    $scope.toogleLove = function(user){

        var userCopy = angular.copy(user);
        userCopy.love = !userCopy.love;
        user.love = null;

        userCopy.$save().then(function(){
            user.love = userCopy.love;
        }).catch(function(){
            user.love = undefined;
            $timeout(function(){
                user.love = !userCopy.love;
            }, 3000);
        });
    };

    $scope.getLoveIcon = function(user){
        if(user.love === true){
            return icons.LOVE;
        }else if(user.love === false){
            return icons.NOT_LOVE;
        }else if(user.love === null){
            return icons.SYNC;
        }else if(user.love === undefined){
            return icons.SYNC_PROBLEM;
        }
    };

});