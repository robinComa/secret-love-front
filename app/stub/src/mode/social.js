'use strict';

angular.module('appStub.social', [
    'appStub.json.file'
]).run(function($httpBackend, GetJsonFile){

    $httpBackend.whenJSONP(/https:\/\/www\.googleapis\.com\/plus\/v1\/people\/me\/people\/visible/).respond(GetJsonFile.synchronously('stub/data/friends/googlePlus.json'));
    $httpBackend.whenJSONP(/https:\/\/api\.instagram\.com\/v1\/users\/self\/follows/).respond(GetJsonFile.synchronously('stub/data/friends/instagram.json'));
    $httpBackend.whenJSONP(/https:\/\/graph.facebook.com\/v2.4\/me\/taggable_friends/).respond(GetJsonFile.synchronously('stub/data/friends/facebook.json'));

});