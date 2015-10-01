'use strict';

angular.module('app').controller('MainCtrl', function($scope, $mdSidenav, me, $state, LoadApplication, Me){

    $scope.me = me;
    $scope.state = $state;
    $scope.isAppStub = LoadApplication.isAppStub();

    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.loadApp = function(){
        LoadApplication.loadApp();
    };

    Me.getSocialsMe().then(function(socialsMe){
        var unsavedSocials = socialsMe.filter(function(social){
            return !$scope.me.socials.some(function(s){
                return s.id === social.id && s.type === social.type;
            });
        });
        unsavedSocials.forEach(function(socialMe){
            Me.connect(socialMe);
        });
    });

});