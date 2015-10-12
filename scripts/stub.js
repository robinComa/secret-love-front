'use strict';

angular.module('appStub', [
    'app',
    'appStub.server',
    'appStub.social',
    'appStub.interceptor',
    'ngMockE2E'
]).config(function($httpProvider){

    $httpProvider.interceptors.push('HttpStubInterceptor');

}).run(function($httpBackend, $interval, SecretBox, $cache){

    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenJSONP(/.*/).passThrough();

    var interval = $interval(function(){
        SecretBox.query().then(function(secretBox){
            var match = false;
            var secretsToMatch = secretBox.map(function(secret){
                if(secret.friend.inLove === false && !secret.hasNews && !secret.messages && !false){
                    secret.friend.inLove = true;
                    secret.hasNews = true;
                    secret.messages = [];
                    match = true;
                }
                return secret;
            });
            if(match){
                $cache.secretBox.setData(secretsToMatch);
                $interval.cancel(interval);
            }
        });
    }, 30 * 1000);

});
'use strict';

angular.module('appStub.interceptor', []).service('HttpStubInterceptor', function($q, $timeout){
    var getMockedAsyncRespondTime = function (url) {
        switch (url.split(/\./).pop()) {
            case 'json':
                return 300;
            case 'html':
                // In production all views are into cachedUrl as JS Templates
                return 0;
            default:
                // Web Services
                return 800;
        }
    };
    return {
        response: function (response) {
            var defer = $q.defer();
            $timeout(function () {
                defer.resolve(response);
            }, getMockedAsyncRespondTime(response.config.url.toString()));
            return defer.promise;
        }
    };
});
'use strict';

angular.module('appStub.json.file', []).service('GetJsonFile', function(){
    this.synchronously = function(url){
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        return request.response;
    };
});
'use strict';

angular.module('appStub.server', [
    'appStub.json.file'
]).run(function($window, $httpBackend, GetJsonFile){

    $window.localStorage.removeItem('cache_data_friends');
    $window.localStorage.removeItem('cache_data_secretBox');

    $httpBackend.whenGET(/me$/).respond(GetJsonFile.synchronously('stub/data/me/GET-x.json'));
    $httpBackend.whenPUT(/me$/).respond(200);
    $httpBackend.whenPOST(/me$/).respond(200);
    $httpBackend.whenPOST(/me\/authenticate$/).respond(401);
    $httpBackend.whenGET(/me\/logout$/).respond(200);
    $httpBackend.whenPOST(/me\/forgot-password$/).respond(200);
    $httpBackend.whenPOST(/me\/unique$/).respond({unique: true});
    $httpBackend.whenPUT(/me\/disconnect$/).respond(200);
    $httpBackend.whenPOST(/me\/connect$/).respond(200);

    $httpBackend.whenGET(/secretbox$/).respond(GetJsonFile.synchronously('stub/data/secretbox/GET.json'));
    $httpBackend.whenPOST(/secretbox$/).respond(200);
    $httpBackend.whenDELETE(/secretbox\/.+\/.+$/).respond(200);

    $httpBackend.whenGET(/dialogs\/.*$/).respond(GetJsonFile.synchronously('stub/data/dialogs/GET.json'));
    $httpBackend.whenPOST(/dialogs$/).respond(200);


});
'use strict';

angular.module('appStub.social', [
    'appStub.json.file'
]).run(function($window, $httpBackend, GetJsonFile){

    var token = {data: 'AZERTY', timestamp: (new Date()).getTime()};

    $window.localStorage.setItem('cache_token_facebook', JSON.stringify(token));
    $window.localStorage.setItem('cache_token_instagram', JSON.stringify(token));
    $window.localStorage.setItem('cache_token_googlePlus', JSON.stringify(token));
    $window.localStorage.setItem('cache_token_viadeo', JSON.stringify(token));

    $httpBackend.whenJSONP(/https:\/\/www\.googleapis\.com\/plus\/v1\/people\/me\/people\/visible/).respond(GetJsonFile.synchronously('stub/data/friends/googlePlus.json'));
    $httpBackend.whenJSONP(/https:\/\/api\.instagram\.com\/v1\/users\/self\/follows/).respond(GetJsonFile.synchronously('stub/data/friends/instagram.json'));
    $httpBackend.whenJSONP(/https:\/\/graph.facebook.com\/v2.4\/me\/taggable_friends/).respond(GetJsonFile.synchronously('stub/data/friends/facebook.json'));

    $httpBackend.whenPOST(/proxy\/viadeo\-friends/).respond(GetJsonFile.synchronously('stub/data/friends/viadeo.json'));

});