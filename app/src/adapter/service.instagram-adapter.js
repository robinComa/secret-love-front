angular.module('app').service('InstagramAdapter', function(FriendModel){

    var adaptToModel = function(dto){
        return new FriendModel(null, dto.username + ' (' + dto.full_name + ')', dto.profile_picture, 'instagram');
    };

    this.adaptToModels = function(dto){
        return dto.data.data ? dto.data.data.map(adaptToModel) : [];
    };

    this.adaptToDto = function(dto){

    };

});