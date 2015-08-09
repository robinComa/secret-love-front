angular.module('app').provider('$facebook', function(settings){

    var STORAGE_ITEM_CODE_NAME = 'access_code_facebook';
    var STORAGE_ITEM_TOKEN_NAME = 'access_token_facebook';

    var getUriToken = function(hash){
        var reg = hash.match(/\?code=([^&]*)#/);
        return reg && reg[1] ? reg[1] : null;
    };
    var code = getUriToken(window.location.href);

    if(code){
        window.localStorage.setItem(STORAGE_ITEM_CODE_NAME, code);
    }
    code = window.localStorage.getItem(STORAGE_ITEM_CODE_NAME);

    var token = window.localStorage.getItem(STORAGE_ITEM_TOKEN_NAME);

    this.$get = function($q, $http){

        return {
            getToken: function(){
                var deferred = $q.defer();
                if(token){
                    deferred.resolve(token);
                }else if(code){
                    $http({
                        method: 'GET',
                        url: 'https://graph.facebook.com/oauth/access_token',
                        params: {
                            code: code,
                            client_id: settings.socials.facebook.auth.clientId,
                            client_secret: settings.socials.facebook.auth.clientSecret,
                            redirect_uri: settings.socials.facebook.auth.redirectUri
                        }
                    }).then(function(resp){
                        token = resp.data.match(/access_token\=([^&]+)/)[1];
                        window.localStorage.setItem(STORAGE_ITEM_TOKEN_NAME, token);
                        window.localStorage.removeItem(STORAGE_ITEM_CODE_NAME);
                        deferred.resolve(token);
                    }, deferred.reject);
                }
                return deferred.promise;
            },
            connect: function(){
                if(code){
                    return $q.when(code);
                }else{
                    var url = 'https://www.facebook.com/v2.0/dialog/oauth';
                    url += '?app_id=' + settings.socials.facebook.auth.clientId;
                    url += '&redirect_uri=' + settings.socials.facebook.auth.redirectUri;
                    url += '&scope=' + settings.socials.facebook.auth.scope.join(',');
                    window.location = url;
                    return $q.when();
                }
            },
            isConnected: function(){
                return window.localStorage.getItem(STORAGE_ITEM_TOKEN_NAME) !== null;
            },
            disconnect: function(){
                window.localStorage.removeItem(STORAGE_ITEM_TOKEN_NAME);
            },
            isImplemented: function(){
                return true;
            }
        };

    };

});