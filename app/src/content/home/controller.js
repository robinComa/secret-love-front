angular.module('app').controller('HomeCtrl', function($scope, $interval, Social){

    Social.query().$promise.then(function(iconList){

        var duration = 2000;
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
});