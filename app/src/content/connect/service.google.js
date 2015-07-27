angular.module('app').constant('setting').provider('$google', function(settings){

    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js?onload=GoogleApiIsLoaded';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    window.GoogleApiIsLoaded = function(){
        gapi.client.setApiKey(settings.socials.google.apiKey);
    };

    this.$get = function($q){

        var connect = function(){
            var deferred = $q.defer();
            gapi.auth.authorize({
                client_id: settings.socials.google.clientId,
                scope: settings.socials.google.scope,
                immediate: false
             },function(authResult) {
                if (authResult && !authResult.error) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        };

        return {
            connect: connect
        };

    };

});