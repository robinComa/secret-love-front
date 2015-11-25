'use strict';

angular.module('appStub', [
    'app',
    'appStub.server',
    'appStub.social',
    'appStub.interceptor',
    'ngMockE2E'
]).config(function($httpProvider, phoneProvider){

  phoneProvider.stub = true;
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
