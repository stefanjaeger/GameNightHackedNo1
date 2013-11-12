/*global angular, console, setInterval, clearInterval */

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

                    // TODO SJA: noch richtig positionieren/zeichnen
                    // http://jsfiddle.net/azWHu/
                    // http://www.panaghia.it/dev/projectile-motion/

                    scope.fireCanvas = function (shootingDirectionLeftToRight, shootingPosition, speed, angle) {
                        var start_y = ctx.canvas.height,
                            rad = d2r(angle),
                            g = 9.81,
                            t = 0,
                            frame_interval = 10,
                            interval,
                            circleSize = 10,
                            distance = 2 * Math.pow(speed, 2) * Math.sin(rad) * Math.cos(rad) / 9.81,
                            impact = (shootingDirectionLeftToRight) ? shootingPosition + distance : shootingPosition - distance;

                        if (between(impact, scope.playerOnePosition - 10, scope.playerOnePosition + 10)) {
                            scope.log.push('Player One hit!');
                        }
                        if (between(impact, scope.playerTwoPosition - 10, scope.playerTwoPosition + 10)) {
                            scope.log.push('Player Two hit!');
                        }

                        function draw() {
                            t = t + frame_interval;

                            t += 50;

                            var cur_t = t / 1000,
                                x = (shootingDirectionLeftToRight) ? shootingPosition + (speed * cur_t * Math.cos(rad)) : shootingPosition - (speed * cur_t * Math.cos(rad)),
                                y = start_y - ((speed * cur_t * Math.sin(rad)) - (0.5 * g * Math.pow(cur_t, 2)));

                            if ((x < -1 * circleSize || x > ctx.canvas.width + circleSize) || (y < -1 * circleSize || y > ctx.canvas.width + circleSize)) {
                                clearInterval(interval);
                            }

                            //console.log('cur_t: ' + cur_t + ', x: ' + x + ', y: ' + y);

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
                        }
                        interval = setInterval(draw, frame_interval);
                    };

                }
            };
        });
}());
