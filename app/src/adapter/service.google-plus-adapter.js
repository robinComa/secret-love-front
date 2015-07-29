angular.module('app').service('GooglePlusAdapter', function(FriendModel){

    var adaptToModel = function(dto){
        return new FriendModel(null, dto.displayName, dto.image.url, 'googlePlus');
    };

    this.adaptToModels = function(dto){
        return dto.items ? dto.items.map(adaptToModel) : [];
    };

    this.adaptToDto = function(dto){

    };

});