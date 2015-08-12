angular.module('app').provider('$connection', function(settings){

    var STORAGE_ITEM_TOKEN_NAME_PREFIX = 'access_token_';

    var findPatternInURI = function(pattern){
        var reg = window.location.href.match(pattern);
        return reg && reg[1] ? reg[1] : null;
    };

    for(var i in settings.socials){
        var hash = findPatternInURI(settings.socials[i].auth.patternURI);
        if(hash){
            console.log(STORAGE_ITEM_TOKEN_NAME_PREFIX + i);
            localStorage.setItem(STORAGE_ITEM_TOKEN_NAME_PREFIX + i, hash);
            break;
        }
    }

    this.$get = function($q){
      return function(args){

          var STORAGE_ITEM_TOKEN_NAME = STORAGE_ITEM_TOKEN_NAME_PREFIX + args.name;

          this.getToken = function(){
            var deferred = $q.defer();
            var token = localStorage.getItem(STORAGE_ITEM_TOKEN_NAME);
            if(token){
                deferred.resolve(token);
            }else{
                args.sendTokenRequest();
                deferred.reject(token);
            }
            return deferred.promise;
          };

          this.close = function(){
              var deferred = $q.defer();
              args.sendConnectionClose().then(function(){
                  localStorage.removeItem(STORAGE_ITEM_TOKEN_NAME);
                  deferred.resolve();
              }, deferred.reject);
              return deferred.promise;
          };

          this.isConnected = function(){
              return window.localStorage.getItem(STORAGE_ITEM_TOKEN_NAME) !== null;
          };

          this.isImplemented = function(){
              return args.isImplemented;
          };

          this.getFriends = function(){
              return $q.when(this.isConnected()? args.getFriends(window.localStorage.getItem(STORAGE_ITEM_TOKEN_NAME), this.getToken, this.close) : []);
          };

      };
    };


});