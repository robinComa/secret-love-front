angular.module('app').factory('User', function(settings, $resource){
    return $resource(settings.endpoint + 'users/:id');
});