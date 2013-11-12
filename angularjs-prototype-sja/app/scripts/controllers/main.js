/*global angular, console, setInterval */

(function () {
    "use strict";
    angular.module('No.1GamePreviewApp')
        .controller('MainCtrl', function ($scope) {
            $scope.playerOnePosition = Math.floor(Math.random() * 100) + 1;
            $scope.playerTwoPosition = Math.floor(Math.random() * 100) + 900;

            $scope.log = [];

            $scope.fire = function (shootingDirectionLeftToRight, shootingPosition, speed, angle) {
                var angleInRad = angle * Math.PI / 180,
                    distance = 2 * Math.pow(speed, 2) * Math.sin(angleInRad) * Math.cos(angleInRad) / 9.81,
                    impact = (shootingDirectionLeftToRight) ? shootingPosition + distance : shootingPosition - distance;
                $scope.log.push('firing from position ' + shootingPosition + 'm, impact at position ' + impact + 'm');

                function between(x, min, max) {
                    return x >= min && x <= max;
                }

                if (between(impact, $scope.playerOnePosition - 1, $scope.playerOnePosition + 1)) {
                    $scope.log.push('Player One hit!');
                }
                if (between(impact, $scope.playerTwoPosition - 1, $scope.playerTwoPosition + 1)) {
                    $scope.log.push('Player Two hit!');
                }
            };
        })
        .directive("drawing", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    var ctx = element[0].getContext('2d'),
                        start_x = 20,
                        start_y = 400,
                        v = 96,
                        angle = 45,
                        g = 9.81,
                        t = 0,
                        frame_interval = 10;


                    function r2d(x) {
                        return x / (Math.PI / 180);
                    }

                    // TODO SJA: noch richtig positionieren/zeichnen
                    // http://jsfiddle.net/azWHu/
                    // http://www.panaghia.it/dev/projectile-motion/

                    function draw() {
                        t = t + frame_interval;
                        var cur_t = t / 1000,
                            x = start_x - (v * cur_t * Math.cos(r2d(angle))),
                            y = start_y - ((v * cur_t * Math.sin(r2d(angle))) - (0.5 * g * Math.pow(cur_t, 2)));

                        console.log('x: ' + x + ', y: ' + y);

                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                        ctx.beginPath();
                        ctx.arc(x, y, 10, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.fill();
                    }
                    setInterval(draw, frame_interval);

                    // TODO wenn ausserhalb Canvas Berechnungen stoppen

                }
            };
        });
}());
