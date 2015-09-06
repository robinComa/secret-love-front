'use strict';

angular.module('app').directive('verifyModel', function(){

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            verifyModel: '=',
            ngModel: '=ngModel'
        },
        link: function(scope, element, attributes, ctrl){

            var compare = function() {
                ctrl.$setValidity('verify', scope.verifyModel === scope.ngModel);
            };

            scope.$watch(function(){
                return scope.verifyModel;
            }, compare);

            scope.$watch(function(){
                return scope.ngModel;
            }, compare);

        }
    };

});