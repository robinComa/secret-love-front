angular.module('app').factory('GooglePlus', function($q, $google){

    return {
        query: function(){
            var deferred = $q.defer();

            $google.getToken().then(function(){
                gapi.client.load('plus', 'v1', function() {
                    var request = gapi.client.plus.people.list({
                        'userId' : 'me',
                        'collection' : 'visible'
                    });
                    request.execute(function(resp) {
                        deferred.resolve(resp);
                    });
                });
            }, deferred.reject);

            return deferred.promise;
        }
    };
});