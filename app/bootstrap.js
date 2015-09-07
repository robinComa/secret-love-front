'use strict';

angular.element(document).ready(function() {

    var LoadApplication = function(){

        var KEY = 'application_mode';

        this.isAppStub = function(){
            return sessionStorage.getItem(KEY) === 'appStub';
        };

        this.load = function(){
            if(this.isAppStub()){
                angular.bootstrap(document, ['appStub']);
            }else{
                angular.bootstrap(document, ['app']);
            }
        };

        this.loadAppStub = function(){
            sessionStorage.setItem('application_mode', 'appStub');
            window.location = window.location.href.split(window.location.hash)[0];
        };
        this.loadApp = function(){
            sessionStorage.removeItem('application_mode');
            window.location = window.location.href.split(window.location.hash)[0];
        };
    };

    angular.module('app').service('LoadApplication', LoadApplication);

    var service = new LoadApplication();
    service.load();

});