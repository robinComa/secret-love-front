angular.module('app').controller('ConnectCtrl', function($scope, settings, $google, $instagram){

    $scope.connections = settings.socials;

    $scope.connect = function(type){
        switch (type){
            case 'googlePlus':
                $google.connect().then(function(){

                });
                break;
            case 'instagram':
                $instagram.connect().then(function(){

                });
                break;
        }


    };

});