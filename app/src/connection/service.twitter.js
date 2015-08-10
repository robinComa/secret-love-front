angular.module('app').factory('$twitter', function($connection) {
    return new $connection({
        name: 'twitter',
        isImplemented: false,
        sendTokenRequest: function(){
            throw 'Not Implemented';
        },
        sendConnectionClose: function(){
            throw 'Not Implemented';
        },
        getFriends: function(token){
            throw 'Not Implemented';
        }
    });
});