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
'use strict';

(function(){
    var origin = window.location.href.split(window.location.hash)[0];

    angular.module('app').constant('settings', {
        //endpoint: 'http://localhost:9001/rest-api/',
        //endpoint: 'http://secret-love-back-dev.elasticbeanstalk.com/rest-api/',
        endpoint: 'http://secret-love-back-prod-hjm26vy7wv.elasticbeanstalk.com/rest-api/',
        toast: {
            hideDelay: 5000,
            position: 'bottom left'
        },
        socials: {
            phone: {
                label: 'connect.label.phone',
                icon: {
                    name: 'quick_contacts_dialer',
                    color: '#6491F7'
                }
            },
            facebook: {
                label: 'connect.label.facebook',
                auth: {
                    isCode: true,
                    patternURI: /\?code=([^&]*)#/,
                    clientId: '1642970339309039',
                    clientSecret: '22c45254414542a179b813b60928f653',
                    redirectUri: origin,
                    scope: ['user_friends']
                },
                icon: {
                    name: 'facebook',
                    color: '#3B5998'
                }
            },
            googlePlus: {
                label: 'connect.label.google-plus',
                auth: {
                    patternURI: /&access_token=([^&]+)/,
                    clientId: '205281637316-ad74m4l932db0j969qottrafu4sb08rs.apps.googleusercontent.com',
                    redirectUri: origin,
                    scope: ['https://www.googleapis.com/auth/plus.login']
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
                    name: 'img/instagram-icon.svg',
                    color: 'brown'
                }
            },
            viadeo: {
                label: 'connect.label.viadeo',
                auth: {
                    proxy: true
                },
                icon: {
                    name: 'img/viadeo-icon.svg',
                    color: '#FFA100'
                }
            },
            twitter: {
                label: 'connect.label.twitter',
                auth: {
                    patternURI: /^#access_token_unknow=([^&]+)/,
                    clientId: 'r9e5QZVVUIu3ChTXr1w08fm5T',
                    clientSecret: 'tWwdJUrW4bnKsfkhXzKpzYw03LYKFZiu3fn2ePA18l2unk6DNN',
                    redirectUri: origin,
                    scope: ['user_friends']
                },
                icon: {
                    name: 'twitter',
                    color: '#1AB2E8'
                }
            },
            linkedin: {
                label: 'connect.label.linkedin',
                auth: {
                    isCode: true,
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

angular.module('app').provider('$cache', function(settings){

    var validity = {
        SECOND: 1000
    };
    validity.MINUTE = 60 * validity.SECOND;
    validity.HOUR = 60 * validity.MINUTE;
    validity.DAY = 24 * validity.HOUR;
    validity.MONTH = 30 * validity.DAY;
    validity.YEAR = 365 * validity.MONTH;

    var now = function(){
        return (new Date()).getTime();
    };

    var Cache = function(name, invalidity){
        this.key = 'cache_' + name;
        this.invalidity = invalidity;
    };
    Cache.prototype.getCache = function(){
        var cache = window.localStorage.getItem(this.key);
        return JSON.parse(cache);
    };
    Cache.prototype.setCache = function(cache){
        window.localStorage.setItem(this.key, JSON.stringify(cache));
    };
    Cache.prototype.invalid = function(){
        window.localStorage.removeItem(this.key);
    };
    Cache.prototype.getData = function(){
        var cache = this.getCache();
        if(!cache || cache.timestamp + this.invalidity < now()){
            this.invalid();
            return null;
        }else{
            return cache.data;
        }
    };
    Cache.prototype.setData = function(data){
        this.timestamp = now();
        var cache = {
            data: data,
            timestamp: now()
        };
        this.setCache(cache);
    };

    this.token = {};
    this.code = {};
    for(var key in settings.socials){
        this.token[key] = new Cache('token_' + key, validity.YEAR);
        this.code[key] = new Cache('code_' + key, validity.MINUTE);
    }
    this.friends = new Cache('data_friends', validity.SECOND);
    this.secretBox = new Cache('data_secretBox', validity.SECOND);
    this.hiddenFriends = new Cache('data_hiddenFriends', validity.YEAR);

    this.$get = function(){
        return this;
    };

});
'use strict';

angular.module('app').factory('Me', function(settings, $resource, $q, $injector){

    var Me = $resource(settings.endpoint + 'me/:action', null, {
        isUnique: {
            method:'POST',
            params: {
                action: 'unique'
            }
        },
        authenticate: {
            method:'POST',
            params: {
                action: 'authenticate'
            }
        },
        logout: {
            method:'GET',
            params: {
                action: 'logout'
            }
        },
        forgotPassword: {
            method:'POST',
            params: {
                action: 'forgot-password'
            }
        },
        update: {
            method:'PUT'
        },
        disconnect: {
            method:'PUT',
            params: {
                action: 'disconnect'
            }
        },
        connect: {
            method:'POST',
            params: {
                action: 'connect'
            }
        }
    });

    Me.getSocialsMe = function(){

        var promises = [];

        angular.forEach(settings.socials, function(social, name){
            var socialService = $injector.get(name);
            if(socialService.isConnected()){
                var promise = socialService.getMe();
                promises.push(promise);
            }
        });

        return $q.all(promises);
    };

    return Me;

});
'use strict';

angular.module('app').factory('Friend', function(settings, $q, $resource, $injector, $http, SecretBox, $timeout, $cache){

    var Friend = $resource(settings.endpoint + 'friends');

    Friend.query = function(){
        var deferred = $q.defer();

        if($cache.friends.getData()){
            $timeout(function(){
                deferred.notify($cache.friends.getData());
                deferred.resolve($cache.friends.getData());
            }, 1);
        }else{
            SecretBox.query().then(function(secretBox){

                var promises = [];
                var friendsOnNotify = [];

                var equals = function(friend1, friend2){
                    return friend1.id === friend2.id && friend1.type === friend2.type;
                };

                var areInLove = function(secretBox, friend){
                    return secretBox.some(function(secretBoxItem){
                        return equals(secretBoxItem.friend, friend);
                    });
                };

                var isVisible = function(friend){
                    var data = $cache.hiddenFriends.getData() || [];
                    var isInHiddenList = data.some(function(f){
                        return equals(f, friend);
                    });
                    return !isInHiddenList;
                };

                angular.forEach(settings.socials, function(social, name){
                    var socialService = $injector.get(name);
                    var promise = socialService.getFriends();
                    promise.then(function(){

                    }, function(){

                    }, function(friends){
                        deferred.notify(friends.map(function(friend){
                            friend.love = areInLove(secretBox, friend);
                            friend.visibility = isVisible(friend);
                            friendsOnNotify.push(friend);
                            return friend;
                        }));
                    });
                    promises.push(promise);
                });

                $q.all(promises).then(function(){
                    $cache.friends.setData(friendsOnNotify);
                    deferred.resolve(friendsOnNotify);
                });
            });
        }

        return deferred.promise;
    };

    return Friend;

});
'use strict';

angular.module('app').factory('SecretBox', function(settings, $resource, $q, $cache){

    var SecretBox = $resource(settings.endpoint + 'secretbox/:type/:id');

    return {
        query: function(){
            var cache = $cache.secretBox.getData();
            if(cache){
                return $q.when(cache);
            }

            var deferred = $q.defer();
            SecretBox.query(function(secretBox){
                $cache.secretBox.setData(secretBox);
                deferred.resolve(secretBox);
            }, deferred.reject);
            return deferred.promise;
        },
        save: function(friend){
            var deferred = $q.defer();
            SecretBox.save(friend).$promise.then(function(){
                var secretBox = $cache.secretBox.getData() || [];
                secretBox.push({
                    friend: {
                        id: friend.id,
                        type: friend.type,
                        verified: false,
                        inLove: false
                    },
                    lastUpdate: (new Date()).getTime(),
                    hasNews: false,
                    messages: null
                });
                $cache.secretBox.setData(secretBox);
                deferred.resolve();
            }, deferred.reject);
            return deferred.promise;
        },
        delete: function(friend){
            var deferred = $q.defer();
            SecretBox.delete(friend).$promise.then(function(){
                var secretBox = $cache.secretBox.getData();
                var getIndex = function(type, id){
                    for(var i in secretBox){
                        if(secretBox[i].friend.type === type && secretBox[i].friend.id === id){
                            return i;
                        }
                    }
                };
                secretBox.splice(getIndex(friend.type, friend.id), 1);
                $cache.secretBox.setData(secretBox);
                deferred.resolve();
            }, deferred.reject);
            return deferred.promise;
        }
    };

});
'use strict';

angular.module('app').factory('Dialog', function(settings, $resource){

    return $resource(settings.endpoint + 'dialogs/:type/:id');

});
'use strict';

angular.module('app').factory('Proxy', function(settings, $resource){

    var Proxy = $resource(settings.endpoint + 'proxy/:action', null, {
        getViadeoFriends: {
            method:'POST',
            params: {
                action: 'viadeo-friends'
            },
            isArray: true
        },
        getViadeoMe: {
            method:'POST',
            params: {
                action: 'viadeo-me'
            }
        }
    });

    return Proxy;

});
'use strict';

angular.module('app').provider('Language', function(){

    this.getPreferredLanguage = function(){
        var browserLang = navigator.language || navigator.userLanguage;
        switch (browserLang){
            case 'fr':
                return 'fr';
            default:
                return 'en';
        }
    };

    this.$get = function(){

    };

});
'use strict';

angular.module('app').run(function ($log, $window) {

    if($window.applicationCache){
        // Enable new cache when available and reload page
        $window.applicationCache.addEventListener('updateready', function () {
            $window.applicationCache.swapCache();
            $log.info('Cache updating');
            $window.location.reload();
        }, false);

        // Cache in error
        $window.applicationCache.addEventListener('error', function () {
            $log.info('Cache in error');
        }, false);

        // Check of the manifest release
        $window.applicationCache.addEventListener('checking', function () {
            $log.info('Cache checking');
        }, false);

        // Manifest changed : download the new content
        $window.applicationCache.addEventListener('obsolete', function () {
            $log.info('Cache not up-to-date');
            $window.applicationCache.update();
        }, false);

        // Manifest not changed
        $window.applicationCache.addEventListener('noupdate', function () {
            $log.info('Manifest not changed');
        }, false);
    }

});
'use strict';

angular.module('app').directive('basketContent', function($timeout){
    return {
        restrict: 'E',
        scope: {
            basket: '=basket'
        },
        templateUrl: 'src/components/basket-content/view.html',
        link: function($scope){

            $scope.$watch(function(){
                return $scope.basket.loves;
            }, function(val, oldVal){
                if(val !== oldVal){
                    if(val < oldVal){
                        $scope.moveMinusOne = true;
                        $timeout(function(){
                            $scope.moveMinusOne = false;
                        }, 2000);
                    }
                }
            });
        }
    };
});
'use strict';

angular.module('app').directive('bodyMessageAction', function(){
    return {
        restrict: 'E',
        scope: {
            titleLabel: '@',
            messageLabel: '@',
            action: '@',
            actionLabel: '@'
        },
        templateUrl: 'src/components/body-message-action/view.html',
        link: function(){

        }
    };
});
'use strict';

angular.module('app').directive('friendPreview', function(settings, Friend){

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            friend: '=friend'
        },
        templateUrl: 'src/components/friend-preview/view.html',
        link: function($scope){

            if($scope.friend && (!$scope.friend.picture || !$scope.friend.name)){
                Friend.query().then(function(friends){

                    var matchFriends = friends.filter(function(f){
                        return f.id === $scope.friend.id && f.type === $scope.friend.type;
                    });

                    if(matchFriends[0]){
                        $scope.friend.name = matchFriends[0].name;
                        $scope.friend.picture = matchFriends[0].picture;
                    }
                });
            }

            $scope.getSocialIcon = function(social){
                if(social){
                    return settings.socials[social].icon;
                }
            };
        }
    };
});
'use strict';

angular.module('app').directive('socialIcon', function(){

    return {
        restrict: 'E',
        templateUrl: 'src/components/social/view.html',
        scope: {
            name: '@name',
            color: '@color'
        },
        link: function(scope, el){
            var size = el.attr('size');
            setTimeout(function(){
                var svg = el.find('svg');
                svg.attr('width', size);
                svg.attr('height', size);
            },100);
            scope.isUrl = function(name){
                return name.indexOf('/') !== -1;
            };
        }
    };

});
'use strict';

angular.module('app').controller('ConnectProxyCtrl', function($scope, $mdDialog){

    $scope.proxy = {};

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.submit = function() {
        if($scope.proxyForm.$valid){
            $mdDialog.hide($scope.proxy);
        }
    };
});
'use strict';

angular.module('app').provider('Connection', function(settings, $cacheProvider){

    var findPatternInURI = function(pattern){
        var reg = window.location.href.match(pattern);
        return reg && reg[1] ? reg[1] : null;
    };

    for(var i in settings.socials){
        if(settings.socials[i].auth){
            var hash = findPatternInURI(settings.socials[i].auth.patternURI);
            if(hash){
                if(settings.socials[i].auth.isCode){
                    $cacheProvider.code[i].setData(hash);
                    window.location = window.location.href.split('?')[0] + '#/';
                }else{
                    $cacheProvider.token[i].setData(hash);
                }
                break;
            }
        }
    }

    this.$get = function($q){
      return function(args){

          this.getToken = function(){
            var deferred = $q.defer();
            var token = $cacheProvider.token[args.name].getData();
            var code = $cacheProvider.code[args.name].getData();
            if(token){
                deferred.resolve(token);
            }else if(code){
                args.getTokenWithCode(code).then(function(token){
                    $cacheProvider.code[args.name].invalid();
                    $cacheProvider.token[args.name].setData(token);
                    deferred.resolve(token);
                });
            }else{
                args.sendTokenRequest();
                deferred.reject(token);
            }
            return deferred.promise;
          };

          this.close = function(){
              var deferred = $q.defer();
              args.sendConnectionClose().then(function(){
                  $cacheProvider.code[args.name].invalid();
                  $cacheProvider.token[args.name].invalid();
                  deferred.resolve();
              }, deferred.reject);
              return deferred.promise;
          };

          this.isConnected = function(){
              return $cacheProvider.token[args.name].getData() !== null;
          };

          this.isImplemented = function(){
              return args.isImplemented;
          };

          this.getFriends = function(){
              var code = $cacheProvider.code[args.name].getData();
              var deferred = $q.defer();
              if(code){
                  var connection = this;
                  connection.getToken().then(function(){
                      deferred.resolve(connection.isConnected()? args.getFriends($cacheProvider.token[args.name].getData(), connection.getToken, connection.close) : []);
                  });
              }else{
                  deferred.resolve(this.isConnected()? args.getFriends($cacheProvider.token[args.name].getData(), this.getToken, this.close) : []);
              }
              return deferred.promise;
          };

          this.getMe = function(){
              var deferred = $q.defer();
              this.getToken().then(function(token){
                  args.getMe(token).then(function(socialMe){
                      deferred.resolve(socialMe);
                  }, deferred.reject);
              }, deferred.reject);
              return deferred.promise;
          };

      };
    };


});
'use strict';

angular.module('app').factory('phone', function($q, $http, $cache, $timeout) {

    var isPhoneDevice = false;
    var isStubMode = true;

    return{
        getToken: function(){
            var token = 'OK';
            $cache.token.phone.setData(token);
            return $q.when(token);
        },
        isConnected: function(){
            return $cache.token.phone.getData() !== null;
        },
        isImplemented: function(){
            return isPhoneDevice || isStubMode;
        },
        close: function(){
            var deferred = $q.defer();
            $timeout(function(){
                $cache.token.phone.invalid();
                deferred.resolve();
            }, 1);
            return deferred.promise;
        },
        getFriends: function(){
            var deferred = $q.defer();
            if(this.isImplemented() && this.isConnected()){
                if(isStubMode){
                    $http.get('stub/data/friends/phone.json').then(function(response){
                        var friends = response.data.map(function(friend){
                            return {
                                id: friend.id,
                                name: friend.displayName,
                                picture: 'data:image/jpg;base64,' + friend.photos[0],
                                type: 'phone'
                            };
                        });
                        deferred.notify(friends);
                        deferred.resolve(friends);
                    }, deferred.reject);
                }else if(isPhoneDevice){
                    deferred.resolve([]);
                }
            }else{
                deferred.resolve([]);
            }
            return deferred.promise;
        },
        getMe: function(){
            var deferred = $q.defer();
            //TODO not null id (Telephone number)
            deferred.resolve({
                type: 'phone',
                id: null
            });
            return deferred.promise;
        }
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

            var getFriendPage = function(nextPageToken){
                var subDeferred = $q.defer();
                $http.jsonp('https://www.googleapis.com/plus/v1/people/me/people/visible', {
                    params: {
                        access_token: token,
                        callback: 'JSON_CALLBACK',
                        maxResults: 100,
                        fields : 'items(id, displayName,image/url,objectType),nextPageToken',
                        pageToken: nextPageToken
                    }
                }).then(function(response){
                    if(response.data.error && (response.data.error.code === LIMIT_TOKEN_STATUS || response.data.error.code === UNAUTH_STATUS)){
                        close().then(function(){
                            getNewToken().then(function(){
                                subDeferred.reject(response.data.error.message);
                            }, subDeferred.reject);
                        });
                    }else{
                        subDeferred.resolve(response.data);
                    }
                }, subDeferred.reject);
                return subDeferred.promise;
            };

            var deferred = $q.defer();

            var calbackResponse = function(response){
                var friends = response.items.reduce(function(friends, friend){
                    if(friend.objectType === 'person'){
                        friends.push(new Friend({
                            id: friend.id,
                            name: friend.displayName,
                            picture: friend.image.url,
                            type: 'googlePlus'
                        }));
                    }
                    return friends;
                }, []);

                deferred.notify(friends);

                if(response.nextPageToken){
                    getFriendPage(response.nextPageToken).then(calbackResponse, deferred.reject);
                }else{
                    deferred.resolve();
                }

            };
            getFriendPage().then(calbackResponse, deferred.reject);

            return deferred.promise;
        },
        getMe: function(token){
            var deferred = $q.defer();
            $http.jsonp('https://www.googleapis.com/plus/v1/people/me', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                var me = {
                    id: response.data.id,
                    name: response.data.displayName,
                    picture: response.data.image.url,
                    type: 'googlePlus'
                };
                deferred.resolve(me);
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
                    deferred.notify(response.data.data.map(function(friend){
                        var name = friend.username;
                        if(friend.full_name){
                            name += ' (' + friend.full_name + ')';
                        }
                        return new Friend({
                            id: friend.id,
                            name: name,
                            picture: friend.profile_picture,
                            type: 'instagram'
                        });
                    }));
                    deferred.resolve();
                }
            }, deferred.reject);
            return deferred.promise;
        },
        getMe: function(token){
            var deferred = $q.defer();
            $http.jsonp('https://api.instagram.com/v1/users/self', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK',
                    count: 1000
                }
            }).then(function(response){
                var name = response.data.data.username;
                if(response.data.data.full_name){
                    name += ' (' + response.data.data.full_name + ')';
                }
                var me = {
                    id: response.data.data.id,
                    name: name,
                    picture: response.data.data.profile_picture,
                    type: 'instagram'
                };
                deferred.resolve(me);
            }, deferred.reject);
            return deferred.promise;
        }
    });

    return connection;

});
'use strict';

