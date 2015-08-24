'use strict';

angular.module('app').controller('FriendsCtrl', function(settings, $scope, $state, Friend, $filter, $mdToast, $translate, $timeout){

    var isListState = function(){
        return $state.current.name === 'friends-list';
    };

    $scope.toggleListFace = function(){
        if(isListState()){
            $state.go('friends-face');
        }else{
            $state.go('friends-list');
        }
    };

    $scope.listOrFaceIcon = function(){
        return isListState() ? 'face': 'list';
    };

    $scope.loading = true;

    $scope.friends = [];
    Friend.query().then(function(){
        $scope.loading = false;
    }, function(){}, function(friends){
        $scope.friends = $scope.friends.concat(friends);
        updateFilteringFriends();
    });

    $scope.filter = {};

    var filter = function(friends, filter){
        return $filter('friendFilter')(friends, filter);
    };

    var updateFilteringFriends = function(){
        $scope.filteringFriends = filter($scope.friends, $scope.filter);
    };

    $scope.$watch(function(){
        return $scope.filter;
    }, updateFilteringFriends, true);

    $scope.$watch(function(){
        return $scope.filteringFriends;
    }, updateFilteringFriends, true);

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