angular.module('app').controller('ConnectCtrl', function($scope, Social){

    Social.query().$promise.then(function(socials){
        $scope.connections = socials;
    });

});