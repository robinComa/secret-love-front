'use strict';

angular.module('app').provider('AnalyticsService', function(){

  /* jshint ignore:start */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  /* jshint ignore:end */

  this.activated = true;
  this.logger = false;

  this.$get = function($log){

    var analytics = (function(action, type, params){
      if(this.activated){
        ga(action, type, params);
      }
      if(this.logger){
        $log.info('ANALYTICS : ', action, type, params);
      }
    }).bind(this);

    analytics('create', 'UA-70670563-1', 'auto');

    return {
      sendPageView: function(page, title){
        analytics('send', 'pageview', {
          page: page,
          title: title
        });
      },
      sendEvent: function(category, action, label){
        analytics('send', 'event', {
          eventCategory: category,
          eventAction: action,
          eventLabel: label
        });
      }
    };
  };

});
