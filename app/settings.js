angular.module('app').constant('settings', {
    endpoint: 'rest-api/',
    socials: {
        googlePlus: {
            label: 'connect.label.google-plus',
            auth: {
                clientId: '631974897480.apps.googleusercontent.com',
                redirectUri: window.location.origin + '/',
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
                redirectUri: window.location.origin + '/',
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
                clientId: 'r9e5QZVVUIu3ChTXr1w08fm5T',
                redirectUri: window.location.origin + '/#/friends',
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
                clientId: '463627307038698',
                clientSecret: 'c300b7e8922bfaeb84a84ca01e32245d',
                redirectUri: window.location.origin + '/',
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
                clientId: '77bmx0zg9stbsk',
                clientSecret: 'aryHtzhM2yc9aXeS',
                redirectUri: window.location.origin + '/',
                scope: ['r_basicprofile']
            },
            icon: {
                name: 'linkedin',
                color: '#0177B5'
            }
        }
    }
});