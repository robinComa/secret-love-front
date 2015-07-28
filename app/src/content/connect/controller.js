angular.module('app').controller('ConnectCtrl', function($scope, Social, $google){

    Social.query().$promise.then(function(socials){
        $scope.connections = socials;
    });

    $scope.connect = function(){
        $google.connect().then(function(){

        });
    };

});