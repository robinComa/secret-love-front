angular.module('app').factory('FriendModel', function(settings){

    return function(id, name, image, type){
        this.id = id;
        this.name = name;
        this.image = image;
        this.$social = {
            icon: settings.socials[type].icon
        };
        this.love = false;
    };

});