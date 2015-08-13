angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("src/main/main.html","<md-toolbar layout=\"row\">\r\n    <div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"end start\">\r\n        <md-button ng-click=\"toggleSidenav(\'left\')\" hide-gt-sm aria-label=\"{{\'common.toogle.label\' | translate}}\">\r\n            <md-tooltip>\r\n                {{\'common.toogle.label\' | translate}}\r\n            </md-tooltip>\r\n            <ng-md-icon icon=\"view_headline\" size=\"30\"></ng-md-icon>\r\n        </md-button>\r\n        <h1 flex=\"50\">{{\'common.navbar.title\' | translate}}</h1>\r\n        <p class=\"login\">{{login}}</p>\r\n    </div>\r\n</md-toolbar>\r\n<section layout=\"row\" flex>\r\n    <md-sidenav ui-view=\"sidenav\" layout=\"column\" class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"left\" md-is-locked-open=\"$mdMedia(\'gt-sm\')\"></md-sidenav>\r\n    <div layout=\"column\" id=\"content\" layout-fill>\r\n        <md-content ui-view=\"content\" layout=\"column\" flex></md-content>\r\n    </div>\r\n</section>");
$templateCache.put("src/main/sidenav/view.html","<md-content>\r\n    <md-list>\r\n        <md-list-item ng-repeat=\"entry in entries\">\r\n            <md-button class=\"md-primary\" ui-sref=\"{{entry.uiSref}}\" aria-label=\"{{entry.label | translate}}\">\r\n                {{entry.label | translate}}\r\n                <ng-md-icon icon=\"{{entry.icon}}\" size=\"30\"></ng-md-icon>\r\n            </md-button>\r\n        </md-list-item>\r\n    </md-list>\r\n\r\n    <div class=\"socialCarousel\" layout=\"row\" layout-align=\"center end\">\r\n        <ng-md-icon icon=\"{{selectedIcon.name}}\" style=\"fill: {{selectedIcon.color}}\" size=\"50\" options=\"{{option}}\"></ng-md-icon>\r\n    </div>\r\n</md-content>");
$templateCache.put("src/main/content/connect/view.html","<md-grid-list\r\n    md-cols-sm=\"1\"\r\n    md-cols-md=\"1\"\r\n    md-cols-lg=\"3\"\r\n    md-cols-gt-lg=\"4\"\r\n    md-row-height=\"3:4\"\r\n>\r\n    <md-grid-tile ng-repeat=\"(type, connection) in connections\">\r\n        <md-whiteframe class=\"md-whiteframe-z2\" layout=\"column\" layout-align=\"center center\">\r\n            <ng-md-icon icon=\"{{connection.icon.name}}\" style=\"fill: {{connection.icon.color}}\" size=\"200\"></ng-md-icon>\r\n            <md-button\r\n                    class=\"md-raised\"\r\n                    ng-class=\"{\'md-primary\': !isConnected(type)}\"\r\n                    aria-label=\"{{connection.label | translate}}\"\r\n                    ng-disabled=\"isNotImplemented(type)\"\r\n                    ng-click=\"connectToogle($event, type)\">\r\n                <h3 ng-if=\"!isNotImplemented(type) && isConnected(type)\">{{\'connect.is.connected\' | translate}}</h3>\r\n                <h3 ng-if=\"!isNotImplemented(type) && !isConnected(type)\">{{\'connect.is.not.connected\' | translate}}</h3>\r\n                <h3 ng-if=\"isNotImplemented(type)\">{{\'connect.is.not.implemented\' | translate}}</h3>\r\n            </md-button>\r\n        </md-whiteframe>\r\n    </md-grid-tile>\r\n</md-grid-list>");
$templateCache.put("src/main/content/friends/view.html","<md-card>\r\n    <md-card-content>\r\n\r\n        <md-list>\r\n\r\n            <md-list-item ng-repeat=\"friend in friends | filter:filter.search | filter:{type:filter.social} | orderBy:\'name\' track by $index\" ng-click=\"toogleLove(friend)\">\r\n                <img ng-src=\"{{friend.picture}}\" class=\"md-avatar\" alt=\"{{friend.name}}\"/>\r\n                <p>\r\n                    <ng-md-icon flex=\"10\" icon=\"{{getSocialIcon(friend.type).name}}\" ng-style=\"{fill: getSocialIcon(friend.type).color}\" size=\"20\"></ng-md-icon>\r\n                    {{ friend.name }}\r\n                </p>\r\n                <ng-md-icon flex=\"10\" icon=\"{{getLoveIcon(friend)}}\" style=\"fill: pink\" size=\"40\"></ng-md-icon>\r\n            </md-list-item>\r\n\r\n            <md-list-item></md-list-item>\r\n            <md-list-item></md-list-item>\r\n            <md-list-item></md-list-item>\r\n\r\n        </md-list>\r\n\r\n    </md-card-content>\r\n</md-card>\r\n\r\n<md-button class=\"md-fab filter-btn\" aria-label=\"{{\'friends.filter.button\' | translate}}\" ng-click=\"showFilter($event)\">\r\n    <p><strong>{{(friends | filter:filter.search | filter:{type:filter.social}).length}}</strong></p>\r\n    <ng-md-icon icon=\"filter_list\" ng-style=\"{fill: \'white\'}\" size=\"30\"></ng-md-icon>\r\n</md-button>");
$templateCache.put("src/main/content/settings/view.html","<form md-content layout-padding class=\"autoScroll\" name=\"settingsForm\" ng-submit=\"submit()\">\r\n    <md-input-container>\r\n        <label>{{\'settings.login.placeholder\' | translate}}</label>\r\n        <input ng-model=\"me.login\" name=\"login\" type=\"text\" required/>\r\n        <ng-md-icon icon=\"account_circle\" size=\"50\"></ng-md-icon>\r\n        <div ng-messages=\"settingsForm.login.$error\">\r\n            <div ng-message=\"required\">{{\'settings.login.error.required\' | translate}}</div>\r\n        </div>\r\n    </md-input-container>\r\n    <md-input-container>\r\n        <label>{{\'settings.email.placeholder\' | translate}}</label>\r\n        <input ng-model=\"me.email\" name=\"email\" type=\"email\" required/>\r\n        <ng-md-icon icon=\"mail\" size=\"50\"></ng-md-icon>\r\n        <div ng-messages=\"settingsForm.email.$error\">\r\n            <div ng-message=\"required\">{{\'settings.email.error.required\' | translate}}</div>\r\n            <div ng-message=\"email\">{{\'settings.email.error.email\' | translate}}</div>\r\n        </div>\r\n    </md-input-container>\r\n\r\n    <div layout=\"row\" layout-align=\"end start\">\r\n        <md-button type=\"submit\" class=\"md-raised\">{{\'settings.form.submit.label\' | translate}}</md-button>\r\n    </div>\r\n\r\n</form>");
$templateCache.put("src/main/content/friends/filter/view.html","<md-dialog aria-label=\"Mango (Fruit)\">\r\n    <form name=\"filterForm\" ng-submit=\"submit(filter)\">\r\n        <md-dialog-content>\r\n\r\n            <md-input-container>\r\n                <label>{{\'friends.filter.name.label\' | translate}}</label>\r\n                <input ng-model=\"filter.search\" type=\"text\"/>\r\n            </md-input-container>\r\n\r\n            <md-radio-group ng-model=\"filter.social\" layout=\"column\" layout-align=\"center center\">\r\n                <md-radio-button ng-repeat=\"(key, social) in socials\" ng-value=\"key\" aria-label=\"{{social.label | translate}}\">\r\n                    <ng-md-icon icon=\"{{social.icon.name}}\" ng-style=\"{fill: social.icon.color}\" size=\"30\"></ng-md-icon>\r\n                </md-radio-button>\r\n            </md-radio-group>\r\n\r\n        </md-dialog-content>\r\n\r\n        <div class=\"md-actions\" layout=\"row\">\r\n            <span flex></span>\r\n            <md-button type=\"button\" class=\"md-raised\" ng-click=\"cancel()\">\r\n                {{\'friends.list.filter.dialog.cancel\' | translate}}\r\n            </md-button>\r\n            <md-button class=\"md-raised md-primary\">\r\n                {{\'friends.list.filter.dialog.submit\' | translate}}\r\n            </md-button>\r\n        </div>\r\n    </form>\r\n</md-dialog>");}]);