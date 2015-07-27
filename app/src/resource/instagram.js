angular.module('app').factory('Instagram', function(settings, $resource){
    return $resource(settings.endpoint + 'instagram/friends');
});