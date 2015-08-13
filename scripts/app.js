'use strict';

angular.module('app', [
    'ngResource',
    'pascalprecht.translate',
    'ui.router',
    'ngAria',
    'ngAnimate',
    'ngMaterial',
    'ngMdIcons',
    'ngMessages'
]).config(function($translateProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider){

    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'i18n/{lang}/{part}.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.cloakClassName('hidden');
    $translateProvider.useSanitizeValueStrategy(null);

    $mdThemingProvider.theme('default')
        .primaryPalette('pink')
        .accentPalette('indigo');

    $mdThemingProvider.alwaysWatchTheme(true);

    $urlRouterProvider.otherwise('/friends');

    $stateProvider
        .state('main', {
            abstract: true,
            url: '',
            templateUrl: 'src/main/main.html',
            controller: 'MainCtrl',
            resolve: {
                me: function(Me){
                    return Me.get().$promise;
                }
            }
        }).state('friends', {
            parent: 'main',
            url: '/friends',
            views: {
                sidenav: {
                    templateUrl: 'src/main/sidenav/view.html',
                    controller: 'SidenavCtrl'
                },
                content: {
                    templateUrl: 'src/main/content/friends/view.html',
                    controller: 'FriendsCtrl'
                }
            }
        }).state('connect', {
            parent: 'main',
            url: '/connect',
            views: {
                sidenav: {
                    templateUrl: 'src/main/sidenav/view.html',
                    controller: 'SidenavCtrl'
                },
                content: {
                    templateUrl: 'src/main/content/connect/view.html',
                    controller: 'ConnectCtrl'
                }
            }
        }).state('settings', {
            parent: 'main',
            url: '/settings',
            views: {
                sidenav: {
                    templateUrl: 'src/main/sidenav/view.html',
                    controller: 'SidenavCtrl'
                },
                content: {
                    templateUrl: 'src/main/content/settings/view.html',
                    controller: 'SettingsCtrl'
                }
            }
        });

}).run(function($translatePartialLoader, $translate, $rootScope, $mdSidenav, $timeout){

    $translatePartialLoader.addPart('common');
    $translatePartialLoader.addPart('sidenav');
    $translatePartialLoader.addPart('friends');
    $translatePartialLoader.addPart('connect');
    $translatePartialLoader.addPart('settings');

    $timeout(function(){
        $translate.refresh();
    },1);

});
'use strict';

angular.module('appStub', [
    'app',
    'ngMockE2E'
]).config(function($httpProvider){

    $httpProvider.interceptors.push('HttpStubInterceptor');

}).run(function($httpBackend, GetJsonFile){

    $httpBackend.whenGET(/me$/).respond(GetJsonFile.synchronously('stub/me/GET-x.json'));
    $httpBackend.whenPOST(/me$/).respond(200);

    $httpBackend.whenGET(/friends$/).respond(GetJsonFile.synchronously('stub/friends/GET.json'));
    $httpBackend.whenPOST(/friends$/).respond(200);

    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenJSONP(/.*/).passThrough();
});

angular.module('appStub').service('HttpStubInterceptor', function($q, $timeout){
    var getMockedAsyncRespondTime = function (url) {
        switch (url.split(/\./).pop()) {
            case 'json':
                return 300;
            case 'html':
                // In production all views are into cachedUrl as JS Templates
                return 0;
            default:
                // Web Services
                return 800;
        }
    };
    return {
        response: function (response) {
            var defer = $q.defer();
            $timeout(function () {
                defer.resolve(response);
            }, getMockedAsyncRespondTime(response.config.url.toString()));
            return defer.promise;
        }
    };
});

angular.module('appStub').service('GetJsonFile', function(){
    this.synchronously = function(url){
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        return request.response;
    };
});
'use strict';

