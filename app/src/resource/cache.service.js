'use strict';

angular.module('app').service('$cache', function($window){

    var now = function(){
        return (new Date()).getTime();
    };

    var Cache = function(name, invalidity){
        this.key = 'cache_' + name;
        this.invalidity = invalidity;
    };
    Cache.prototype.getCache = function(){
        var cache = $window.localStorage.getItem(this.key);
        return JSON.parse(cache);
    };
    Cache.prototype.setCache = function(cache){
        $window.localStorage.setItem(this.key, JSON.stringify(cache));
    };
    Cache.prototype.invalid = function(){
        $window.localStorage.removeItem(this.key);
    };
    Cache.prototype.getData = function(){
        var cache = this.getCache();
        if(!cache || cache.timestamp + this.invalidity < now()){
            this.invalid();
            return [];
        }else{
            return cache.data;
        }
    };
    Cache.prototype.setData = function(data){
        this.timestamp = now();
        var cache = {
            data: data,
            timestamp: now()
        };
        this.setCache(cache);
    };

    this.friends = new Cache('friends', 60 * 60 * 1000);

});