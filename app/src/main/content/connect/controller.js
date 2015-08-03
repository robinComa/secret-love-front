angular.module('app').controller('ConnectCtrl', function($scope, settings, $google, $instagram, $facebook, $linkedin, $twitter){

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
            case 'linkedin':
                $linkedin.connect().then(function(){

                });
                break;
            case 'twitter':
                $twitter.connect().then(function(){

                });
                break;
        }


    };

});