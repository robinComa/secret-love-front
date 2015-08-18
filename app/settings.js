'use strict';

(function(){
    var origin = window.location.href.split(window.location.hash)[0];

    angular.module('app').constant('settings', {
        endpoint: 'rest-api/',
        toast: {
            hideDelay: 3000,
            position: 'top left'
        },
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
                    clientSecret: 'tWwdJUrW4bnKsfkhXzKpzYw03LYKFZiu3fn2ePA18l2unk6DNN',
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