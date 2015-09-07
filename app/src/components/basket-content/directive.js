'use strict';

angular.module('app').directive('basketContent', function($timeout){
    return {
        restrict: 'E',
        scope: {
            basket: '=basket'
        },
        templateUrl: 'src/components/basket-content/view.html',
        link: function($scope){

            $scope.$watch(function(){
                return $scope.basket.loves;
            }, function(val, oldVal){
                if(val !== oldVal){
                    if(val < oldVal){
                        $scope.moveMinusOne = true;
                        $timeout(function(){
                            $scope.moveMinusOne = false;
                        }, 2000);
                    }
                }
            });
        }
    };
});