'use strict';

angular.module('app').directive('bodyMessageAction', function(){
    return {
        restrict: 'E',
        scope: {
            titleLabel: '@',
            messageLabel: '@',
            action: '@',
            actionLabel: '@'
        },
        templateUrl: 'src/components/body-message-action/view.html',
        link: function(){

        }
    };
});