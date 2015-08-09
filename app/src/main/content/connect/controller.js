angular.module('app').controller('ConnectCtrl', function($scope, settings, $translate, $mdDialog, $google, $instagram, $facebook, $linkedin, $twitter){

    $scope.connections = settings.socials;

    var getSocialServiceByName = function(name){
        switch (name) {
            case 'googlePlus':
                return $google;
            case 'instagram':
                return $instagram;
            case 'facebook':
                return $facebook;
            case 'linkedin':
                return $linkedin;
            case 'twitter':
                return $twitter;
        }
    };
    $scope.connectToogle = function(event, name){
        var socialService = getSocialServiceByName(name);
        if(socialService.isConnected()){
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title($translate.instant('connect.disconnect.confirmation.title'))
                .content($translate.instant('connect.disconnect.confirmation.content', {
                    name: $translate.instant('connect.label.' + name)
                }))
                .ariaLabel($translate.instant('connect.disconnect.confirmation.title'))
                .ok($translate.instant('connect.disconnect.confirmation.ok'))
                .cancel($translate.instant('connect.disconnect.confirmation.cancel'))
                .targetEvent(event);
            $mdDialog.show(confirm).then(function() {
                socialService.disconnect()
            });
        }else{
            socialService.connect().then(function(){

            });
        }
    };

    $scope.isConnected = function(name){
      return getSocialServiceByName(name).isConnected();
    };

    $scope.isNotImplemented = function(name){
        return !getSocialServiceByName(name).isImplemented();
    };

});