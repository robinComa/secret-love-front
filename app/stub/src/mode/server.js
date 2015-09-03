'use strict';

angular.module('appStub.server', [
    'appStub.json.file'
]).run(function($window, $httpBackend, GetJsonFile){

    $window.localStorage.removeItem('cache_data_friends');
    $window.localStorage.removeItem('cache_data_secretBox');

    $httpBackend.whenGET(/me$/).respond(GetJsonFile.synchronously('stub/data/me/GET-x.json'));
    $httpBackend.whenPOST(/me$/).respond(200);

    $httpBackend.whenGET(/secretbox$/).respond(GetJsonFile.synchronously('stub/data/secretbox/GET.json'));
    $httpBackend.whenPOST(/secretbox$/).respond(200);
    $httpBackend.whenDELETE(/secretbox\/.+\/.+$/).respond(200);

    $httpBackend.whenGET(/dialogs\/.*$/).respond(GetJsonFile.synchronously('stub/data/dialogs/GET.json'));
    $httpBackend.whenPOST(/dialogs$/).respond(200);

});