angular.module('app').factory('facebook', function(settings, Connection, Friend, $http, $q) {

    return new Connection({
        name: 'facebook',
        isImplemented: true,
        sendTokenRequest: function(){
            var url = 'https://www.facebook.com/v2.0/dialog/oauth';
            url += '?app_id=' + settings.socials.facebook.auth.clientId;
            url += '&redirect_uri=' + settings.socials.facebook.auth.redirectUri;
            url += '&scope=' + settings.socials.facebook.auth.scope.join(',');
            window.location = url;
            return $q.when();
        },
        getTokenWithCode: function(code){
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'https://graph.facebook.com/oauth/access_token',
                withCredentials: false,
                params: {
                    code: code,
                    client_id: settings.socials.facebook.auth.clientId,
                    client_secret: settings.socials.facebook.auth.clientSecret,
                    redirect_uri: settings.socials.facebook.auth.redirectUri
                }
            }).then(function(resp){
                var token = resp.data.match(/access_token\=([^&]+)/)[1];
                deferred.resolve(token);
            });
            return deferred.promise;
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(token){
            var deferred = $q.defer();
            $http.jsonp('https://graph.facebook.com/v2.4/me/taggable_friends?limit=1000&fields=id,name,picture', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                deferred.notify(response.data.data ? response.data.data.map(function(friend){
                    return new Friend({
                        id: friend.name,
                        name: friend.name,
                        picture: friend.picture.data.url,
                        type: 'facebook'
                    });
                }) : []);
                deferred.resolve();
            });
            return deferred.promise;
        },
        getMe: function(token){
            var deferred = $q.defer();
            $http.jsonp('https://graph.facebook.com/v2.4/me', {
                params: {
                    access_token: token,
                    callback: 'JSON_CALLBACK',
                    count: 1000
                }
            }).then(function(response){
                var me = {
                    id: response.data.name,
                    name: response.data.name,
                    picture: 'https://graph.facebook.com/' + response.data.id + '/picture',
                    type: 'facebook'
                };
                deferred.resolve(me);
            }, deferred.reject);
            return deferred.promise;
        }
    });

});
'use strict';

