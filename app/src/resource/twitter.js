angular.module('app').factory('Twitter', function(settings, $resource){
    return $resource(settings.endpoint + 'twitter/friends');
});