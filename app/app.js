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