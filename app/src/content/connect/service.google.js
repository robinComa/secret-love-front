angular.module('app').constant('setting').provider('$google', function(settings){

    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client.js?onload=handleClientLoad';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    window.handleClientLoad = function(){
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
                if (authResult['error'] == undefined){
                    gapi.auth.setToken(authResult);
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        };
        var getFriends = function(){
            var deferred = $q.defer();
            gapi.client.load('plus', 'v1', function() {
                var request = gapi.client.plus.people.list({
                    'userId' : 'me',
                    'collection' : 'visible'
                });
                request.execute(function(resp) {
                    deferred.resolve(resp);
                });
            });
            return deferred.promise;
        };

        return {
            connect: connect,
            getFriends: getFriends
        };

    };

});