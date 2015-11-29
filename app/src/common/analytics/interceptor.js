'use strict';

angular.module('app').provider('AnalyticsInterceptor', function(){

  this.$get = function($q, $rootScope, AnalyticsService){

    $rootScope.$on('$stateChangeSuccess', function(event, toState){
      AnalyticsService.sendPageView(toState.url, toState.name);
    });
    return {
      response: function(response) {
        AnalyticsService.sendEvent('XHR', response.config.method + '/' + response.status, response.config.url);
        return response;
      },
      responseError: function(rejection) {
        AnalyticsService.sendEvent('XHR', rejection.config.method + '/' + rejection.status, rejection.config.url);
        return $q.reject(rejection);
      }
    };
  };

});
