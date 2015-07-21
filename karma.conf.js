// Karma configuration
// Generated on Wed Jul 08 2015 12:17:25 GMT+0200 (Paris, Madrid (heure d’été))

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'app/bower_components/angular/angular.js',
        'app/bower_components/leaflet/dist/leaflet.js',
        'app/bower_components/svg-morpheus/compile/unminified/svg-morpheus.js',
        'app/bower_components/angular-ui-router/release/angular-ui-router.js',
        'app/bower_components/angular-translate/angular-translate.js',
        'app/bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js',
        'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        'app/bower_components/angular-translate-loader-url/angular-translate-loader-url.js',
        'app/bower_components/angular-animate/angular-animate.js',
        'app/bower_components/angular-aria/angular-aria.js',
        'app/bower_components/angular-resource/angular-resource.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/angular-material/angular-material.js',
        'app/bower_components/angular-material-icons/angular-material-icons.js',
        'app/bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.js',

        'app/app.js',
        'app/appStub.js',
        'app/settings.js',

        'app/src/**/*.js',

        'test/unit/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
