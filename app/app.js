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
]).config(function($httpProvider, LanguageProvider, $translateProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider){

    $httpProvider.defaults.withCredentials = true;

    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'i18n/{lang}/{part}.json'
    });

    $translateProvider.preferredLanguage(LanguageProvider.getPreferredLanguage());
    $translateProvider.cloakClassName('hidden');
    $translateProvider.useSanitizeValueStrategy(null);

    $mdThemingProvider.theme('default')
        .primaryPalette('pink')
        .accentPalette('indigo');

    $mdThemingProvider.alwaysWatchTheme(true);

    $urlRouterProvider.otherwise('/friends/list');

    $stateProvider
        .state('unknown', {
            abstract: true,
            url: '',
            templateUrl: 'src/unknown/view.html',
            controller: 'UnknownCtrl',
            onEnter: function(LoadApplication, $state){
                if(LoadApplication.isAppStub()){
                    $state.go('friends-list');
                }
            }
        })
        .state('auth', {
            parent: 'unknown',
            url: '/auth',
            templateUrl: 'src/unknown/auth/view.html',
            controller: 'AuthCtrl'
        })
        .state('forgot-password', {
            parent: 'unknown',
            url: '/forgot/password',
            templateUrl: 'src/unknown/auth/forgot-password/view.html',
            controller: 'ForgotPasswordCtrl'
        })
        .state('account', {
            parent: 'unknown',
            url: '/account',
            templateUrl: 'src/unknown/account/view.html',
            controller: 'AccountCtrl'
        })
        .state('main', {
            abstract: true,
            url: '',
            templateUrl: 'src/main/main.html',
            controller: 'MainCtrl',
            resolve: {
                me: function(Me, $q, $state, $mdDialog){
                    var deferred = $q.defer();
                    var reject = function(reject){
                        deferred.reject(reject);
                        $state.go('auth');
                    };
                    Me.get().$promise.then(function(me){
                        if(me.pin){
                            $mdDialog.show({
                                controller: 'PinCtrl',
                                templateUrl: 'src/unknown/auth/pin/view.html',
                                parent: angular.element(document.body),
                                clickOutsideToClose:true
                            }).then(function(pin) {
                                if(pin === me.pin){
                                    deferred.resolve(me);
                                }else{
                                    reject();
                                }
                            }, reject);
                        }else{
                            deferred.resolve(me);
                        }
                    }, reject);
                    return deferred.promise;
                }
            }
        }).state('friends', {
            abstract: true,
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
        }).state('friends-list', {
            parent: 'friends',
            url: '/list',
            templateUrl: 'src/main/content/friends/list/view.html',
            controller: 'FriendsListCtrl'
        }).state('friends-face', {
            parent: 'friends',
            url: '/face',
            templateUrl: 'src/main/content/friends/face/view.html',
            controller: 'FriendsFaceCtrl'
        }).state('secret-box', {
            parent: 'main',
            url: '/secretbox',
            views: {
                sidenav: {
                    templateUrl: 'src/main/sidenav/view.html',
                    controller: 'SidenavCtrl'
                },
                content: {
                    templateUrl: 'src/main/content/secretbox/view.html',
                    controller: 'SecretBoxCtrl'
                }
            }
        }).state('secret-box-dialog', {
            parent: 'secret-box',
            url: '/:type/:id',
            resolve: {
                dialogs: function(Dialog, $stateParams){
                    return Dialog.query({
                        type: $stateParams.type,
                        id: $stateParams.id
                    }).$promise;
                }
            },
            views: {
                'content@main': {
                    templateUrl: 'src/main/content/secretbox/dialog/view.html',
                    controller: 'DialogCtrl'
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
        }).state('shop', {
            parent: 'main',
            url: '/shop',
            views: {
                sidenav: {
                    templateUrl: 'src/main/sidenav/view.html',
                    controller: 'SidenavCtrl'
                },
                content: {
                    templateUrl: 'src/main/content/shop/view.html',
                    controller: 'ShopCtrl'
                }
            }
        });

}).run(function($translatePartialLoader, $translate, $timeout){

    $translatePartialLoader.addPart('auth');
    $translatePartialLoader.addPart('forgot-password');
    $translatePartialLoader.addPart('account');
    $translatePartialLoader.addPart('pin');
    $translatePartialLoader.addPart('common');
    $translatePartialLoader.addPart('sidenav');
    $translatePartialLoader.addPart('friends');
    $translatePartialLoader.addPart('secretbox');
    $translatePartialLoader.addPart('dialog');
    $translatePartialLoader.addPart('connect');
    $translatePartialLoader.addPart('settings');
    $translatePartialLoader.addPart('basket');
    $translatePartialLoader.addPart('shop');

    $timeout(function(){
        $translate.refresh();
    },1);

});
