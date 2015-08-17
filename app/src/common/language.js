'use strict';

angular.module('app').provider('Language', function(){

    this.getPreferredLanguage = function(){
        var browserLang = navigator.language || navigator.userLanguage;
        switch (browserLang){
            case 'fr':
                return 'fr';
            default:
                return 'en';
        }
    };

    this.$get = function(){

    };

});