'use strict';

angular.module('app').provider('Connection', function(settings, $cacheProvider){

    var findPatternInURI = function(pattern){
        var reg = window.location.href.match(pattern);
        return reg && reg[1] ? reg[1] : null;
    };

    for(var i in settings.socials){
        var hash = findPatternInURI(settings.socials[i].auth.patternURI);
        if(hash){
            if(settings.socials[i].auth.isCode){
                $cacheProvider.code[i].setData(hash);
                window.location = window.location.href.split('?')[0] + '#/';
            }else{
                $cacheProvider.token[i].setData(hash);
            }
            break;
        }
    }

    this.$get = function($q){
      return function(args){

          this.getToken = function(){
            var deferred = $q.defer();
            var token = $cacheProvider.token[args.name].getData();
            var code = $cacheProvider.code[args.name].getData();
            if(token){
                deferred.resolve(token);
            }else if(code){
                args.getTokenWithCode(code).then(function(token){
                    $cacheProvider.code[args.name].invalid();
                    $cacheProvider.token[args.name].setData(token);
                    deferred.resolve(token);
                });
            }else{
                args.sendTokenRequest();
                deferred.reject(token);
            }
            return deferred.promise;
          };

          this.close = function(){
              var deferred = $q.defer();
              args.sendConnectionClose().then(function(){
                  $cacheProvider.code[args.name].invalid();
                  $cacheProvider.token[args.name].invalid();
                  deferred.resolve();
              }, deferred.reject);
              return deferred.promise;
          };

          this.isConnected = function(){
              return $cacheProvider.token[args.name].getData() !== null;
          };

          this.isImplemented = function(){
              return args.isImplemented;
          };

          this.getFriends = function(){
              var code = $cacheProvider.code[args.name].getData();
              var deferred = $q.defer();
              if(code){
                  var connection = this;
                  connection.getToken().then(function(){
                      deferred.resolve(connection.isConnected()? args.getFriends($cacheProvider.token[args.name].getData(), connection.getToken, connection.close) : []);
                  });
              }else{
                  deferred.resolve(this.isConnected()? args.getFriends($cacheProvider.token[args.name].getData(), this.getToken, this.close) : []);
              }
              return deferred.promise;
          };

      };
    };


});