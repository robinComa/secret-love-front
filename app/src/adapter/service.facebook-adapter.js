angular.module('app').service('FacebookAdapter', function(FriendModel){

    var adaptToModel = function(dto){
        return new FriendModel(null, dto.displayName, dto.image.url, 'facebook');
    };

    this.adaptToModels = function(dto){
        console.log(dto.data)
        return dto && dto.data && dto.data.items ? dto.data.items.map(adaptToModel) : [];
    };

    this.adaptToDto = function(dto){

    };

});