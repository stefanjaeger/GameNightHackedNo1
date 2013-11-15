/*global angular, requestAnimationFrame, cancelAnimationFrame */

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
        })
        .directive("drawing", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    var ctx = element[0].getContext('2d');


                    function d2r(x) {
                        return x * (Math.PI / 180);
                    }

                    function between(x, min, max) {
                        return x >= min && x <= max;
                    }

                    scope.fireCanvas = function (shootingDirectionLeftToRight, shootingPosition, speed, angle) {
                        var start_y = ctx.canvas.height,
                            rad = d2r(angle),
                            g = 9.81,
                            startTime = new Date().getTime(),
                            numberOfRedraws = 0,
                            interval,
                            circleSize = 10,
                            distance = 2 * Math.pow(speed, 2) * Math.sin(rad) * Math.cos(rad) / 9.81,
                            impact = (shootingDirectionLeftToRight) ? shootingPosition + distance : shootingPosition - distance;

                        if (between(impact, scope.playerOnePosition - 10, scope.playerOnePosition + 10)) {
                            scope.$apply(function () {
                                scope.winner = 'Player One hit! Player Two is the winner!';
                            });
                        }
                        if (between(impact, scope.playerTwoPosition - 10, scope.playerTwoPosition + 10)) {
                            scope.$apply(function () {
                                scope.winner = 'Player Two hit! Player One is the winner!';
                            });
                        }

                        function draw() {
                            var id = requestAnimationFrame(draw),
                                t = new Date().getTime() - startTime + 150 * numberOfRedraws,
                                currentTime = t / 1000,
                                x = (shootingDirectionLeftToRight) ? shootingPosition + (speed * currentTime * Math.cos(rad)) : shootingPosition - (speed * currentTime * Math.cos(rad)),
                                y = start_y - ((speed * currentTime * Math.sin(rad)) - (0.5 * g * Math.pow(currentTime, 2)));

                            if ((x < -1 * circleSize || x > ctx.canvas.width + circleSize) || (y < -1 * circleSize || y > ctx.canvas.width + circleSize)) {
                                cancelAnimationFrame(id);
                            }

                            //console.log('cur_t: ' + currentTime + ', x: ' + x + ', y: ' + y);
                            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                            ctx.fillStyle = '#FFB553';
                            ctx.fillRect(scope.playerOnePosition - 10, ctx.canvas.height - 10, 20, 10);
                            ctx.fillStyle = '#FA4444';
                            ctx.fillRect(scope.playerTwoPosition - 10, ctx.canvas.height - 10, 20, 10);
                            ctx.beginPath();
                            ctx.arc(x, y, circleSize, 0, Math.PI * 2, true);
                            ctx.fillStyle = '#4D5361';
                            ctx.closePath();
                            ctx.fill();

                            numberOfRedraws = numberOfRedraws + 1;
                        }
                        draw();
                    };

                }
            };
        });
}());
