'use strict';

angular.module('appDev', [
    'app'
]).config(function(settings){
  settings.endpoint = 'http://localhost:9001/rest-api/'
});
