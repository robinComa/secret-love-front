angular.module('app').provider('$google', function(settings){

    var getUriToken = function(hash){
        var reg = hash.match(/&access_token=([^&]+)/);
        return reg && reg[1] ? reg[1] : null;
    };

    var token = getUriToken(window.location.hash);

    if(token){
        window.localStorage.setItem('access_token_google', token);
    }
    token = window.localStorage.getItem('access_token_google');

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
                    var url = 'https://accounts.google.com/o/oauth2/auth';
                    url += '?client_id=' + settings.socials.googlePlus.auth.clientId;
                    url += '&redirect_uri=' + settings.socials.googlePlus.auth.redirectUri;
                    url += '&response_type=token';
                    url += '&state=security_token';
                    url += '&approval_prompt=force';
                    url += '&include_granted_scopes=true';
                    url += '&scope=' + settings.socials.googlePlus.auth.scope.join(' ');
                    window.location = url;
                    return $q.when();
                }
            }
        };

    };

});