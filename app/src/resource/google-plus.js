angular.module('app').factory('GooglePlus', function(settings, $resource){
    return $resource(settings.endpoint + 'google-plus/friends');
});