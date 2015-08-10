angular.module('app').service('FacebookAdapter', function(FriendModel){

    var adaptToModel = function(dto){
        return new FriendModel(dto.id, dto.name, dto.picture.data.url, 'facebook');
    };

    this.adaptToModels = function(dto){
        return dto && dto.data && dto.data.data ? dto.data.data.map(adaptToModel) : [];
    };

});