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

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('main', {
            abstract: true,
            url: "",
            templateUrl: "src/main.html"
        })
        .state('home', {
            parent: 'main',
            url: "/",
            views: {
                sidenav: {
                    templateUrl: "src/sidenav/view.html",
                    controller: 'SidenavCtrl'
                },
                content: {
                    templateUrl: "src/content/home/view.html",
                    controller: 'HomeCtrl'
                }
            }
        }).state('friends', {
            parent: 'main',
            url: "/friends",
            views: {
                sidenav: {
                    templateUrl: "src/sidenav/view.html",
                    controller: 'SidenavCtrl'
                },
                content: {
                    templateUrl: "src/content/friends/view.html",
                    controller: 'FriendsCtrl'
                }
            }
        }).state('connect', {
            parent: 'main',
            url: "/connect",
            views: {
                sidenav: {
                    templateUrl: "src/sidenav/view.html",
                    controller: 'SidenavCtrl'
                },
                content: {
                    templateUrl: "src/content/connect/view.html",
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

    $httpBackend.whenGET(new RegExp(settings.endpoint + 'socials$')).respond(GetJsonFile.synchronously('stub/social/GET.json'));

    $httpBackend.whenGET(new RegExp(settings.endpoint + 'facebook/friends$')).respond(GetJsonFile.synchronously('stub/facebook/GET.json'));
    $httpBackend.whenGET(new RegExp(settings.endpoint + 'google-plus/friends$')).respond(GetJsonFile.synchronously('stub/google-plus/GET.json'));
    $httpBackend.whenGET(new RegExp(settings.endpoint + 'instagram/friends$')).respond(GetJsonFile.synchronously('stub/instagram/GET.json'));
    $httpBackend.whenGET(new RegExp(settings.endpoint + 'twitter/friends$')).respond(GetJsonFile.synchronously('stub/twitter/GET.json'));
    $httpBackend.whenGET(new RegExp(settings.endpoint + 'linkedin/friends$')).respond(GetJsonFile.synchronously('stub/linkedin/GET.json'));
    $httpBackend.whenPOST(new RegExp(settings.endpoint + 'friends$')).respond(200);

    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
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
        google: {
            clientId: '631974897480',
            apiKey: 'AIzaSyBaMms2VMIOPYxh2hoAjnbKEHxY-bWC8mc',
            scope: 'https://www.googleapis.com/auth/plus.me'
        }
    }
});
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
angular.module('app').factory('Facebook', function(settings, $resource){
    return $resource(settings.endpoint + 'facebook/friends');
});
angular.module('app').factory('GooglePlus', function($q, $google){

    return {
        query: function(){
            var deferred = $q.defer();

            $google.connect().then(function(){
                gapi.client.load('plus', 'v1', function() {
                    var request = gapi.client.plus.people.list({
                        'userId' : 'me',
                        'collection' : 'visible'
                    });
                    request.execute(function(resp) {
                        deferred.resolve(resp);
                    });
                });
            }, deferred.reject);

            return deferred.promise;
        }
    };
});
angular.module('app').factory('Instagram', function(settings, $resource){
    return $resource(settings.endpoint + 'instagram/friends');
});
angular.module('app').factory('LinkedIn', function(settings, $resource){
    return $resource(settings.endpoint + 'linkedin/friends');
});
angular.module('app').factory('Twitter', function(settings, $resource){
    return $resource(settings.endpoint + 'twitter/friends');
});
angular.module('app').factory('Friend', function(settings, $q, Twitter, GooglePlus, Facebook, LinkedIn, Instagram, GooglePlusAdapter){
    return {
        query: function(){
            var deferred = $q.defer();

            var twitterDeffered = Twitter.query().$promise;
            var googleplusDeffered = GooglePlus.query();
            var facebookDeffered = Facebook.query().$promise;
            var linkedinDeffered = LinkedIn.query().$promise;
            var instagramDeffered = Instagram.query().$promise;

            twitterDeffered.then(function(friend){
                deferred.notify(friend);
            });
            googleplusDeffered.then(function(friend){
                deferred.notify(GooglePlusAdapter.adaptToModels(friend));
            });
            facebookDeffered.then(function(friend){
                deferred.notify(friend);
            });
            linkedinDeffered.then(function(friend){
                deferred.notify(friend);
            });
            instagramDeffered.then(function(friend){
                deferred.notify(friend);
            });

            $q.all([twitterDeffered, googleplusDeffered, facebookDeffered, linkedinDeffered, instagramDeffered]).then(function(){
                deferred.resolve();
            });

            return deferred.promise;
        }
    };
});
angular.module('app').factory('Social', function(settings, $resource){
    return $resource(settings.endpoint + 'socials/:id');
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
angular.module('app').controller('HomeCtrl', function($scope, $interval, Social){

    Social.query().$promise.then(function(iconList){

        var duration = 2000;
        var i = 0;

        $scope.selectedIcon = iconList[i];

        $interval(function(){
            $scope.selectedIcon = iconList[i % iconList.length];
            i++;
        }, duration);

        $scope.option = {
            rotation: 'none',
            duration: duration,
            easing : 'sine-out'
        };
    });
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
angular.module('app').controller('ConnectCtrl', function($scope, Social, $google){

    Social.query().$promise.then(function(socials){
        $scope.connections = socials;
    });

    $scope.connect = function(){
        $google.connect().then(function(){

        });
    };

});
angular.module('app').provider('$google', function(settings){

    var isApiloaded = false;
    var isConnected = false;

    window.handleClientLoad = function(){
        gapi.client.setApiKey(settings.socials.google.apiKey);
        isApiloaded = true;
    };

    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client.js?onload=handleClientLoad';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    this.$get = function($q, $interval){

        var authorize = function(){
            var deferred = $q.defer();
            gapi.auth.authorize({
                client_id: settings.socials.google.clientId,
                scope: settings.socials.google.scope,
                immediate: false
            },function(authResult) {
                if (authResult['error'] === undefined){
                    gapi.auth.setToken(authResult);
                    isConnected = true;
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        };

        return {
            connect: function(){
                var deferred = $q.defer();
                var interval = $interval(function(){
                    if(isApiloaded){
                        if(isConnected){
                            deferred.resolve();
                        }else{
                            authorize().then(deferred.resolve, deferred.reject);
                        }
                        $interval.cancel(interval);
                    }
                }, 100);
                return deferred.promise;
            }
        };

    };

});