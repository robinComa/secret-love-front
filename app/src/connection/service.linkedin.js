'use strict';

angular.module('app').factory('$linkedIn', function(Connection, $http) {

    return new Connection({
        name: 'linkedin',
        isImplemented: false,
        sendTokenRequest: function(){
            throw 'Not Implemented';
        },
        sendConnectionClose: function(){
            throw 'Not Implemented';
        },
        getFriends: function(token){
            return $http.jsonp('https://api.linkedin.com/v1/people/~:(num-connections)', {
                params: {
                    format: 'jsonp',
                    oauth2_access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            });
        }
    });

});

/**
 *
 *
 *
 *  var adaptToModel = function(dto){
        return new FriendModel(dto.id, dto.firstName + ' ' + dto.lastName, dto.pictureUrl, 'linkedin');
    };

 this.adaptToModels = function(dto){
        if(dto && dto.data && dto.data.numConnections){
            var models = [];
            for(var i = 0; i < dto.data.numConnections; i++){
                models.push(adaptToModel({
                    id: i,
                    firstName: 'Fake First Name',
                    lastName: i,
                    pictureUrl: 'https://media.licdn.com/mpr/mprx/0_io443xgIdsvMEmnciSRb3pp6IjA9oDnc3e2b3j0zqUL6zWTB72Hq7gwRLrldWoBRGdV6asDHmXt1'
                }));
            }
            return models;
        }else{
            return [];
        }
    };

angular.module('app').provider('$linkedin', function(settings){

    var getUriCode = function(hash){
        var reg = hash.match(/code=(.*)&state/);
        return reg && reg[1] ? reg[1] : null;
    };

    var code = getUriCode(window.location.href);

    if(code){
        window.localStorage.setItem('access_code_linkedin', code);
    }
    code = window.localStorage.getItem('access_code_linkedin');

    var token = window.localStorage.getItem('access_token_linkedin');

    this.$get = function($q, $http){

        return {
        getToken: function(){
                var deferred = $q.defer();
                if(token){
                    deferred.resolve(token);
                }else if(code){
                    $http.get('https://www.linkedin.com/uas/oauth2/accessToken', {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        params: {
                            grant_type: 'authorization_code',
                            code: code,
                            redirect_uri: settings.socials.linkedin.auth.redirectUri,
                            client_id: settings.socials.linkedin.auth.clientId,
                            client_secret: settings.socials.linkedin.auth.clientSecret
                        }
                    }).then(function(resp){
                        token = resp.data.access_token;
                        window.localStorage.setItem('access_token_linkedin', token);
                        deferred.resolve(token);
                    });
                }
                return deferred.promise;
            },
            connect: function(){
                if(code){
                    return $q.when(code);
                }else{
                    var url = 'https://www.linkedin.com/uas/oauth2/authorization';
                    url += '?client_id=' + settings.socials.linkedin.auth.clientId;
                    url += '&redirect_uri=' + settings.socials.linkedin.auth.redirectUri;
                    url += '&response_type=code';
                    url += '&state=abcde';
                    url += '&scope=' + settings.socials.linkedin.auth.scope.join(' ');
                    window.location = url;
                    return $q.when();
                }
            }
        };

    };

});
 */