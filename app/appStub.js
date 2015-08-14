'use strict';

angular.module('appStub', [
    'app',
    'ngMockE2E'
]).config(function($httpProvider){

    $httpProvider.interceptors.push('HttpStubInterceptor');

}).run(function($httpBackend, GetJsonFile){

    $httpBackend.whenGET(/me$/).respond(GetJsonFile.synchronously('stub/me/GET-x.json'));
    $httpBackend.whenPOST(/me$/).respond(200);

    $httpBackend.whenGET(/friends$/).respond(GetJsonFile.synchronously('stub/friends/GET.json'));
    $httpBackend.whenPOST(/friends$/).respond(200);

    $httpBackend.whenGET(/dialogs$/).respond(GetJsonFile.synchronously('stub/dialogs/GET.json'));

    $httpBackend.whenPOST(/dialogs$/).respond(200);
    $httpBackend.whenPOST(/messages$/).respond(200);

    $httpBackend.whenJSONP(/https:\/\/www\.googleapis\.com\/plus\/v1\/people\/me\/people\/visible/).respond(GetJsonFile.synchronously('stub/friends/googlePlus.json'));
    $httpBackend.whenJSONP(/https:\/\/api\.instagram\.com\/v1\/users\/self\/follows/).respond(GetJsonFile.synchronously('stub/friends/instagram.json'));

    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenJSONP(/.*/).passThrough();
});

angular.module('appStub').service('HttpStubInterceptor', function($q, $timeout){
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

angular.module('appStub').service('GetJsonFile', function(){
    this.synchronously = function(url){
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        return request.response;
    };
});