angular.module('app').factory('linkedin', function(settings, Connection, $http, $q) {

    return new Connection({
        name: 'linkedin',
        isImplemented: false,
        sendTokenRequest: function(){
            var url = 'https://www.linkedin.com/uas/oauth2/authorization';
            url += '?client_id=' + settings.socials.linkedin.auth.clientId;
            url += '&redirect_uri=' + settings.socials.linkedin.auth.redirectUri;
            url += '&response_type=code';
            url += '&state=abcde';
            url += '&scope=' + settings.socials.linkedin.auth.scope.join(' ');
            window.location = url;
            return $q.when();
        },
        getTokenWithCode: function(code){
            var deferred = $q.defer();
            $http.post('https://www.linkedin.com/uas/oauth2/accessToken', {
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
                deferred.resolve(resp.data.access_token);
            });
            return deferred.promise;
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(token){
            var deferred = $q.defer();
            $http.jsonp('https://api.linkedin.com/v1/people/~?format=json', {
                params: {
                    format: 'jsonp',
                    oauth2_access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                console.log(response);
                deferred.resolve(response);
            }, deferred.reject);
            return deferred.promise;
        },
        getMe: function(token){
            var deferred = $q.defer();
            $http.jsonp('https://api.linkedin.com/v1/people/~?format=json', {
                params: {
                    format: 'jsonp',
                    oauth2_access_token: token,
                    callback: 'JSON_CALLBACK'
                }
            }).then(function(response){
                console.log(response);
                deferred.resolve(response);
            }, deferred.reject);
            return deferred.promise;
        }
    });

});
'use strict';

angular.module('app').factory('twitter', function(settings, Connection, $q, $http) {
    return new Connection({
        name: 'twitter',
        isImplemented: false,
        sendTokenRequest: function(){
            var timestamp = (new Date().getTime()).toString();
            var oauth_timestamp = timestamp.substring(0, timestamp.length - 3);

            var authorization = 'OAuth oauth_callback="' + settings.socials.twitter.auth.redirectUri + '",';
            authorization += 'oauth_consumer_key="' + settings.socials.twitter.auth.clientId + '",';
            authorization += 'oauth_nonce="8317b2ae48c58507f3563df90874335b",';
            authorization += 'oauth_signature="RcJu7Hg%2BFihZ8DwIzJqbFivrJOA%3D",';
            authorization += 'oauth_signature_method="HMAC-SHA1",';
            authorization += 'oauth_timestamp="' + oauth_timestamp + '",';
            authorization += 'oauth_version="1.0"';
            console.log(authorization);
            console.log(new Date().getTime() / 1000);
            $http.post('https://api.twitter.com/oauth/request_token', {
                headers: {
                    Authorization: authorization
                }
            }).then(function(data){
                console.log(data);
            }, function(data){
                console.log(data);
            });
            //var url = 'https://api.twitter.com/oauth/authorize';
            //url += '?oauth_token=';
            //url += settings.socials.twitter.auth.clientId;
            //window.location = url;
        },
        getTokenWithCode: function(code){
            var deferred = $q.defer();
            deferred.resolve(code);
            return deferred.promise;
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(){
            var deferred = $q.defer();
            // https://dev.twitter.com/rest/tools/console
            // https://api.twitter.com/1.1/friends/ids.json
            // https://api.twitter.com/1.1/users/lookup.json?user_id=6693582,F1717226282,2277815413
            return deferred.promise;
        },
        getMe: function(){
            var deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        }
    });
});
'use strict';

angular.module('app').factory('viadeo', function(Connection, $http, $q, $cache, $mdDialog, Proxy, Friend) {

    return new Connection({
        name: 'viadeo',
        isImplemented: true,
        sendTokenRequest: function(){
            var deferred = $q.defer();
            $mdDialog.show({
                controller: 'ConnectProxyCtrl',
                templateUrl: 'src/connection/proxy/view.html',
                parent: angular.element(document.querySelector('.state-connect')[0]),
                clickOutsideToClose:true
            }).then(function(answer) {
                $cache.token.viadeo.setData(answer);
                deferred.resolve(answer);
            }, deferred.reject);
            return deferred.promise;
        },
        sendConnectionClose: function(){
            return $q.when();
        },
        getFriends: function(token){
            var deferred = $q.defer();
            Proxy.getViadeoFriends(token).$promise.then(function(response){
                var friends = response.map(function(friend){
                    return new Friend({
                        id: friend.contactId,
                        name: friend.firstname + ' ' + friend.lastname,
                        picture: friend.photoUrl,
                        type: 'viadeo'
                    });
                });
                deferred.notify(friends);
                deferred.resolve(friends);
            }, deferred.reject);
            return deferred.promise;
        },
        getMe: function(token){
            var deferred = $q.defer();
            Proxy.getViadeoMe(token).$promise.then(function(response){
                response.type = 'viadeo';
                deferred.resolve(response);
            }, deferred.reject);
            return deferred.promise;
        }
    });

});
'use strict';

angular.module('app').controller('MainCtrl', function($scope, $mdSidenav, me, $state, LoadApplication, Me){

    $scope.me = me;
    $scope.state = $state;
    $scope.isAppStub = LoadApplication.isAppStub();

    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.loadApp = function(){
        LoadApplication.loadApp();
    };

    Me.getSocialsMe().then(function(socialsMe){
        var unsavedSocials = socialsMe.filter(function(social){
            return !$scope.me.socials.some(function(s){
                return s.id === social.id && s.type === social.type;
            });
        });
        unsavedSocials.forEach(function(socialMe){
            Me.connect(socialMe);
        });
    });

});
'use strict';

angular.module('app').controller('SidenavCtrl', function(settings, $scope, $interval, SecretBox){

    SecretBox.query().then(function(secretBox){
        $scope.secretBox = secretBox;
        $scope.nbSecretBoxNews = $scope.secretBox.filter(function(secret){
            return secret.hasNews;
        }).length;
    });

});
'use strict';

angular.module('app').controller('UnknownCtrl', function($scope, $state){

    $scope.state = $state;

});
'use strict';

angular.module('app').controller('AuthCtrl', function($scope, Me, $state, $mdDialog, $translate, LoadApplication){

    $scope.me = new Me();

    $scope.submit = function(ev){
        if($scope.loginForm.$valid){
            $scope.me.$authenticate().then(function(){
                $state.go('friends-list');
            }, function(error){
                var descriptionLabel;
                switch (error.status){
                    case 403:
                        descriptionLabel = 'auth.connect.issue.dialog.password';
                        break;
                    case 404:
                        descriptionLabel = 'auth.connect.issue.dialog.email';
                        break;
                    default:
                        descriptionLabel = 'auth.connect.issue.dialog.description';
                        break;
                }
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('auth.connect.issue.dialog.title'))
                        .content($translate.instant(descriptionLabel))
                        .ariaLabel($translate.instant('auth.connect.issue.dialog.action'))
                        .ok($translate.instant('auth.connect.issue.dialog.action'))
                        .targetEvent(ev)
                );
            });
        }
    };

    $scope.loadDemo = function(){
        LoadApplication.loadAppStub();
    };

});
'use strict';

angular.module('app').directive('emailExist', function(Me){

    return{
        restrict: 'A',
        require: 'ngModel',
        scope: {
          ngModel: '='
        },
        link: function(scope, element, attributes, ctrl){

            scope.$watch(function(){
                return scope.ngModel;
            }, function(val){
                Me.isUnique({
                    email: val
                }).$promise.then(function(response){
                    ctrl.$setValidity('exist', !response.unique);
                }, function(){
                    ctrl.$setValidity('exist', false);
                });
            });

        }
    };

});
'use strict';

angular.module('app').controller('ForgotPasswordCtrl', function($scope, Me, $state, $mdDialog, $translate){

    $scope.me = new Me();

    $scope.submit = function(ev){
        if($scope.passwordForm.$valid){
            $scope.me.$forgotPassword().then(function(){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('forgot.password.success.dialog.title'))
                        .content($translate.instant('forgot.password.success.dialog.description'))
                        .ariaLabel($translate.instant('forgot.password.success.dialog.action'))
                        .ok($translate.instant('forgot.password.success.dialog.action'))
                        .targetEvent(ev)
                );
            }, function(){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('forgot.password.issue.dialog.title'))
                        .content($translate.instant('forgot.password.issue.dialog.description'))
                        .ariaLabel($translate.instant('forgot.password.issue.dialog.action'))
                        .ok($translate.instant('forgot.password.issue.dialog.action'))
                        .targetEvent(ev)
                );
            });
        }
    };

});
'use strict';

