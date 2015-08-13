'use strict';

angular.module('app').controller('FriendsCtrl', function(settings, $scope, $timeout, Friend,$mdDialog, $mdToast,$translate){

    $scope.loading = true;

    $scope.friends = [];
    Friend.query().then(function(friends){
        $scope.loading = false;
        $scope.friends = friends;
    }, function(error){
        console.error('Friend loading error : ' + error);
    }, function(friends){
        $scope.friends = $scope.friends.concat(friends);
    });

    var icons = {
        LOVE : 'favorite',
        NOT_LOVE : 'favorite_outline',
        SYNC_PROBLEM: 'sync_problem'
    };

    $scope.toogleLove = function(friend){

        var initialLove = friend.love;

        friend.love = !initialLove;
        friend.$save().then(function(){

        }, function(){
            friend.love = undefined;
            $timeout(function(){
                friend.love = initialLove;
            }, 3000);
        });
    };

    $scope.getSocialIcon = function(social){
        return settings.socials[social].icon;
    };

    $scope.getLoveIcon = function(friend){
        if(friend.love === true){
            return icons.LOVE;
        }else if(friend.love === false){
            return icons.NOT_LOVE;
        }else if(friend.love === undefined){
            return icons.SYNC_PROBLEM;
        }
    };

    $scope.hideFriend = function(friend){
        friend.visibility = false;
        var toast = $mdToast.simple()
            .content($translate.instant('friends.list.hide.toast.content', {
                name: friend.name
            }))
            .action($translate.instant('friends.list.hide.toast.cancel'))
            .highlightAction(false)
            .position('bottom right');
        $mdToast.show(toast).then(function(response) {
            if ( response === 'ok' ) {
                friend.visibility = true;
            }
        });
    };

    $scope.filter = {
        visibility: true
    };
    $scope.showFilter = function(ev){
        $mdDialog.show({
            controller: 'FriendsFilterCtrl',
            templateUrl: 'src/main/content/friends/filter/view.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        }).then(function(filter) {
            $scope.filter = filter;
        });
    };

});