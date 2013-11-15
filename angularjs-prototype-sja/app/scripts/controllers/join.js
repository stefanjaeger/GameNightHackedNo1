/*global angular */

(function () {
    "use strict";
    angular.module('No.1GamePreviewApp')
        .controller('JoinCtrl', function ($scope, $routeParams, firebaseService) {
            $scope.gameId = $routeParams.gameId;
            $scope.player = ($routeParams.player === 'playerOne' || $routeParams.player === 'playerTwo') ? $routeParams.player : '';

            $scope.join = function (player) {
                $scope.player = (player === 1) ? 'playerOne' : 'playerTwo';
                firebaseService.joinGame($scope.gameId, $scope.player);
            };

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
            $scope.$watch('player + playerOneJoined + playerTwoJoined', function () {
                if ($scope.player === '') {
                    if ($scope.playerOneJoined && $scope.playerTwoJoined) {
                        $scope.playMode = 'gameRunning';
                    } else {
                        $scope.playMode = 'playerJoining';
                    }
                } else {
                    $scope.playMode = 'playerJoined';
                    $scope.playerSpeed = '90';
                    $scope.playerAngle = '45';
                }

            });
            $scope.$watch('playMode', function () {
                if ($scope.playMode === 'playerJoined') {
                    firebaseService.playerPosition($scope.gameId, $scope.player, function (value) {
                        updateScopeDependend(function () {
                            $scope.playerPosition = value;
                        });
                    });
                } else if ($scope.playMode === 'gameRunning') {
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


            $scope.fire = function (shootingPosition, speed, angle) {
                var shootingDirectionLeftToRight = ($scope.player === 'playerOne') ? true : false;

                firebaseService.fire($scope.gameId, {
                    shootingDirectionLeftToRight: shootingDirectionLeftToRight,
                    shootingPosition: shootingPosition,
                    speed: speed,
                    angle: angle
                });
            };
        });
}());