angular.module('app').controller('PinCtrl', function($scope, $mdDialog){

    $scope.submit = function(){
        $mdDialog.hide($scope.pin.toString());
    };

});
'use strict';

angular.module('app').controller('AccountCtrl', function($scope, Me, $state, $mdDialog, $translate){

    $scope.me = new Me();

    $scope.submit = function(ev){
        if($scope.accountForm.$valid){
            $scope.me.$save().then(function(){
                $state.go('friends-list');
            }, function(){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('account.connect.issue.dialog.title'))
                        .content($translate.instant('account.connect.issue.dialog.description'))
                        .ariaLabel($translate.instant('account.connect.issue.dialog.action'))
                        .ok($translate.instant('account.connect.issue.dialog.action'))
                        .targetEvent(ev)
                );
            });
        }
    };

});
'use strict';

angular.module('app').directive('emailCheck', function(Me){

    var blacklist = [
        '0815.ru',
        '0wnd.net',
        '0wnd.org',
        '10minutemail.co.za',
        '10minutemail.com',
        '123-m.com',
        '1fsdfdsfsdf.tk',
        '1pad.de',
        '20minutemail.com',
        '21cn.com',
        '2fdgdfgdfgdf.tk',
        '2prong.com',
        '30minutemail.com',
        '33mail.com',
        '3trtretgfrfe.tk',
        '4gfdsgfdgfd.tk',
        '4warding.com',
        '5ghgfhfghfgh.tk',
        '6hjgjhgkilkj.tk',
        '6paq.com',
        '7tags.com',
        '9ox.net',
        'a-bc.net',
        'agedmail.com',
        'ama-trade.de',
        'amilegit.com',
        'amiri.net',
        'amiriindustries.com',
        'anonmails.de',
        'anonymbox.com',
        'antichef.com',
        'antichef.net',
        'antireg.ru',
        'antispam.de',
        'antispammail.de',
        'armyspy.com',
        'artman-conception.com',
        'azmeil.tk',
        'baxomale.ht.cx',
        'beefmilk.com',
        'bigstring.com',
        'binkmail.com',
        'bio-muesli.net',
        'bobmail.info',
        'bodhi.lawlita.com',
        'bofthew.com',
        'bootybay.de',
        'boun.cr',
        'bouncr.com',
        'breakthru.com',
        'brefmail.com',
        'bsnow.net',
        'bspamfree.org',
        'bugmenot.com',
        'bund.us',
        'burstmail.info',
        'buymoreplays.com',
        'byom.de',
        'c2.hu',
        'card.zp.ua',
        'casualdx.com',
        'cek.pm',
        'centermail.com',
        'centermail.net',
        'chammy.info',
        'childsavetrust.org',
        'chogmail.com',
        'choicemail1.com',
        'clixser.com',
        'cmail.net',
        'cmail.org',
        'coldemail.info',
        'cool.fr.nf',
        'courriel.fr.nf',
        'courrieltemporaire.com',
        'crapmail.org',
        'cust.in',
        'cuvox.de',
        'd3p.dk',
        'dacoolest.com',
        'dandikmail.com',
        'dayrep.com',
        'dcemail.com',
        'deadaddress.com',
        'deadspam.com',
        'delikkt.de',
        'despam.it',
        'despammed.com',
        'devnullmail.com',
        'dfgh.net',
        'digitalsanctuary.com',
        'dingbone.com',
        'disposableaddress.com',
        'disposableemailaddresses.com',
        'disposableinbox.com',
        'dispose.it',
        'dispostable.com',
        'dodgeit.com',
        'dodgit.com',
        'donemail.ru',
        'dontreg.com',
        'dontsendmespam.de',
        'drdrb.net',
        'dump-email.info',
        'dumpandjunk.com',
        'dumpyemail.com',
        'e-mail.com',
        'e-mail.org',
        'e4ward.com',
        'easytrashmail.com',
        'einmalmail.de',
        'einrot.com',
        'eintagsmail.de',
        'emailgo.de',
        'emailias.com',
        'emaillime.com',
        'emailsensei.com',
        'emailtemporanea.com',
        'emailtemporanea.net',
        'emailtemporar.ro',
        'emailtemporario.com.br',
        'emailthe.net',
        'emailtmp.com',
        'emailwarden.com',
        'emailx.at.hm',
        'emailxfer.com',
        'emeil.in',
        'emeil.ir',
        'emz.net',
        'ero-tube.org',
        'evopo.com',
        'explodemail.com',
        'express.net.ua',
        'eyepaste.com',
        'fakeinbox.com',
        'fakeinformation.com',
        'fansworldwide.de',
        'fantasymail.de',
        'fightallspam.com',
        'filzmail.com',
        'fivemail.de',
        'fleckens.hu',
        'frapmail.com',
        'friendlymail.co.uk',
        'fuckingduh.com',
        'fudgerub.com',
        'fyii.de',
        'garliclife.com',
        'gehensiemirnichtaufdensack.de',
        'get2mail.fr',
        'getairmail.com',
        'getmails.eu',
        'getonemail.com',
        'giantmail.de',
        'girlsundertheinfluence.com',
        'gishpuppy.com',
        'gmial.com',
        'goemailgo.com',
        'gotmail.net',
        'gotmail.org',
        'gotti.otherinbox.com',
        'great-host.in',
        'greensloth.com',
        'grr.la',
        'gsrv.co.uk',
        'guerillamail.biz',
        'guerillamail.com',
        'guerrillamail.biz',
        'guerrillamail.com',
        'guerrillamail.de',
        'guerrillamail.info',
        'guerrillamail.net',
        'guerrillamail.org',
        'guerrillamailblock.com',
        'gustr.com',
        'harakirimail.com',
        'hat-geld.de',
        'hatespam.org',
        'herp.in',
        'hidemail.de',
        'hidzz.com',
        'hmamail.com',
        'hopemail.biz',
        'ieh-mail.de',
        'ikbenspamvrij.nl',
        'imails.info',
        'inbax.tk',
        'inbox.si',
        'inboxalias.com',
        'inboxclean.com',
        'inboxclean.org',
        'infocom.zp.ua',
        'instant-mail.de',
        'ip6.li',
        'irish2me.com',
        'iwi.net',
        'jetable.com',
        'jetable.fr.nf',
        'jetable.net',
        'jetable.org',
        'jnxjn.com',
        'jourrapide.com',
        'jsrsolutions.com',
        'kasmail.com',
        'kaspop.com',
        'killmail.com',
        'killmail.net',
        'klassmaster.com',
        'klzlk.com',
        'koszmail.pl',
        'kurzepost.de',
        'lawlita.com',
        'letthemeatspam.com',
        'lhsdv.com',
        'lifebyfood.com',
        'link2mail.net',
        'litedrop.com',
        'lol.ovpn.to',
        'lolfreak.net',
        'lookugly.com',
        'lortemail.dk',
        'lr78.com',
        'lroid.com',
        'lukop.dk',
        'm21.cc',
        'mail-filter.com',
        'mail-temporaire.fr',
        'mail.by',
        'mail.mezimages.net',
        'mail.zp.ua',
        'mail1a.de',
        'mail21.cc',
        'mail2rss.org',
        'mail333.com',
        'mailbidon.com',
        'mailbiz.biz',
        'mailblocks.com',
        'mailbucket.org',
        'mailcat.biz',
        'mailcatch.com',
        'mailde.de',
        'mailde.info',
        'maildrop.cc',
        'maileimer.de',
        'mailexpire.com',
        'mailfa.tk',
        'mailforspam.com',
        'mailfreeonline.com',
        'mailguard.me',
        'mailin8r.com',
        'mailinater.com',
        'mailinator.com',
        'mailinator.net',
        'mailinator.org',
        'mailinator2.com',
        'mailincubator.com',
        'mailismagic.com',
        'mailme.lv',
        'mailme24.com',
        'mailmetrash.com',
        'mailmoat.com',
        'mailms.com',
        'mailnesia.com',
        'mailnull.com',
        'mailorg.org',
        'mailpick.biz',
        'mailrock.biz',
        'mailscrap.com',
        'mailshell.com',
        'mailsiphon.com',
        'mailtemp.info',
        'mailtome.de',
        'mailtothis.com',
        'mailtrash.net',
        'mailtv.net',
        'mailtv.tv',
        'mailzilla.com',
        'makemetheking.com',
        'manybrain.com',
        'mbx.cc',
        'mega.zik.dj',
        'meinspamschutz.de',
        'meltmail.com',
        'messagebeamer.de',
        'mezimages.net',
        'ministry-of-silly-walks.de',
        'mintemail.com',
        'misterpinball.de',
        'moncourrier.fr.nf',
        'monemail.fr.nf',
        'monmail.fr.nf',
        'monumentmail.com',
        'mt2009.com',
        'mt2014.com',
        'mycard.net.ua',
        'mycleaninbox.net',
        'mymail-in.net',
        'mypacks.net',
        'mypartyclip.de',
        'myphantomemail.com',
        'mysamp.de',
        'mytempemail.com',
        'mytempmail.com',
        'mytrashmail.com',
        'nabuma.com',
        'neomailbox.com',
        'nepwk.com',
        'nervmich.net',
        'nervtmich.net',
        'netmails.com',
        'netmails.net',
        'neverbox.com',
        'nice-4u.com',
        'nincsmail.hu',
        'nnh.com',
        'no-spam.ws',
        'noblepioneer.com',
        'nomail.pw',
        'nomail.xl.cx',
        'nomail2me.com',
        'nomorespamemails.com',
        'nospam.ze.tc',
        'nospam4.us',
        'nospamfor.us',
        'nospammail.net',
        'notmailinator.com',
        'nowhere.org',
        'nowmymail.com',
        'nurfuerspam.de',
        'nus.edu.sg',
        'objectmail.com',
        'obobbo.com',
        'odnorazovoe.ru',
        'oneoffemail.com',
        'onewaymail.com',
        'onlatedotcom.info',
        'online.ms',
        'opayq.com',
        'ordinaryamerican.net',
        'otherinbox.com',
        'ovpn.to',
        'owlpic.com',
        'pancakemail.com',
        'pcusers.otherinbox.com',
        'pjjkp.com',
        'plexolan.de',
        'poczta.onet.pl',
        'politikerclub.de',
        'poofy.org',
        'pookmail.com',
        'privacy.net',
        'privatdemail.net',
        'proxymail.eu',
        'prtnx.com',
        'putthisinyourspamdatabase.com',
        'putthisinyourspamdatabase.com',
        'qq.com',
        'quickinbox.com',
        'rcpt.at',
        'reallymymail.com',
        'realtyalerts.ca',
        'recode.me',
        'recursor.net',
        'reliable-mail.com',
        'rhyta.com',
        'rmqkr.net',
        'royal.net',
        'rtrtr.com',
        's0ny.net',
        'safe-mail.net',
        'safersignup.de',
        'safetymail.info',
        'safetypost.de',
        'saynotospams.com',
        'schafmail.de',
        'schrott-email.de',
        'secretemail.de',
        'secure-mail.biz',
        'senseless-entertainment.com',
        'services391.com',
        'sharklasers.com',
        'shieldemail.com',
        'shiftmail.com',
        'shitmail.me',
        'shitware.nl',
        'shmeriously.com',
        'shortmail.net',
        'sibmail.com',
        'sinnlos-mail.de',
        'slapsfromlastnight.com',
        'slaskpost.se',
        'smashmail.de',
        'smellfear.com',
        'snakemail.com',
        'sneakemail.com',
        'sneakmail.de',
        'snkmail.com',
        'sofimail.com',
        'solvemail.info',
        'sogetthis.com',
        'soodonims.com',
        'spam4.me',
        'spamail.de',
        'spamarrest.com',
        'spambob.net',
        'spambog.ru',
        'spambox.us',
        'spamcannon.com',
        'spamcannon.net',
        'spamcon.org',
        'spamcorptastic.com',
        'spamcowboy.com',
        'spamcowboy.net',
        'spamcowboy.org',
        'spamday.com',
        'spamex.com',
        'spamfree.eu',
        'spamfree24.com',
        'spamfree24.de',
        'spamfree24.org',
        'spamgoes.in',
        'spamgourmet.com',
        'spamgourmet.net',
        'spamgourmet.org',
        'spamherelots.com',
        'spamherelots.com',
        'spamhereplease.com',
        'spamhereplease.com',
        'spamhole.com',
        'spamify.com',
        'spaml.de',
        'spammotel.com',
        'spamobox.com',
        'spamslicer.com',
        'spamspot.com',
        'spamthis.co.uk',
        'spamtroll.net',
        'speed.1s.fr',
        'spoofmail.de',
        'stuffmail.de',
        'super-auswahl.de',
        'supergreatmail.com',
        'supermailer.jp',
        'superrito.com',
        'superstachel.de',
        'suremail.info',
        'talkinator.com',
        'teewars.org',
        'teleworm.com',
        'teleworm.us',
        'temp-mail.org',
        'temp-mail.ru',
        'tempe-mail.com',
        'tempemail.co.za',
        'tempemail.com',
        'tempemail.net',
        'tempemail.net',
        'tempinbox.co.uk',
        'tempinbox.com',
        'tempmail.eu',
        'tempmaildemo.com',
        'tempmailer.com',
        'tempmailer.de',
        'tempomail.fr',
        'temporaryemail.net',
        'temporaryforwarding.com',
        'temporaryinbox.com',
        'temporarymailaddress.com',
        'tempthe.net',
        'thankyou2010.com',
        'thc.st',
        'thelimestones.com',
        'thisisnotmyrealemail.com',
        'thismail.net',
        'throwawayemailaddress.com',
        'tilien.com',
        'tittbit.in',
        'tizi.com',
        'tmailinator.com',
        'toomail.biz',
        'topranklist.de',
        'tradermail.info',
        'trash-mail.at',
        'trash-mail.com',
        'trash-mail.de',
        'trash2009.com',
        'trashdevil.com',
        'trashemail.de',
        'trashmail.at',
        'trashmail.com',
        'trashmail.de',
        'trashmail.me',
        'trashmail.net',
        'trashmail.org',
        'trashymail.com',
        'trialmail.de',
        'trillianpro.com',
        'twinmail.de',
        'tyldd.com',
        'uggsrock.com',
        'umail.net',
        'uroid.com',
        'us.af',
        'venompen.com',
        'veryrealemail.com',
        'viditag.com',
        'viralplays.com',
        'vpn.st',
        'vsimcard.com',
        'vubby.com',
        'wasteland.rfc822.org',
        'webemail.me',
        'weg-werf-email.de',
        'wegwerf-emails.de',
        'wegwerfadresse.de',
        'wegwerfemail.com',
        'wegwerfemail.de',
        'wegwerfmail.de',
        'wegwerfmail.info',
        'wegwerfmail.net',
        'wegwerfmail.org',
        'wh4f.org',
        'whyspam.me',
        'willhackforfood.biz',
        'willselfdestruct.com',
        'winemaven.info',
        'wronghead.com',
        'www.e4ward.com',
        'www.mailinator.com',
        'wwwnew.eu',
        'x.ip6.li',
        'xagloo.com',
        'xemaps.com',
        'xents.com',
        'xmaily.com',
        'xoxy.net',
        'yep.it',
        'yogamaven.com',
        'yopmail.com',
        'yopmail.fr',
        'yopmail.net',
        'yourdomain.com',
        'yuurok.com',
        'z1p.biz',
        'za.com',
        'zehnminuten.de',
        'zehnminutenmail.de',
        'zippymail.info',
        'zoemail.net',
        'zomg.info'
    ];

    var isInBlacklist = function(email){
        if(email){
            for(var i in blacklist){
                if(email.indexOf(blacklist[i]) !== -1){
                    return true;
                }
            }
        }
        return false;
    };

    return{
        restrict: 'A',
        require: 'ngModel',
        scope: {
          ngModel: '='
        },
        link: function(scope, element, attributes, ctrl){

            scope.$watch(function(){
                return scope.ngModel;
            }, function(val){
                ctrl.$setValidity('blacklist', !isInBlacklist(val));
                Me.isUnique({
                    email: val
                }).$promise.then(function(response){
                    ctrl.$setValidity('unique', response.unique);
                }, function(){
                    ctrl.$setValidity('unique', false);
                });
            });

        }
    };

});
'use strict';

