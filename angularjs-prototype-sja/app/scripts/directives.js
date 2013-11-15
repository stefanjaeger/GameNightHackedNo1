/*global angular, requestAnimationFrame, cancelAnimationFrame, window */

(function () {
    "use strict";

    function addResizeEvent(func) {
        var oldResize = window.onresize;
        window.onresize = function () {
            func();
            if (typeof oldResize === 'function') {
                oldResize();
            }
        };
    }

    angular.module('No.1GamePreviewApp')
        .directive("firing", function () {
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

                    scope.fireCanvas = function (shootingDirectionLeftToRight, startShootingPosition, speed, angle) {
                        // on read out the right width values
                        element[0].getContext('2d').canvas.setAttribute('width', element[0].parentElement.offsetWidth);

                        var start_y = ctx.canvas.height,
                            rad = d2r(angle),
                            circleSize = 10,
                            lastTime = new Date().getTime(),
                            playerOnePos = scope.playerOnePosition / 800 * ctx.canvas.width,
                            playerTwoPos = scope.playerTwoPosition / 800 * ctx.canvas.width,
                            shootingPosition = startShootingPosition / 800 * ctx.canvas.width,
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
                            },
                            draw = function () {
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
                                    if (shootingPosition !== playerOnePos && between(bullet.x, playerOnePos - 10, playerOnePos + 10)) {
                                        scope.$apply(function () {
                                            scope.winner = 'Player One hit! Player Two is the winner!';
                                        });
                                    }
                                    if (shootingPosition !== playerTwoPos && between(bullet.x, playerTwoPos - 10, playerTwoPos + 10)) {
                                        scope.$apply(function () {
                                            scope.winner = 'Player Two hit! Player One is the winner!';
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
                            },
                            resize = function (event) {
                                var ctx = element[0].getContext('2d'),
                                    parentWidth = element[0].parentElement.offsetWidth;
                                ctx.canvas.setAttribute('width', parentWidth);
                                draw();
                            };

                        addResizeEvent(function () {
                            resize();
                        });

                        resize();
                    };

                }
            };
        })
        .directive("startpositions", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    var draw = function () {
                        var ctx = element[0].getContext('2d'),
                            playerOnePos = scope.playerOnePosition / 800 * ctx.canvas.width,
                            playerTwoPos = scope.playerTwoPosition / 800 * ctx.canvas.width;

                        ctx.fillStyle = '#FFB553';
                        ctx.fillRect(playerOnePos - 10, ctx.canvas.height - 10, 20, 10);
                        ctx.fillStyle = '#FA4444';
                        ctx.fillRect(playerTwoPos - 10, ctx.canvas.height - 10, 20, 10);
                    };
                    var resize = function () {
                        var ctx = element[0].getContext('2d'),
                            parentWidth = element[0].parentElement.offsetWidth;
                        ctx.canvas.setAttribute('width', parentWidth);
                        draw();
                    };

                    scope.$watch('playerOnePosition + playerTwoPosition', function () {
                        draw();
                    });

                    addResizeEvent(function () {
                        resize();
                    });

                    resize();
                }
            };
        });
}());
