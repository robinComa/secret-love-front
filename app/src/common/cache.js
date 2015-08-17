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
            $log.info('Cache in error : ');
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