(function(){
    var origin = window.location.href.split(window.location.hash)[0];

    angular.module('app').constant('settings', {
        endpoint: 'rest-api/',
        socials: {
            googlePlus: {
                label: 'connect.label.google-plus',
                auth: {
                    patternURI: /&access_token=([^&]+)/,
                    clientId: '631974897480.apps.googleusercontent.com',
                    redirectUri: origin,
                    scope: ['profile']
                },
                icon: {
                    name: 'google-plus',
                    color: '#DA4835'
                }
            },
            instagram: {
                label: 'connect.label.instagram',
                auth: {
                    patternURI: /#access_token=([^&]+)/,
                    clientId: '5031270ba8a0440dbf50c0c78f201f1f',
                    redirectUri: origin,
                    scope: ['basic']
                },
                icon: {
                    name: 'photo_camera',
                    color: 'brown'
                }
            },
            twitter: {
                label: 'connect.label.twitter',
                auth: {
                    patternURI: /^#access_token_unknow=([^&]+)/,
                    clientId: 'r9e5QZVVUIu3ChTXr1w08fm5T',
                    redirectUri: origin + '#/friends',
                    scope: ['user_friends']
                },
                icon: {
                    name: 'twitter',
                    color: '#1AB2E8'
                }
            },
            facebook: {
                label: 'connect.label.facebook',
                auth: {
                    patternURI: /\?code=([^&]*)#/,
                    clientId: '463627307038698',
                    clientSecret: 'c300b7e8922bfaeb84a84ca01e32245d',
                    redirectUri: origin,
                    scope: ['user_friends']
                },
                icon: {
                    name: 'facebook',
                    color: '#3B5998'
                }
            },
            linkedin: {
                label: 'connect.label.linkedin',
                auth: {
                    patternURI: /code=(.*)&state/,
                    clientId: '77bmx0zg9stbsk',
                    clientSecret: 'aryHtzhM2yc9aXeS',
                    redirectUri: origin,
                    scope: ['r_basicprofile']
                },
                icon: {
                    name: 'linkedin',
                    color: '#0177B5'
                }
            }
        }
    });
})();
'use strict';

angular.module('app').factory('Me', function(settings, $resource){

    return $resource(settings.endpoint + 'me');

});
'use strict';

angular.module('app').factory('Friend', function(settings, $q, $resource, $injector, $http){

    var Friend = $resource(settings.endpoint + 'friends');

    Friend.query = function(){
        var deferred = $q.defer();

        $http.get(settings.endpoint + 'friends').then(function(response){
            var loveFriends = response.data;

            var promises = [];

            var areInLove = function(loveFriends, friend){
                return loveFriends.some(function(loveFriend){
                    return angular.equals(loveFriend, friend);
                });
            };

            angular.forEach(settings.socials, function(social, name){
                var socialService = $injector.get(name);
                var promise = socialService.getFriends();
                promise.then(function(friends){
                    deferred.notify(friends.map(function(friend){
                        friend.love = areInLove(loveFriends, friend);
                        return friend;
                    }));
                });
                promises.push(promise);
            });

            $q.all(promises).then(function(friends){
                deferred.resolve(friends.reduce(function(previous, current){
                    return previous.concat(current);
                }));
            });
        });

        return deferred.promise;
    };

    return Friend;
});
'use strict';

angular.module('app').provider('Connection', function(settings){

    var STORAGE_ITEM_TOKEN_NAME_PREFIX = 'access_token_';

    var findPatternInURI = function(pattern){
        var reg = window.location.href.match(pattern);
        return reg && reg[1] ? reg[1] : null;
    };

    for(var i in settings.socials){
        var hash = findPatternInURI(settings.socials[i].auth.patternURI);
        if(hash){
            localStorage.setItem(STORAGE_ITEM_TOKEN_NAME_PREFIX + i, hash);
            break;
        }
    }

    this.$get = function($q){
      return function(args){

          var STORAGE_ITEM_TOKEN_NAME = STORAGE_ITEM_TOKEN_NAME_PREFIX + args.name;

          this.getToken = function(){
            var deferred = $q.defer();
            var token = localStorage.getItem(STORAGE_ITEM_TOKEN_NAME);
            if(token){
                deferred.resolve(token);
            }else{
                args.sendTokenRequest();
                deferred.reject(token);
            }
            return deferred.promise;
          };

          this.close = function(){
              var deferred = $q.defer();
              args.sendConnectionClose().then(function(){
                  localStorage.removeItem(STORAGE_ITEM_TOKEN_NAME);
                  deferred.resolve();
              }, deferred.reject);
              return deferred.promise;
          };

          this.isConnected = function(){
              return window.localStorage.getItem(STORAGE_ITEM_TOKEN_NAME) !== null;
          };

          this.isImplemented = function(){
              return args.isImplemented;
          };

          this.getFriends = function(){
              return $q.when(this.isConnected()? args.getFriends(window.localStorage.getItem(STORAGE_ITEM_TOKEN_NAME), this.getToken, this.close) : []);
          };

      };
    };


});
'use strict';

