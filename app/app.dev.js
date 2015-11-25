'use strict';

angular.module('appDev', [
    'app'
]).config(function(settings, AnalyticsServiceProvider){

  settings.endpoint = 'http://localhost:9001/rest-api/';

  AnalyticsServiceProvider.activated = false;
  AnalyticsServiceProvider.logger = false;

});
