'use strict';

angular.module('app').filter('orderByFresh', function() {
    return function( items ) {
        return items.sort(function(a, b){
            var aStamp = a.lastUpdate  / (a.hasNews ? 1 : 1000);
            var bStamp = b.lastUpdate  / (b.hasNews ? 1 : 1000);
            return (aStamp - bStamp) < 0 ? 1 : -1;
        });
    };
});