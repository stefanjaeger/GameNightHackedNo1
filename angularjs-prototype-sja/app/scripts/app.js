/*global angular */

(function () {
    "use strict";
    angular.module('No.1GamePreviewApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize'
    ])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        });
}());
