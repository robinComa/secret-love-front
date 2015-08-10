angular.module('app').service('GooglePlusAdapter', function(FriendModel){

    var adaptToModel = function(dto){
        return new FriendModel(null, dto.displayName, dto.image.url, 'googlePlus');
    };

    this.adaptToModels = function(dto){
        return dto && dto.data && dto.data.items ? dto.data.items.map(adaptToModel) : [];
    };

});