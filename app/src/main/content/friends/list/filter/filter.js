'use strict';

angular.module('app').filter('friendFilter', function($filter) {
    return function( items, filter ) {
        if(!items){
            return [];
        }
        var friends = items.filter(function(item){
            var keep = filter.visibility === item.visibility;
            keep = keep && filter.love.indexOf(item.love) !== -1;
            keep = keep && filter.type.indexOf(item.type) !== -1;
            return keep;
        });
        friends = $filter('filter')(friends, filter.search);
        friends = $filter('orderBy')(friends, 'name');
        return friends;
    };
});