/*global angular */

(function () {
    "use strict";
    angular.module('No.1GamePreviewApp')
        .controller('StartCtrl', function ($scope, $window, firebaseService) {
            $scope.gameId = Math.random().toString(36).substring(7);

            firebaseService.createNewGame($scope.gameId, Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 100) + 700);

            $scope.gameUrl = $window.location.href + 'join/' + $scope.gameId;
        });
}());
