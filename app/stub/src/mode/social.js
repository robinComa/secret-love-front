'use strict';

angular.module('appStub.social', [
    'appStub.json.file'
]).run(function($window, $httpBackend, GetJsonFile){

    var token = {data: 'AZERTY', timestamp: (new Date()).getTime()};

    $window.localStorage.setItem('cache_token_facebook', JSON.stringify(token));
    $window.localStorage.setItem('cache_token_instagram', JSON.stringify(token));
    $window.localStorage.setItem('cache_token_googlePlus', JSON.stringify(token));

    $httpBackend.whenJSONP(/https:\/\/www\.googleapis\.com\/plus\/v1\/people\/me\/people\/visible/).respond(GetJsonFile.synchronously('stub/data/friends/googlePlus.json'));
    $httpBackend.whenJSONP(/https:\/\/api\.instagram\.com\/v1\/users\/self\/follows/).respond(GetJsonFile.synchronously('stub/data/friends/instagram.json'));
    $httpBackend.whenJSONP(/https:\/\/graph.facebook.com\/v2.4\/me\/taggable_friends/).respond(GetJsonFile.synchronously('stub/data/friends/facebook.json'));

});