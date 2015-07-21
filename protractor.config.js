exports.config = {

    seleniumAddress: 'http://localhost:4444/wd/hub',

    multiCapabilities: [{
        'browserName': 'chrome'
    }, {
        'browserName': 'firefox'
    }],

    baseUrl: 'http://localhost:8080',

    specs: [
        'test/e2e/*.spec.js'
    ]

};
