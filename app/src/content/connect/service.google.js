angular.module('app').provider('$google', function(settings){

    var isApiloaded = false;
    var isConnected = false;

    window.handleClientLoad = function(){
        gapi.client.setApiKey(settings.socials.google.apiKey);
        isApiloaded = true;
    };

    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client.js?onload=handleClientLoad';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    this.$get = function($q, $interval){

        var authorize = function(){
            var deferred = $q.defer();
            gapi.auth.authorize({
                client_id: settings.socials.google.clientId,
                scope: settings.socials.google.scope,
                immediate: false
            },function(authResult) {
                if (authResult['error'] === undefined){
                    gapi.auth.setToken(authResult);
                    isConnected = true;
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        };

        return {
            connect: function(){
                var deferred = $q.defer();
                var interval = $interval(function(){
                    if(isApiloaded){
                        if(isConnected){
                            deferred.resolve();
                        }else{
                            authorize().then(deferred.resolve, deferred.reject);
                        }
                        $interval.cancel(interval);
                    }
                }, 100);
                return deferred.promise;
            }
        };

    };

});