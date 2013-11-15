/*global angular */

(function () {
    "use strict";
    angular.module('No.1GamePreviewApp')
        .controller('StartCtrl', function ($scope, $window, firebaseService) {
            $scope.gameId = Math.random().toString(36).substring(7);

            firebaseService.createNewGame($scope.gameId, Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 100) + 700);

            $scope.gameUrl = $window.location.href + 'join/' + $scope.gameId;


            var updateScopeDependend = function (callback) {
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        callback();
                    });
                } else {
                    callback();
                }
            };

            $scope.playerOneJoined = false;
            firebaseService.observeJoinedForPlayer($scope.gameId, 'playerOne', function () {
                updateScopeDependend(function () {
                    $scope.playerOneJoined = true;
                });
            });

            $scope.playerTwoJoined = false;
            firebaseService.observeJoinedForPlayer($scope.gameId, 'playerTwo', function () {
                updateScopeDependend(function () {
                    $scope.playerTwoJoined = true;
                });
            });


            $scope.playMode = 'playerJoining';
            $scope.$watch('playerOneJoined + playerTwoJoined', function () {
                if ($scope.playerOneJoined && $scope.playerTwoJoined) {
                    $scope.playMode = 'gameRunning';
                    firebaseService.playerPosition($scope.gameId, 'playerOne', function (value) {
                        updateScopeDependend(function () {
                            $scope.playerOnePosition = value;
                        });
                    });
                    firebaseService.playerPosition($scope.gameId, 'playerTwo', function (value) {
                        updateScopeDependend(function () {
                            $scope.playerTwoPosition = value;
                        });
                    });
                    firebaseService.observeGame($scope.gameId, function (data) {
                        $scope.fireCanvas(data.shootingDirectionLeftToRight, data.shootingPosition, data.speed, data.angle);
                    });
                }
            });
        });
}());
