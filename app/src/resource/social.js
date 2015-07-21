angular.module('app').factory('Social', function(settings, $resource){
    return $resource(settings.endpoint + 'socials/:id');
});