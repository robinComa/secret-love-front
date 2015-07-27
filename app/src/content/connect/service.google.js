angular.module('app').provider('$google', function(){

    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js?onload=GoogleApiIsLoaded';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    this.$get = function($q){

        var getApi = function(){
            return $q.when(gapi);
        };

        var handleAuthResult = function(authResult) {
            console.log(authResult);
            if (authResult && !authResult.error) {

            } else {

            }
        };

        return {
            connect: function(){
                getApi().then(function(gapi){
                    gapi.auth.authorize({client_id: '631974897480', scope: 'https://www.googleapis.com/auth/plus.me', immediate: true}, handleAuthResult);
                });
            }
        };

    };

});