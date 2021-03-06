'use strict';

angular.module('app').provider('$cache', function(settings){

    var validity = {
        SECOND: 1000
    };
    validity.MINUTE = 60 * validity.SECOND;
    validity.HOUR = 60 * validity.MINUTE;
    validity.DAY = 24 * validity.HOUR;
    validity.MONTH = 30 * validity.DAY;
    validity.YEAR = 365 * validity.MONTH;

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
        this.token[key] = new Cache('token_' + key, validity.YEAR);
        this.code[key] = new Cache('code_' + key, validity.MINUTE);
    }
    this.phoneReferrer = new Cache('phone_referrer', validity.YEAR);
    this.friends = new Cache('data_friends', validity.SECOND);
    this.secretBox = new Cache('data_secretBox', validity.SECOND);
    this.hiddenFriends = new Cache('data_hiddenFriends', validity.YEAR);

    this.$get = function(){
        return this;
    };

});
