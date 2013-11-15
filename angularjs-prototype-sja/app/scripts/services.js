/*global angular */

(function () {
    "use strict";
    angular.module('No.1GamePreviewApp')
        .factory('firebaseService', function (Firebase) {
            var baseUrl = 'https://stevie.firebaseio.com/';
            return {
                createNewGame: function (gameId, playerOnePosition, playerTwoPosition) {
                    var gameRef = new Firebase(baseUrl + gameId);
                    gameRef.child('playerOnePosition').set(playerOnePosition);
                    gameRef.child('playerTwoPosition').set(playerTwoPosition);
                },
                joinGame: function (gameId, player) {
                    var gameRef = new Firebase(baseUrl + gameId),
                        joined = gameRef.child('joined');
                    joined.push(player);
                },
                observeJoinedForPlayer: function (gameId, player, callback) {
                    var gameRef = new Firebase(baseUrl + gameId),
                        joined = gameRef.child('joined');
                    joined.on('child_added', function (data) {
                        if (data.val() === player) {
                            callback();
                        }
                    });
                },
                playerPosition: function (gameId, player, callback) {
                    var gameRef = new Firebase(baseUrl + gameId);
                    if (player === 'playerOne') {
                        gameRef.child('playerOnePosition').once('value', function (data) {
                            callback(data.val());
                        });
                    } else {
                        gameRef.child('playerTwoPosition').once('value', function (data) {
                            callback(data.val());
                        });
                    }
                },
                fire: function (gameId, data) {
                    var gameRef = new Firebase(baseUrl + gameId);
                    gameRef.child('log').push().set(data);
                },
                observeGame: function (gameId, callback) {
                    var gameRef = new Firebase(baseUrl + gameId);
                    gameRef.child('log').on('child_added', function (data) {
                        callback(data.val());
                    });
                }
            };
        });
}());