angular.module('app').directive('verifyModel', function(){

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            verifyModel: '=',
            ngModel: '=ngModel'
        },
        link: function(scope, element, attributes, ctrl){

            var compare = function() {
                ctrl.$setValidity('verify', scope.verifyModel === scope.ngModel);
            };

            scope.$watch(function(){
                return scope.verifyModel;
            }, compare);

            scope.$watch(function(){
                return scope.ngModel;
            }, compare);

        }
    };

});
'use strict';

angular.module('app').controller('FriendsCtrl', function(settings, me, $scope, $state, Friend, $filter, $mdToast, $mdDialog, $translate, $timeout, SecretBox, $cache){

    var isListState = function(){
        return $state.current.name === 'friends-list';
    };

    $scope.toggleListFace = function(){
        if(isListState()){
            $state.go('friends-face');
        }else{
            $state.go('friends-list');
        }
    };

    $scope.listOrFaceIcon = function(){
        return isListState() ? 'face': 'list';
    };

    $scope.loading = true;

    $scope.friends = [];
    Friend.query().then(function(){
        $scope.loading = false;
    }, function(){}, function(friends){
        $scope.friends = $scope.friends.concat(friends);
        updateFilteringFriends();
    });

    $scope.filter = {};

    var filter = function(friends, filter){
        return $filter('friendFilter')(friends, filter);
    };

    var updateFilteringFriends = function(){
        $scope.filteringFriends = filter($scope.friends, $scope.filter);
    };

    $scope.$watch(function(){
        return $scope.filter;
    }, updateFilteringFriends, true);

    $scope.$watch(function(){
        return $scope.filteringFriends;
    }, updateFilteringFriends, true);

    $scope.toogleLove = function(friend, ev){

        var friendCopy = angular.copy(friend);
        friendCopy.love = !friendCopy.love;

        if(friendCopy.love && me.basket.loves < 1){
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title($translate.instant('friends.no.more.love.dialog.title') + ' :\'(')
                    .content($translate.instant('friends.no.more.love.dialog.content'))
                    .ariaLabel($translate.instant('friends.no.more.love.dialog.content'))
                    .ok($translate.instant('friends.no.more.love.dialog.action'))
                    .targetEvent(ev)
            );
        }else{
            if(friendCopy.love){
                me.basket.loves--;
                $scope.requestSend = true;
                SecretBox.save({
                    type: friendCopy.type,
                    id: friendCopy.id
                }).then(function(){

                    friend.love = friendCopy.love;
                    $cache.friends.invalid();

                    if(friend.love){
                        $mdToast.show(
                            $mdToast.simple()
                                .content($translate.instant('friends.list.love.toast.content', {
                                    name: friend.name
                                }))
                                .position(settings.toast.position)
                                .hideDelay(settings.toast.hideDelay)
                        );
                    }
                    $scope.requestSend = false;

                }, function(){
                    me.basket.loves++;
                    $scope.requestSend = false;
                });
            }else{
                $scope.requestSend = true;
                SecretBox.delete({
                    id: friendCopy.id,
                    type: friendCopy.type
                }).then(function(){
                    $scope.requestSend = true;
                    friend.love = friendCopy.love;
                    $cache.friends.invalid();
                }, function(){
                    $scope.requestSend = false;
                });
            }

        }
    };

    $scope.toggleFriendVisibility = function(friend){

        var setVisibility = function(visibility){
            friend.visibility = visibility;
            $cache.friends.setData($scope.friends);
            $cache.hiddenFriends.setData($scope.friends.filter(function(f){
                return !f.visibility;
            }).map(function(f){
                return {
                    id: f.id,
                    type: f.type
                };
            }));
        };

        setVisibility(!friend.visibility);

        var toast = $mdToast.simple()
            .content($translate.instant(friend.visibility ? 'friends.list.show.toast.content' : 'friends.list.hide.toast.content', {
                name: friend.name
            }))
            .action($translate.instant('friends.list.hide.toast.cancel'))
            .highlightAction(false)
            .position(settings.toast.position)
            .hideDelay(settings.toast.hideDelay);
        $mdToast.show(toast).then(function(response) {
            if ( response === 'ok' ) {
                setVisibility(!friend.visibility);
            }
        });
    };

});
'use strict';

