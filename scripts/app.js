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

    $httpBackend.whenGET(new RegExp(settings.endpoint + 'users$')).respond(GetJsonFile.synchronously('stub/user/GET.json'));
    $httpBackend.whenPOST(new RegExp(settings.endpoint + 'users$')).respond(200);

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
    endpoint: 'rest-api/'
});
angular.module('app').factory('User', function(settings, $resource){
    return $resource(settings.endpoint + 'users/:id');
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
angular.module('app').controller('HomeCtrl', function($scope, $interval){

    var duration = 2000;

    var iconList = [{
        icon: 'twitter',
        color: '#1AB2E8'
    },{
        icon: 'google-plus',
        color: '#DA4835'
    },{
        icon: 'facebook',
        color: '#3B5998'
    },{
        icon: 'linkedin',
        color: '#0177B5'
    },{
        icon: 'photo_camera',
        color: 'brown'
    }];

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
angular.module('app').controller('FriendsCtrl', function($scope, $timeout, User){

    $scope.users = User.query();

    var icons = {
        LOVE : 'favorite',
        NOT_LOVE : 'favorite_outline',
        SYNC : 'sync',
        SYNC_PROBLEM: 'sync_problem'
    };

    $scope.toogleLove = function(user){

        var userCopy = angular.copy(user);
        userCopy.love = !userCopy.love;
        user.love = null;

        userCopy.$save().then(function(){
            user.love = userCopy.love;
        }).catch(function(){
            user.love = undefined;
            $timeout(function(){
                user.love = !userCopy.love;
            }, 3000);
        });
    };

    $scope.getLoveIcon = function(user){
        if(user.love === true){
            return icons.LOVE;
        }else if(user.love === false){
            return icons.NOT_LOVE;
        }else if(user.love === null){
            return icons.SYNC;
        }else if(user.love === undefined){
            return icons.SYNC_PROBLEM;
        }
    };

});
angular.module('app').controller('ConnectCtrl', function($scope){

});