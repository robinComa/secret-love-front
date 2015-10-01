'use strict';

angular.module('app').controller('FriendsCtrl', function(settings, me, $scope, $state, Friend, $filter, $mdToast, $mdDialog, $translate, $timeout, SecretBox, $cache){

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

    $scope.toogleLove = function(friend, ev){

        var friendCopy = angular.copy(friend);
        friendCopy.love = !friendCopy.love;

        if(friendCopy.love && me.basket.loves < 1){
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title($translate.instant('friends.no.more.love.dialog.title') + ' :\'(')
                    .content($translate.instant('friends.no.more.love.dialog.content'))
                    .ariaLabel($translate.instant('friends.no.more.love.dialog.content'))
                    .ok($translate.instant('friends.no.more.love.dialog.action'))
                    .targetEvent(ev)
            );
        }else{
            if(friendCopy.love){
                me.basket.loves--;
                $scope.requestSend = true;
                SecretBox.save({
                    type: friendCopy.type,
                    id: friendCopy.id
                }).then(function(){

                    friend.love = friendCopy.love;
                    $cache.friends.invalid();

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
                    $scope.requestSend = false;

                }, function(){
                    me.basket.loves++;
                    $scope.requestSend = false;
                });
            }else{
                $scope.requestSend = true;
                SecretBox.delete({
                    id: friendCopy.id,
                    type: friendCopy.type
                }).then(function(){
                    $scope.requestSend = true;
                    friend.love = friendCopy.love;
                    $cache.friends.invalid();
                }, function(){
                    $scope.requestSend = false;
                });
            }

        }
    };

    $scope.toggleFriendVisibility = function(friend){

        var setVisibility = function(visibility){
            friend.visibility = visibility;
            $cache.friends.setData($scope.friends);
            $cache.hiddenFriends.setData($scope.friends.filter(function(f){
                return !f.visibility;
            }).map(function(f){
                return {
                    id: f.id,
                    type: f.type
                };
            }));
        };

        setVisibility(!friend.visibility);

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
                setVisibility(!friend.visibility);
            }
        });
    };

});