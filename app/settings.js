angular.module('app').constant('settings', {
    endpoint: 'rest-api/',
    socials: {
        googlePlus: {
            label: 'connect.label.google-plus',
            auth: {
                clientId: '631974897480.apps.googleusercontent.com',
                redirectUri: 'http://localhost:9000/',
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
                redirectUri: 'http://localhost:9000/',
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
                redirectUri: 'http://localhost:9000/#/friends',
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