angular.module('app').controller('FriendsListCtrl', function($scope){

    $scope.openMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    $scope.$parent.filter = {
        visibility: true,
        love: [false],
        type: ['instagram', 'googlePlus', 'facebook', 'phone', 'viadeo']
    };

    $scope.getLoveIcon = function(friend){
        if(friend.love === true){
            return 'favorite';
        }else if(friend.love === false){
            return 'favorite_outline';
        }else if(friend.love === undefined){
            return 'sync_problem';
        }
    };

});
'use strict';

angular.module('app').filter('friendFilter', function($filter) {
    return function( items, filter ) {
        if(!items){
            return [];
        }
        var friends = items.filter(function(item){
            var keep = filter.visibility === item.visibility;
            keep = keep && filter.love.indexOf(item.love) !== -1;
            keep = keep && filter.type.indexOf(item.type) !== -1;
            return keep;
        });
        friends = $filter('filter')(friends, filter.search);
        friends = $filter('orderBy')(friends, 'name');
        return friends;
    };
});
'use strict';

angular.module('app').directive('friendsFilter', function(settings, $injector){
    return {
        restrict: 'E',
        templateUrl: 'src/main/content/friends/list/filter/view.html',
        scope: {
            filter: '=',
            result: '='
        },
        link: function(scope, el){
            scope.socials = settings.socials;

            scope.isOpen = false;

            scope.$watch(function(){
                return scope.isOpen;
            }, function(val){
                angular.element(el).find('md-fab-actions').css({
                    display: val ? 'flex': 'none'
                });
            });

            scope.socialToggle = function(value){
                var index = scope.filter.type.indexOf(value);
                if(index !== -1){
                    scope.filter.type.splice(index, 1);
                }else{
                    scope.filter.type.push(value);
                }
            };

            scope.isConnected = function(name){
                return $injector.get(name).isConnected();
            };

            scope.socialIsSelected = function(type){
                return scope.filter.type.indexOf(type) !== -1;
            };

            scope.loveSelected = function(value){
                var index = scope.filter.love.indexOf(value);
                if(index !== -1){
                    scope.filter.love.splice(index, 1);
                }else{
                    scope.filter.love.push(value);
                }
            };
            scope.loveIsSelected = function(love){
                return scope.filter.love.indexOf(love) !== -1;
            };

            scope.visibilityToggle = function(){
                scope.filter.visibility = !scope.filter.visibility;
            };
        }
    };

});
'use strict';

