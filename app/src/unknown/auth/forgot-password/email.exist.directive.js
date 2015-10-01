'use strict';

angular.module('app').directive('emailExist', function(Me){

    return{
        restrict: 'A',
        require: 'ngModel',
        scope: {
          ngModel: '='
        },
        link: function(scope, element, attributes, ctrl){

            scope.$watch(function(){
                return scope.ngModel;
            }, function(val){
                Me.isUnique({
                    email: val
                }).$promise.then(function(response){
                    ctrl.$setValidity('exist', !response.unique);
                }, function(){
                    ctrl.$setValidity('exist', false);
                });
            });

        }
    };

});