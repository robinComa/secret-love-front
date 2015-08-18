'use strict';

angular.module('app').controller('FriendsCtrl', function(settings, $scope, $timeout, $filter, Friend, $mdBottomSheet, $mdToast,$translate){

    $scope.loading = true;

    $scope.filter = {
        visibility: true,
        love: [true, false],
        type: ['instagram', 'googlePlus', 'facebook']
    };

    var filter = function(friends, filter){
        return $filter('friendFilter')(friends, filter);
    };

    $scope.$watch(function(){
        return $scope.filter;
    }, function(val){
        $scope.filteringFriends = filter($scope.friends, val);
    }, true);

    $scope.friends = [];
    $scope.filteringFriends = [];
    Friend.query().then(function(friends){
        $scope.loading = false;
        $scope.friends = filter(friends, $scope.filter);
        $scope.filteringFriends = filter(friends, $scope.filter);
    }, function(error){
        console.error('Friend loading error : ' + error);
    }, function(friends){
        console.log(friends.length + ' new friends loaded');
    });

    $scope.toogleLove = function(friend){

        var initialLove = friend.love;

        friend.love = !initialLove;
        friend.$save().then(function(){

            if(friend.love){
                $mdToast.show(
                    $mdToast.simple()
                        .content($translate.instant('friends.list.love.toast.content', {
                            name: friend.name
                        }))
                        .position(settings.toast.position)
                        .hideDelay(settings.toast.hideDelay)
                );
            }

        }, function(){
            friend.love = undefined;
            $timeout(function(){
                friend.love = initialLove;
            }, 3000);
        });
    };

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

    $scope.toggleFriendVisibility = function(friend){
        friend.visibility = !friend.visibility;
        var toast = $mdToast.simple()
            .content($translate.instant(friend.visibility ? 'friends.list.show.toast.content' : 'friends.list.hide.toast.content', {
                name: friend.name
            }))
            .action($translate.instant('friends.list.hide.toast.cancel'))
            .highlightAction(false)
            .position(settings.toast.position)
            .hideDelay(settings.toast.hideDelay);
        $mdToast.show(toast).then(function(response) {
            if ( response === 'ok' ) {
                friend.visibility = !friend.visibility;
            }
        });

    };

});