angular.module('app').controller('FriendsFaceCtrl', function($scope){

    $scope.refreshFace = function(friends){
        if(friends.length > 0){
            var randomIndex = Math.floor(Math.random()*friends.length);
            $scope.friend = friends[randomIndex];
        }else{
            $scope.friend = null;
        }
    };

    $scope.$watch(function(){
        return $scope.filteringFriends;
    }, $scope.refreshFace, true);

});
'use strict';

angular.module('app').controller('ConnectCtrl', function($scope, settings, $translate, $mdDialog, $injector, $cache, Me){

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
            Me.disconnect({type: name}).$promise.then(function(){
                $scope.connectionModel[name] = false;
                socialService.close();
            });
        }, function(){
            $scope.connectionModel[name] = true;
        });
    };

    $scope.toggleConnection = function(name){
        var socialService = $injector.get(name);
        $cache.friends.invalid();
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

    $scope.connectionModel = {};
    for(var type in settings.socials){
        $scope.connectionModel[type] = $scope.isConnected(type);
    }

});
'use strict';

angular.module('app').controller('SettingsCtrl', function($scope, me, $window, $state, Me){

    $scope.meCopy = angular.copy(me);

    $scope.submit = function(){
        $scope.meCopy.$update().then(function(){
            me.login = $scope.meCopy.login;
            me.email = $scope.meCopy.email;
        });
    };

    $scope.disconnect = function(){
        Me.logout().$promise.then(function(){
            $window.localStorage.clear();
            $window.sessionStorage.clear();
            $state.go('auth');
        });
    };

});
'use strict';

