angular.module('app').factory('Twitter', function($twitter){
    return {
        query: function(){
            return $twitter.getToken().then(function(token){
                //console.log(token)
            });
        }
    };});