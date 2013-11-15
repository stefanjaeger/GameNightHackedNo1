/*global angular, console, requestAnimationFrame, cancelAnimationFrame */

(function () {
    "use strict";
    angular.module('No.1GamePreviewApp')
        .controller('MainCtrl', function ($scope) {
            // zwischen 1 und 800
            $scope.playerOnePosition = Math.floor(Math.random() * 100) + 1;
            $scope.playerTwoPosition = Math.floor(Math.random() * 100) + 700;

            $scope.playerOneSpeed = 90;
            $scope.playerOneAngle = 45;
            $scope.playerTwoSpeed = 90;
            $scope.playerTwoAngle = 45;

            $scope.log = [];
        })
        .directive("drawingInMain", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    var ctx = element[0].getContext('2d');


                    function d2r(x) {
                        return x * (Math.PI / 180);
                    }

                    function between(x, border1, border2) {
                        if (border1 < border2) {
                            return x >= border1 && x <= border2;
                        }
                        return x >= border2 && x <= border1;
                    }

                    scope.fireCanvas = function (shootingDirectionLeftToRight, shootingPosition, speed, angle) {
                        var start_y = ctx.canvas.height,
                            rad = d2r(angle),
                            circleSize = 10,
                            lastTime = new Date().getTime(),
                            bullet = {
                                x: shootingPosition,
                                nextX: function (deltat) {
                                    return (shootingDirectionLeftToRight) ? this.x + deltat * this.vxi : this.x - deltat * this.vxi;
                                },
                                y: ctx.canvas.height,
                                nextY: function (deltat) {
                                    return bullet.y - deltat * bullet.vyi;
                                },
                                vxi: speed * Math.cos(rad),
                                nextVxi: function (deltat) {
                                    return this.vxi;
                                },
                                vyi: speed * Math.sin(rad),
                                nextVyi: function (deltat) {
                                    return this.vyi + deltat * -9.81;
                                }
                            };

                        function draw() {
                            var id = requestAnimationFrame(draw),
                                now = new Date().getTime(),
                                deltat = (now - lastTime) / 1000 + 100 / 1000;

                            lastTime = now;

                            ctx.clearRect(bullet.x - circleSize - 5, bullet.y - circleSize - 5, circleSize * 2 + 10, circleSize * 2 + 10);

                            bullet.x = bullet.nextX(deltat);
                            bullet.y = bullet.nextY(deltat);
                            bullet.vxi = bullet.nextVxi(deltat);
                            bullet.vyi = bullet.nextVyi(deltat);

                            if (between(bullet.y, ctx.canvas.height, (ctx.canvas.height - 10))) {
                                if (shootingPosition !== scope.playerOnePosition && between(bullet.x, scope.playerOnePosition - 10, scope.playerOnePosition + 10)) {
                                    scope.$apply(function () {
                                        scope.log.push('Player One hit!');
                                    });
                                }
                                if (shootingPosition !== scope.playerTwoPosition && between(bullet.x, scope.playerTwoPosition - 10, scope.playerTwoPosition + 10)) {
                                    scope.$apply(function () {
                                        scope.log.push('Player Two hit!');
                                    });
                                }
                            }

                            ctx.beginPath();
                            ctx.arc(bullet.x, bullet.y, circleSize, 0, Math.PI * 2, true);
                            ctx.fillStyle = '#4D5361';
                            ctx.closePath();

                            ctx.fill();

                            if ((bullet.x < -1 * circleSize || bullet.x > ctx.canvas.width + circleSize) || (bullet.y < -1 * circleSize || bullet.y > ctx.canvas.width + circleSize)) {
                                cancelAnimationFrame(id);
                            }
                        }
                        draw();
                    };

                }
            };
        })
        .directive("startpositionsInMain", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    var ctx = element[0].getContext('2d');
                    ctx.fillStyle = '#FFB553';
                    ctx.fillRect(scope.playerOnePosition - 10, ctx.canvas.height - 10, 20, 10);
                    ctx.fillStyle = '#FA4444';
                    ctx.fillRect(scope.playerTwoPosition - 10, ctx.canvas.height - 10, 20, 10);
                }
            };
        });
}());
