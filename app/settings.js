'use strict';

(function(){
    var origin = window.location.href.split(window.location.hash)[0];

    angular.module('app').constant('settings', {
        endpoint: 'http://secret-love-back-dev.elasticbeanstalk.com/rest-api/',
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
