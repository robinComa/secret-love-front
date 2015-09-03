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