angular.module('app').controller('SecretBoxCtrl', function($scope, SecretBox, $mdDialog){

    var isMatch = function(secret){
        return secret.friend.inLove && secret.hasNews && secret.messages && secret.messages.length === 0;
    };

    $scope.close = function() {
        $mdDialog.cancel();
    };
    $scope.markAsRead = function() {
        $mdDialog.hide();
    };

    SecretBox.query().then(function(secretBox){
        secretBox.forEach(function(secret){
            if(secret && isMatch(secret)){
                $scope.matchFriend = secret.friend;
                $mdDialog.show({
                    scope: $scope,
                    controller: 'MatchCtrl',
                    templateUrl: 'src/main/content/secretbox/match/view.html',
                    clickOutsideToClose:true
                }).then(function() {

                }, function() {

                });
            }
        });
        $scope.secretBox = secretBox;
    });

});
'use strict';

angular.module('app').controller('MatchCtrl', function($scope, $mdDialog){

    $scope.close = function() {
        $mdDialog.cancel();
    };
    $scope.markAsRead = function() {
        $mdDialog.hide();
    };

});
'use strict';

angular.module('app').filter('orderByFresh', function() {
    return function( items ) {
        return items.sort(function(a, b){
            var aStamp = a.lastUpdate  / (a.hasNews ? 1 : 1000);
            var bStamp = b.lastUpdate  / (b.hasNews ? 1 : 1000);
            return (aStamp - bStamp) < 0 ? 1 : -1;
        });
    };
});
'use strict';

angular.module('app').controller('DialogCtrl', function(settings,$scope, dialogs, Dialog, SecretBox, $stateParams){

    var initMessage = function(){
        $scope.newMessage = new Dialog();
        console.log($scope.friend);
        $scope.newMessage.to = {
            id: $scope.friend.id,
            type: $scope.friend.type
        };
    };

    SecretBox.query().then(function(secretBox){
        var secretBoxItem = secretBox.filter(function(secretBoxItem){
            return secretBoxItem.friend.id === $stateParams.id && secretBoxItem.friend.type === $stateParams.type;
        })[0];
        if(secretBoxItem){
            $scope.friend = secretBoxItem.friend;
            $scope.dialogs = dialogs;

            initMessage();

            $scope.sendMessage = function(){
                $scope.newMessage.$save().then(function(){
                    $scope.newMessage.when = (new Date()).getTime();
                    $scope.newMessage.me = true;
                    $scope.dialogs.push($scope.newMessage);
                    initMessage();
                });
            };
        }
    });

});
'use strict';

angular.module('app').controller('ShopCtrl', function($scope, me){

    $scope.items = [{
        icon: 'favorite_outline',
        type: 'love',
        nb: 1,
        price: '0.99 USD'
    },{
        icon: 'favorite_outline',
        type: 'love',
        nb: 3,
        price: '2.99 USD'
    },{
        icon: 'favorite_outline',
        type: 'love',
        nb: 10,
        price: '6.99 USD'
    },{
        icon: 'favorite_outline',
        type: 'love',
        nb: 20,
        price: '9.99 USD'
    }];

    $scope.purchase = function(item){
        var initialLoves = me.basket.loves;
        me.basket.loves += item.nb;
        me.$update().then(function(){

        }, function(){
            me.basket.loves = initialLoves;
        });
    };

});
'use strict';

angular.element(document).ready(function() {

    var LoadApplication = function(){

        var KEY = 'application_mode';

        this.isAppStub = function(){
            return sessionStorage.getItem(KEY) === 'appStub';
        };

        this.load = function(){
            if(this.isAppStub()){
                angular.bootstrap(document, ['appStub']);
            }else{
                angular.bootstrap(document, ['app']);
            }
        };

        this.loadAppStub = function(){
            sessionStorage.setItem('application_mode', 'appStub');
            window.location = window.location.href.split(window.location.hash)[0];
        };
        this.loadApp = function(){
            sessionStorage.removeItem('application_mode');
            window.location = window.location.href.split(window.location.hash)[0];
        };
    };

    angular.module('app').service('LoadApplication', LoadApplication);

    var service = new LoadApplication();
    service.load();

});