'use strict';

angular.module('No.1GamePreviewApp')
    .controller('MainCtrl', function($scope) {
        $scope.playerOnePosition = Math.floor(Math.random() * 100) + 1;
        $scope.playerTwoPosition = Math.floor(Math.random() * 100) + 900;

        $scope.log = [];

        $scope.fire = function(shootingDirectionLeftToRight, shootingPosition, speed, angle) {
            var angleInRad = angle * Math.PI / 180;
            var distance = 2 * Math.pow(speed, 2) * Math.sin(angleInRad) * Math.cos(angleInRad) / 9.81;
            var impact = (shootingDirectionLeftToRight) ? shootingPosition + distance : shootingPosition - distance;
            $scope.log.push('firing from position ' + shootingPosition + 'm, impact at position ' + impact + 'm');

            if (between(impact, $scope.playerOnePosition-1, $scope.playerOnePosition+1)) {
            	$scope.log.push('Player One hit!');
            }
            if (between(impact, $scope.playerTwoPosition-1, $scope.playerTwoPosition+1)) {
            	$scope.log.push('Player Two hit!');
            }
        }

        function between(x, min, max) {
            return x >= min && x <= max;
        }
    });
