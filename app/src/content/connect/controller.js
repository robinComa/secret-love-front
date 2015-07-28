angular.module('app').controller('ConnectCtrl', function($scope, Social, $google){

    Social.query().$promise.then(function(socials){
        $scope.connections = socials;
    });

    $scope.connect = function(){
        $google.connect().then(function(){
            $google.getFriends().then(function(resp){
                var numItems = resp.items.length;
                for (var i = 0; i < numItems; i++) {
                    console.log(resp.items[i].displayName);
                }
            });

        });
    };

});