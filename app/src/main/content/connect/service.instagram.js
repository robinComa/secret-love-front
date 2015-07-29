angular.module('app').provider('$instagram', function(settings){

    var token = window.location.hash.split('#access_token=')[1];
    if(token){
        window.localStorage.setItem('access_token', token);
    }
    token = window.localStorage.getItem('access_token');

    this.$get = function($q){

        return {
            getToken: function(){
                return $q.when(token);
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