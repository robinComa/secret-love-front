angular.module('app').provider('$facebook', function(settings){

    var getUriToken = function(hash){
        var reg = hash.match(/code=([^#]+)/);
        return reg && reg[1] ? reg[1].replace(/[^A-Za-z]/g, '') : null;
    };
    var token = getUriToken(window.location.href);
    console.log(window.location.href)
    if(token){
        window.localStorage.setItem('access_token_facebook', token);
    }
    token = window.localStorage.getItem('access_token_facebook');

    this.$get = function($q){

        return {
            getToken: function(){
                return $q.when(token);
            },
            connect: function(){
                if(token){
                    return $q.when(token);
                }else{
                    var url = 'https://www.facebook.com/v2.0/dialog/oauth';
                    url += '?app_id=' + settings.socials.facebook.auth.clientId;
                    url += '&redirect_uri=' + settings.socials.facebook.auth.redirectUri;
                    url += '&scope=' + settings.socials.facebook.auth.scope.join(',');
                    window.location = url;
                    return $q.when();
                }
            }
        };

    };

});