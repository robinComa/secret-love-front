'use strict';

angular.module('app').provider('$cache', function(settings){

    var validity = {
        LOW: 60 * 60 * 1000,
        MEDIUM: 24 * 60 * 60 * 1000,
        HIGH: 30 * 24 * 60 * 60 * 1000
    };

    var now = function(){
        return (new Date()).getTime();
    };

    var Cache = function(name, invalidity){
        this.key = 'cache_' + name;
        this.invalidity = invalidity;
    };
    Cache.prototype.getCache = function(){
        var cache = window.localStorage.getItem(this.key);
        return JSON.parse(cache);
    };
    Cache.prototype.setCache = function(cache){
        window.localStorage.setItem(this.key, JSON.stringify(cache));
    };
    Cache.prototype.invalid = function(){
        window.localStorage.removeItem(this.key);
    };
    Cache.prototype.getData = function(){
        var cache = this.getCache();
        if(!cache || cache.timestamp + this.invalidity < now()){
            this.invalid();
            return null;
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

    this.token = {};
    this.code = {};
    for(var key in settings.socials){
        this.token[key] = new Cache('token_' + key, validity.HIGH);
        this.code[key] = new Cache('code_' + key, validity.HIGH);
    }
    this.friends = new Cache('data_friends', validity.LOW);

    this.$get = function(){
        return this;
    };

});