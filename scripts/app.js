angular.module('app', [
    'ngResource',
    'pascalprecht.translate',
    'ui.router',
    'ngAria',
    'ngAnimate',
    'ngMaterial',
    'ngMdIcons'
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

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('main', {
            abstract: true,
            url: '',
            templateUrl: 'src/main/main.html'
        })
        .state('home', {
            parent: 'main',
            url: '/',
            views: {
                sidenav: {
                    templateUrl: 'src/main/sidenav/view.html',
                    controller: 'SidenavCtrl'
                },
                content: {
                    templateUrl: 'src/main/content/home/view.html',
                    controller: 'HomeCtrl'
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
        });

}).run(function($translatePartialLoader, $translate, $rootScope, $mdSidenav, $timeout){

    $translatePartialLoader.addPart('common');
    $translatePartialLoader.addPart('sidenav');
    $translatePartialLoader.addPart('home');
    $translatePartialLoader.addPart('friends');
    $translatePartialLoader.addPart('connect');

    $timeout(function(){
        $translate.refresh();
    },1);

    $rootScope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

});
angular.module('appStub', [
    'app',
    'ngMockE2E'
]).config(function($httpProvider){

    $httpProvider.interceptors.push('HttpStubInterceptor');

}).run(function(settings, $httpBackend, GetJsonFile){

    $httpBackend.whenGET(new RegExp(settings.endpoint + 'facebook/friends$')).respond(GetJsonFile.synchronously('stub/facebook/GET.json'));
    $httpBackend.whenGET(new RegExp(settings.endpoint + 'twitter/friends$')).respond(GetJsonFile.synchronously('stub/twitter/GET.json'));
    $httpBackend.whenGET(new RegExp(settings.endpoint + 'linkedin/friends$')).respond(GetJsonFile.synchronously('stub/linkedin/GET.json'));

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
angular.module('app').constant('settings', {
    endpoint: 'rest-api/',
    socials: {
        googlePlus: {
            label: 'connect.label.google-plus',
            auth: {
                clientId: '631974897480.apps.googleusercontent.com',
                redirectUri: window.location.origin + '/find-me/',
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
                clientId: '5031270ba8a0440dbf50c0c78f201f1f',
                redirectUri: window.location.origin + '/find-me/',
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

            },
            icon: {
                name: 'twitter',
                color: '#1AB2E8'
            }
        },
        facebook: {
            label: 'connect.label.facebook',
            auth: {
                clientId: '463627307038698',
                redirectUri: window.location.origin + '/find-me/#/friends',
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

            },
            icon: {
                name: 'linkedin',
                color: '#0177B5'
            }
        }
    }
});
angular.module('app').factory('FriendModel', function(settings){

    return function(id, name, image, type){
        this.id = id;
        this.name = name;
        this.image = image;
        this.social = {
            icon: settings.socials[type].icon
        };
        this.love = false;
    };

});
angular.module('app').service('GooglePlusAdapter', function(FriendModel){

    var adaptToModel = function(dto){
        return new FriendModel(null, dto.displayName, dto.image.url, 'googlePlus');
    };

    this.adaptToModels = function(dto){
        return dto && dto.data && dto.data.items ? dto.data.items.map(adaptToModel) : [];
    };

    this.adaptToDto = function(dto){

    };

});
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
angular.module('app').factory('Facebook', function(settings, $http, $facebook){

    return {
        query: function(){
            return $facebook.getToken().then(function(token){
                return $http.jsonp('https://graph.facebook.com/v2.4/me/friends', {
                    params: {
                        access_token: token,
                        callback: 'JSON_CALLBACK'
                    }
                });
            });
        }
    };
});
angular.module('app').factory('GooglePlus', function($google, $http){

    return {
        query: function(){
            return $google.getToken().then(function(token){
                return $http.jsonp('https://www.googleapis.com/plus/v1/people/me/people/visible', {
                    params: {
                        access_token: token,
                        callback: 'JSON_CALLBACK'
                    }
                });
            });
        }
    };
});
angular.module('app').factory('Instagram', function($http, $instagram){

    return {
        query: function(){
            return $instagram.getToken().then(function(token){
                return $http.jsonp('https://api.instagram.com/v1/users/self/follows', {
                    params: {
                        access_token: token,
                        callback: 'JSON_CALLBACK'
                    }
                });
            });
        }
    };
});
angular.module('app').factory('LinkedIn', function(settings, $resource){
    return $resource(settings.endpoint + 'linkedin/friends');
});
angular.module('app').factory('Twitter', function(settings, $resource){
    return $resource(settings.endpoint + 'twitter/friends');
});
angular.module('app').factory('Friend', function(settings, $q, Twitter, GooglePlus, Facebook, LinkedIn, Instagram, GooglePlusAdapter, InstagramAdapter, FacebookAdapter){
    return {
        query: function(){
            var deferred = $q.defer();

            var twitterDeffered = Twitter.query().$promise;
            var googleplusDeffered = GooglePlus.query();
            var facebookDeffered = Facebook.query();
            var linkedinDeffered = LinkedIn.query().$promise;
            var instagramDeffered = Instagram.query();

            twitterDeffered.then(function(friend){
                deferred.notify(friend);
            });
            googleplusDeffered.then(function(friend){
                deferred.notify(GooglePlusAdapter.adaptToModels(friend));
            });
            facebookDeffered.then(function(friend){
                deferred.notify(FacebookAdapter.adaptToModels(friend));
            });
            linkedinDeffered.then(function(friend){
                deferred.notify(friend);
            });
            instagramDeffered.then(function(friend){
                deferred.notify(InstagramAdapter.adaptToModels(friend));
            });

            $q.all([twitterDeffered, googleplusDeffered, facebookDeffered, linkedinDeffered, instagramDeffered]).then(function(){
                deferred.resolve();
            });

            return deferred.promise;
        }
    };
});
angular.module('app').controller('SidenavCtrl', function($scope){

    $scope.entries = [{
        uiSref: 'home',
        label: 'sidenav.entry.label.home',
        icon: 'home'
    },{
        uiSref: 'friends',
        label: 'sidenav.entry.label.friends',
        icon: 'group'
    },{
        uiSref: 'connect',
        label: 'sidenav.entry.label.connect',
        icon: 'apps'
    }];

});
angular.module('app').controller('HomeCtrl', function($scope, $interval, settings){

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
angular.module('app').controller('FriendsCtrl', function($scope, $timeout, Friend){

    $scope.friends = [];
    Friend.query().then(function(){
        console.log('All friends loaded');
    }, function(error){
        console.log('error');
    }, function(friends){
        $scope.friends = $scope.friends.concat(friends);
    });

    var icons = {
        LOVE : 'favorite',
        NOT_LOVE : 'favorite_outline',
        SYNC : 'sync',
        SYNC_PROBLEM: 'sync_problem'
    };

    $scope.toogleLove = function(friend){

        var friendCopy = angular.copy(friend);
        friendCopy.love = !friendCopy.love;
        friend.love = null;

        friendCopy.$save().then(function(){
            friend.love = friendCopy.love;
        }).catch(function(){
            friend.love = undefined;
            $timeout(function(){
                friend.love = !friendCopy.love;
            }, 3000);
        });
    };

    $scope.getLoveIcon = function(friend){
        if(friend.love === true){
            return icons.LOVE;
        }else if(friend.love === false){
            return icons.NOT_LOVE;
        }else if(friend.love === null){
            return icons.SYNC;
        }else if(friend.love === undefined){
            return icons.SYNC_PROBLEM;
        }
    };

});
angular.module('app').controller('ConnectCtrl', function($scope, settings, $google, $instagram, $facebook){

    $scope.connections = settings.socials;

    $scope.connect = function(type){
        switch (type){
            case 'googlePlus':
                $google.connect().then(function(){

                });
                break;
            case 'instagram':
                $instagram.connect().then(function(){

                });
                break;
            case 'facebook':
                $facebook.connect().then(function(){

                });
                break;
        }


    };

});
angular.module('app').provider('$google', function(settings){

    var getUriToken = function(hash){
        var reg = hash.match(/&access_token=([^&]+)/);
        return reg && reg[1] ? reg[1] : null;
    };

    var token = getUriToken(window.location.hash);

    if(token){
        window.localStorage.setItem('access_token_google', token);
    }
    token = window.localStorage.getItem('access_token_google');

    this.$get = function($q){

        return {
            getToken: function(){
                return $q.when(token);
            },
            connect: function(){
                if(token){
                    return $q.when(token);
                }else{
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
                }
            }
        };

    };

});
angular.module('app').provider('$instagram', function(settings){

    var getUriToken = function(hash){
        var reg = hash.match(/#access_token=([^&]+)/);
        return reg && reg[1] ? reg[1] : null;
    };

    var token = getUriToken(window.location.hash);
    if(token){
        window.localStorage.setItem('access_token_instagram', token);
    }
    token = window.localStorage.getItem('access_token_instagram');

    this.$get = function($q){

        return {
            getToken: function(){
                return $q.when(token);
            },
            connect: function(){
                if(token){
                    return $q.when(token);
                }else{
                    var url = 'https://instagram.com/oauth/authorize/';
                    url += '?client_id=' + settings.socials.instagram.auth.clientId;
                    url += '&redirect_uri=' + settings.socials.instagram.auth.redirectUri;
                    url += '&response_type=token';
                    url += '&scope=' + settings.socials.instagram.auth.scope.join('+');
                    window.location = url;
                    return $q.when();
                }
            }
        };

    };

});
angular.module('app').provider('$facebook', function(settings){

    var getUriToken = function(hash){
        var reg = hash.match(/code=([^#]+)/);
        return reg && reg[1] ? reg[1].replace(/[^A-Za-z]/g, '') : null;
    };
    var token = getUriToken(window.location.href);
    console.log(window.location.href)
    if(token){
        window.localStorage.setItem('access_token_facebook', token);
    }
    token = window.localStorage.getItem('access_token_facebook');

    this.$get = function($q){

        return {
            getToken: function(){
                return $q.when(token);
            },
            connect: function(){
                if(token){
                    return $q.when(token);
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

});