/*global angular, Firebase */

(function () {
    "use strict";
    angular.module('No.1GamePreviewApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'monospaced.qrcode'
    ])
        .value('Firebase', Firebase)
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/start.html',
                    controller: 'StartCtrl'
                })
                .when('/join/:gameId', {
                    redirectTo: '/join/:gameId/new'
                })
                .when('/join/:gameId/:player', {
                    templateUrl: 'views/join.html',
                    controller: 'JoinCtrl'
                })
                .when('/old-style', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        });
}());
