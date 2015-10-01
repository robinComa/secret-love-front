'use strict';

angular.module('app').directive('socialIcon', function(){

    return {
        restrict: 'E',
        templateUrl: 'src/components/social/view.html',
        scope: {
            name: '@name',
            color: '@color'
        },
        link: function(scope, el){
            var size = el.attr('size');
            setTimeout(function(){
                var svg = el.find('svg');
                svg.attr('width', size);
                svg.attr('height', size);
            },100);
            scope.isUrl = function(name){
                return name.indexOf('/') !== -1;
            };
        }
    };

});