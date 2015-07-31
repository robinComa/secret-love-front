angular.module('app').controller('ConnectCtrl', function($scope, settings, $google, $instagram, $facebook){

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
            case 'facebook':
                $facebook.connect().then(function(){

                });
                break;
        }


    };

});