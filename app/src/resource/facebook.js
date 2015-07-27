angular.module('app').factory('Facebook', function(settings, $resource){
    return $resource(settings.endpoint + 'facebook/friends');
});