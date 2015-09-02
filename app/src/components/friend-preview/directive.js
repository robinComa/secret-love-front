'use strict';

angular.module('app').directive('friendPreview', function(settings, Friend){

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            friend: '=friend'
        },
        templateUrl: 'src/components/friend-preview/view.html',
        link: function($scope){

            if(!$scope.friend.picture || !$scope.friend.name){
                Friend.query().then(function(friends){

                    var matchFriends = friends.filter(function(f){
                        return f.id === $scope.friend.id && f.type === $scope.friend.type;
                    });

                    if(matchFriends[0]){
                        $scope.friend.name = matchFriends[0].name;
                        $scope.friend.picture = matchFriends[0].picture;
                    }
                });
            }

            $scope.getSocialIcon = function(social){
                if(social){
                    return settings.socials[social].icon;
                }
            };
        }
    };
});