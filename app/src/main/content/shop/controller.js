'use strict';

angular.module('app').controller('ShopCtrl', function($scope, me){

    $scope.items = [{
        icon: 'favorite_outline',
        type: 'love',
        nb: 1,
        price: '0.99 USD'
    },{
        icon: 'favorite_outline',
        type: 'love',
        nb: 3,
        price: '2.99 USD'
    },{
        icon: 'favorite_outline',
        type: 'love',
        nb: 10,
        price: '6.99 USD'
    },{
        icon: 'favorite_outline',
        type: 'love',
        nb: 20,
        price: '9.99 USD'
    }];

    $scope.purchase = function(item){
        var initialLoves = me.basket.loves;
        me.basket.loves += item.nb;
        me.$update().then(function(){

        }, function(){
            me.basket.loves = initialLoves;
        });
    };

});