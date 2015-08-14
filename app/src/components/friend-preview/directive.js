'use strict';

angular.module('app').directive('friendPreview', function(settings){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            friend: '=friend'
        },
        templateUrl: 'src/components/friend-preview/view.html',
        link: function($scope){
            $scope.getSocialIcon = function(social){
                return settings.socials[social].icon;
            };
        }
    };
});