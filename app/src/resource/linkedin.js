angular.module('app').factory('LinkedIn', function(settings, $resource){
    return $resource(settings.endpoint + 'linkedin/friends');
});