'use strict';

angular.module('app').directive('friendsFilter', function(settings, $injector){
    return {
        restrict: 'E',
        templateUrl: 'src/main/content/friends/list/filter/view.html',
        scope: {
            filter: '=',
            result: '='
        },
        link: function(scope, el){
            scope.socials = settings.socials;

            scope.isOpen = false;

            scope.$watch(function(){
                return scope.isOpen;
            }, function(val){
                angular.element(el).find('md-fab-actions').css({
                    display: val ? 'flex': 'none'
                });
            });

            scope.socialToggle = function(value){
                var index = scope.filter.type.indexOf(value);
                if(index !== -1){
                    scope.filter.type.splice(index, 1);
                }else{
                    scope.filter.type.push(value);
                }
            };

            scope.isConnected = function(name){
                return $injector.get(name).isConnected();
            };

            scope.socialIsSelected = function(type){
                return scope.filter.type.indexOf(type) !== -1;
            };

            scope.loveSelected = function(value){
                var index = scope.filter.love.indexOf(value);
                if(index !== -1){
                    scope.filter.love.splice(index, 1);
                }else{
                    scope.filter.love.push(value);
                }
            };
            scope.loveIsSelected = function(love){
                return scope.filter.love.indexOf(love) !== -1;
            };

            scope.visibilityToggle = function(){
                scope.filter.visibility = !scope.filter.visibility;
            };
        }
    };

});