angular.module('app').provider('$instagram', function(settings){

    var getUriToken = function(hash){
        var reg = hash.match(/#access_token=([^&]+)/);
        return reg && reg[1] ? reg[1] : null;
    };

    var token = getUriToken(window.location.hash);
    if(token){
        window.localStorage.setItem('access_token_instagram', token);
    }
    token = window.localStorage.getItem('access_token_instagram');

    this.$get = function($q){

        return {
            getToken: function(){
                var deferred = $q.defer();
                if(token){
                    deferred.resolve(token);
                }else{
                    deferred.reject();
                }
                return deferred.promise;
            },
            connect: function(){
                if(token){
                    return $q.when(token);
                }else{
                    var url = 'https://instagram.com/oauth/authorize/';
                    url += '?client_id=' + settings.socials.instagram.auth.clientId;
                    url += '&redirect_uri=' + settings.socials.instagram.auth.redirectUri;
                    url += '&response_type=token';
                    url += '&scope=' + settings.socials.instagram.auth.scope.join('+');
                    window.location = url;
                    return $q.when();
                }
            }
        };

    };

});