'use strict';

angular.module('app').factory('twitter', function(Connection) {
    return new Connection({
        name: 'twitter',
        isImplemented: false,
        sendTokenRequest: function(){
            throw 'Not Implemented';
        },
        sendConnectionClose: function(){
            throw 'Not Implemented';
        },
        getFriends: function(){
            throw 'Not Implemented';
        }
    });
});

/**
 var adaptToModel = function(dto){
        return new FriendModel(null, dto.username + ' (' + dto.full_name + ')', dto.profile_picture, 'twitter');
    };

 this.adaptToModels = function(dto){
        return dto && dto.data && dto.data.data ? dto.data.data.map(adaptToModel) : [];
    };

 */