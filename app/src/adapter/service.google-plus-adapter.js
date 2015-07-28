angular.module('app').service('GooglePlusAdapter', function(Social){

    var social;
    Social.query().$promise.then(function(socials){
        social = socials.filter(function(social){
            return social.type === 'google-plus';
        })[0];
    });

    var adaptToModel = function(dto){
        return {
            name: dto.displayName,
            social: social,
            image: dto.image.url,
            love: false             //TODO DB input for adapter
        };
    };

    this.adaptToModels = function(dto){
        return dto.items.map(adaptToModel);
    };

    this.adaptToDto = function(dto){

    };

});