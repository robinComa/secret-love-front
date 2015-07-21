angular.module('app').controller('HomeCtrl', function($scope, $interval){

    var duration = 2000;

    var iconList = [{
        icon: 'twitter',
        color: '#1AB2E8'
    },{
        icon: 'google-plus',
        color: '#DA4835'
    },{
        icon: 'facebook',
        color: '#3B5998'
    },{
        icon: 'linkedin',
        color: '#0177B5'
    },{
        icon: 'photo_camera',
        color: 'brown'
    }];

    var i = 0;
    $scope.selectedIcon = iconList[i];
    $interval(function(){
        $scope.selectedIcon = iconList[i % iconList.length];
        i++;
    }, duration);

    $scope.option = {
        rotation: 'none',
        duration: duration,
        easing : 'sine-out'
    };

});