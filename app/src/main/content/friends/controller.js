'use strict';

angular.module('app').controller('FriendsCtrl', function(settings, $scope, $timeout, Friend,$mdDialog, $mdToast,$translate){

    $scope.loading = true;

    $scope.friends = [];
    Friend.query().then(function(){
        $scope.loading = false;
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

    $scope.toogleFriendVisibility = function(friend){
        friend.visibility = !friend.visibility;
        var content = $translate.instant('friends.list.hide.toast.content', {
            name: friend.name
        });
        if(friend.visibility){
            content = $translate.instant('friends.list.show.toast.content', {
                name: friend.name
            });
        }
        var toast = $mdToast.simple()
            .content(content)
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