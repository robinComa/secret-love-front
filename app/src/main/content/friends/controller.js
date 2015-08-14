'use strict';

angular.module('app').controller('FriendsCtrl', function(settings, $scope, $timeout, Friend,$mdDialog, $mdToast,$translate){

    $scope.loading = true;
    $scope.displayModeAsList = true;

    $scope.friends = [];
    Friend.query().then(function(){
        $scope.loading = false;
    }, function(error){
        console.error('Friend loading error : ' + error);
    }, function(friends){
        $scope.friends = $scope.friends.concat(friends);
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

    $scope.getSocialIcon = function(social){
        return settings.socials[social].icon;
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