angular.module('app').factory('googlePlus', function(settings, Connection, $http, $q, Friend) {

    var LIMIT_TOKEN_STATUS = 401;
    var UNAUTH_STATUS = 403;

    var connection =  new Connection({
        name: 'googlePlus',
        isImplemented: true,
        sendTokenRequest: function(){
            var url = 'https://accounts.google.com/o/oauth2/auth';
            url += '?client_id=' + settings.socials.googlePlus.auth.clientId;
            url += '&redirect_uri=' + settings.socials.googlePlus.auth.redirectUri;
            url += '&response_type=token';
            url += '&state=security_token';
            url += '&approval_prompt=force';
            url += '&include_granted_scopes=true';
            url += '&scope=' + settings.socials.googlePlus.auth.scope.join(' ');
            window.location = url;
            return $q.when();
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(token, getNewToken, close){
            var deferred = $q.defer();
            $http.jsonp('https://www.googleapis.com/plus/v1/people/me/people/visible', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                if(response.data.error && (response.data.error.code === LIMIT_TOKEN_STATUS || response.data.error.code === UNAUTH_STATUS)){
                    close().then(function(){
                        getNewToken().then(function(){
                            deferred.reject(response.data.error.message);
                        }, deferred.reject);
                    });
                }else{
                    deferred.resolve(response.data.items.map(function(friend){
                        return new Friend({
                            id: null,
                            name: friend.displayName,
                            picture: friend.image.url,
                            type: 'googlePlus'
                        });
                    }));
                }
            }, deferred.reject);
            return deferred.promise;
        }
    });

    return connection;

});
'use strict';

angular.module('app').factory('instagram', function(settings, Connection, $q, $http, Friend){

    var LIMIT_TOKEN_STATUS = 429;
    var INVALID_TOKEN_STATUS = 400;

    var connection =  new Connection({
        name: 'instagram',
        isImplemented: true,
        sendTokenRequest: function(){
            var url = 'https://instagram.com/oauth/authorize/';
            url += '?client_id=' + settings.socials.instagram.auth.clientId;
            url += '&redirect_uri=' + settings.socials.instagram.auth.redirectUri;
            url += '&response_type=token';
            url += '&scope=' + settings.socials.instagram.auth.scope.join('+');
            window.location = url;
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(token, getNewToken, close){
            var deferred = $q.defer();
            $http.jsonp('https://api.instagram.com/v1/users/self/follows', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK',
                    count: 1000
                }
            }).then(function(response){
                if(response.data.meta.code === LIMIT_TOKEN_STATUS || response.data.meta.code === INVALID_TOKEN_STATUS){
                    close().then(function(){
                        getNewToken().then(function(){
                            deferred.reject(response.data.meta.error_message);
                        }, deferred.reject);
                    });
                }else{
                    deferred.resolve(response.data.data.map(function(friend){
                        var name = friend.username;
                        if(friend.full_name){
                            name += ' (' + friend.full_name + ')';
                        }
                        return new Friend({
                            id: null,
                            name: name,
                            picture: friend.profile_picture,
                            type: 'instagram'
                        });
                    }));
                }
            }, deferred.reject);
            return deferred.promise;
        }
    });

    return connection;

});
'use strict';

angular.module('app').factory('facebook', function(Connection, $http) {

    return new Connection({
        name: 'facebook',
        isImplemented: false,
        sendTokenRequest: function(){
            throw 'Not Implemented';
        },
        sendConnectionClose: function(){
            throw 'Not Implemented';
        },
        getFriends: function(token){
            return $http.jsonp('https://graph.facebook.com/v2.4/me/friends?fields=id,name,picture', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            });
        }
    });

});
/**
 * var adaptToModel = function(dto){
        return new FriendModel(dto.id, dto.name, dto.picture.data.url, 'facebook');
    };

 this.adaptToModels = function(dto){
        return dto && dto.data && dto.data.data ? dto.data.data.map(adaptToModel) : [];
    };
 *
 *
angular.module('app').provider('$facebook', function(settings){

    var STORAGE_ITEM_CODE_NAME = 'access_code_facebook';
    var STORAGE_ITEM_TOKEN_NAME = 'access_token_facebook';

    var getUriToken = function(hash){
        var reg = hash.match(/\?code=([^&]*)#/);
        return reg && reg[1] ? reg[1] : null;
    };
    var code = getUriToken(window.location.href);

    if(code){
        window.localStorage.setItem(STORAGE_ITEM_CODE_NAME, code);
    }
    code = window.localStorage.getItem(STORAGE_ITEM_CODE_NAME);

    var token = window.localStorage.getItem(STORAGE_ITEM_TOKEN_NAME);

    this.$get = function($q, $http){

        return {
            getToken: function(){
                var deferred = $q.defer();
                if(token){
                    deferred.resolve(token);
                }else if(code){
                    $http({
                        method: 'GET',
                        url: 'https://graph.facebook.com/oauth/access_token',
                        params: {
                            code: code,
                            client_id: settings.socials.facebook.auth.clientId,
                            client_secret: settings.socials.facebook.auth.clientSecret,
                            redirect_uri: settings.socials.facebook.auth.redirectUri
                        }
                    }).then(function(resp){
                        token = resp.data.match(/access_token\=([^&]+)/)[1];
                        window.localStorage.setItem(STORAGE_ITEM_TOKEN_NAME, token);
                        window.localStorage.removeItem(STORAGE_ITEM_CODE_NAME);
                        code = null;
                        deferred.resolve(token);
                    }, deferred.reject);
                }
                return deferred.promise;
            },
            connect: function(){
                if(code){
                    return $q.when(code);
                }else{
                    var url = 'https://www.facebook.com/v2.0/dialog/oauth';
                    url += '?app_id=' + settings.socials.facebook.auth.clientId;
                    url += '&redirect_uri=' + settings.socials.facebook.auth.redirectUri;
                    url += '&scope=' + settings.socials.facebook.auth.scope.join(',');
                    window.location = url;
                    return $q.when();
                }
            }
        };

    };

});*/
'use strict';

