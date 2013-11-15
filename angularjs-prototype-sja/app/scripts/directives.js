/*global angular, requestAnimationFrame, cancelAnimationFrame */

(function () {
    "use strict";
    angular.module('No.1GamePreviewApp')
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
