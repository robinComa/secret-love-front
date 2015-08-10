angular.module('app').service('TwitterAdapter', function(FriendModel){

    var adaptToModel = function(dto){
        return new FriendModel(null, dto.username + ' (' + dto.full_name + ')', dto.profile_picture, 'twitter');
    };

    this.adaptToModels = function(dto){
        return dto && dto.data && dto.data.data ? dto.data.data.map(adaptToModel) : [];
    };

});