angular.module('app').factory('linkedin', function(Connection, $http) {

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
'use strict';

angular.module('app').controller('MainCtrl', function($scope, $mdSidenav, me, $state){

    $scope.me = me;
    $scope.state = $state;

    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

});
'use strict';

angular.module('app').controller('SidenavCtrl', function(settings, $scope, $interval){

    $scope.entries = [{
        uiSref: 'friends',
        label: 'sidenav.entry.label.friends',
        icon: 'group'
    },{
        uiSref: 'connect',
        label: 'sidenav.entry.label.connect',
        icon: 'apps'
    },{
        uiSref: 'settings',
        label: 'sidenav.entry.label.settings',
        icon: 'settings_applications'
    }];

    var duration = 2000;
    var i = 0;
    var keys = Object.keys(settings.socials);

    $scope.selectedIcon = settings.socials[keys[i]].icon;

    $interval(function(){
        $scope.selectedIcon = settings.socials[keys[i % keys.length]].icon;
        i++;
    }, duration);

    $scope.option = {
        rotation: 'none',
        duration: duration,
        easing : 'sine-out'
    };

});
'use strict';

angular.module('app').controller('FriendsCtrl', function(settings, $scope, $timeout, Friend,$mdDialog){

    $scope.loading = true;

    $scope.friends = [];
    Friend.query().then(function(friends){
        $scope.loading = false;
        $scope.friends = friends;
    }, function(error){
        console.error('Friend loading error : ' + error);
    }, function(friends){
        $scope.friends = $scope.friends.concat(friends);
    });

    var icons = {
        LOVE : 'favorite',
        NOT_LOVE : 'favorite_outline',
        SYNC_PROBLEM: 'sync_problem'
    };

    $scope.toogleLove = function(friend){

        var initialLove = friend.love;

        friend.love = !initialLove;
        friend.$save().then(function(){

        }, function(){
            friend.love = undefined;
            $timeout(function(){
                friend.love = initialLove;
            }, 3000);
        });
    };

    $scope.getSocialIcon = function(social){
        return settings.socials[social].icon;
    };

    $scope.getLoveIcon = function(friend){
        if(friend.love === true){
            return icons.LOVE;
        }else if(friend.love === false){
            return icons.NOT_LOVE;
        }else if(friend.love === undefined){
            return icons.SYNC_PROBLEM;
        }
    };

    $scope.showFilter = function(ev){
        $mdDialog.show({
            controller: 'FriendsFilterCtrl',
            templateUrl: 'src/main/content/friends/filter/view.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        }).then(function(filter) {
            $scope.filter = filter;
        });
    };

});
'use strict';

angular.module('app').controller('FriendsFilterCtrl', function(settings, $scope, $mdDialog){

    $scope.socials = settings.socials;

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.submit = function(answer) {
        $mdDialog.hide(answer);
    };

});
'use strict';

angular.module('app').controller('ConnectCtrl', function($scope, settings, $translate, $mdDialog, $injector){

    $scope.connections = settings.socials;

    var disconnectAction = function(socialService, name){
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title($translate.instant('connect.disconnect.confirmation.title'))
            .content($translate.instant('connect.disconnect.confirmation.content', {
                name: $translate.instant('connect.label.' + name)
            }))
            .ariaLabel($translate.instant('connect.disconnect.confirmation.title'))
            .ok($translate.instant('connect.disconnect.confirmation.ok'))
            .cancel($translate.instant('connect.disconnect.confirmation.cancel'))
            .targetEvent(event);
        $mdDialog.show(confirm).then(function() {
            socialService.close();
        });
    };

    $scope.connectToogle = function(event, name){
        var socialService = $injector.get(name);
        if(socialService.isConnected()){
            disconnectAction(socialService, name);
        }else{
            socialService.getToken().then(function(){

            });
        }
    };

    $scope.isConnected = function(name){
      return $injector.get(name).isConnected();
    };

    $scope.isNotImplemented = function(name){
        return !$injector.get(name).isImplemented();
    };

});
'use strict';

angular.module('app').controller('SettingsCtrl', function($scope, me){

    $scope.meCopy = angular.copy(me);

    $scope.submit = function(){
        $scope.meCopy.$save().then(function(){
            me.login = $scope.meCopy.login;
            me.email = $scope.meCopy.email;
        });
    };

});