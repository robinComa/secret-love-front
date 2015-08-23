'use strict';

angular.module('app').controller('SidenavCtrl', function(settings, $scope, $interval){

    $scope.entries = [{
        uiSref: 'friends-list',
        label: 'sidenav.entry.label.friends',
        icon: 'group'
    },{
        uiSref: 'dialog',
        label: 'sidenav.entry.label.dialog',
        icon: 'forum'
    },{
        uiSref: 'connect',
        label: 'sidenav.entry.label.connect',
        icon: 'apps'
    },{
        uiSref: 'settings',
        label: 'sidenav.entry.label.settings',
        icon: 'settings_applications'
    }];

    var duration = 2000;
    var i = 0;
    var keys = Object.keys(settings.socials);

    $scope.selectedIcon = settings.socials[keys[i]].icon;

    $interval(function(){
        $scope.selectedIcon = settings.socials[keys[i % keys.length]].icon;
        i++;
    }, duration);

    $scope.option = {
        rotation: 'none',
        duration: duration,
        easing : 'sine-out'
    };

});