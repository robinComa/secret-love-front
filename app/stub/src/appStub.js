'use strict';

angular.module('appStub', [
    'app',
    'appStub.server',
    'appStub.social',
    'appStub.interceptor',
    'ngMockE2E'
]).config(function($httpProvider){

    $httpProvider.interceptors.push('HttpStubInterceptor');

}).run(function($httpBackend, $window){

    $window.localStorage.clear();

    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenJSONP(/.*/).passThrough();
});