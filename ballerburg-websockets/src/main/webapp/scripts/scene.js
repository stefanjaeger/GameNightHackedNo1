var anim = false;
var myShot = true;
var ended = false;
var win = false;
var gameDraw = false;

function Scene() {
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.mozRequestAnimationFrame || function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
	})();
};

Scene.prototype.initScene = function() {
	canvas = document.getElementById("mainCanvas");
	(function animloop() {
		if (anim === true && myShot === true) {
			gameState.myShotState.x += gameState.myShotState.vx;
			gameState.myShotState.y += gameState.myShotState.vy;
			gameState.myShotState.vy += gameState.myShotState.ay;
			console.log("myshot");
			if (toY(gameState.myShotState.y) >= canvas.height) {
				myShot = false;
				console.log(gameState.startPointYou + 880 - gameState.myShotState.x);
				if ((gameState.startPointYou + 880 - gameState.myShotState.x <= 80)
						&& (gameState.startPointYou +880 - gameState.myShotState.x >= -80)) {
					console.log("FINISHED");
					ended = true;
					win = true;
				}
			}
		}
		if (anim === true && myShot === false) {
			gameState.youShotState.x -= gameState.youShotState.vx;
			gameState.youShotState.y += gameState.youShotState.vy;
			gameState.youShotState.vy += gameState.youShotState.ay;
			console.log("yourshot");
			if (toY(gameState.youShotState.y) >= canvas.height) {
				console.log(gameState.startPointMe - gameState.youShotState.x);
				if ((gameState.startPointMe - gameState.youShotState.x <= 80)
						&& (gameState.startPointMe - gameState.youShotState.x >= -80)) {
					console.log("FINISHED");
					if (ended) {
						gameDraw = true;
					}
					ended = true;
				}

				myShot = true;
				anim = false;
				calculateThings();
			}
		}
		draw();
		requestAnimFrame(animloop);
	})();
};

Scene.prototype.draw = function() {
	draw();
};

Scene.prototype.animate = function() {
	anim = true;
};

draw = function() {
	canvas.width = canvas.width;
	if (anim) {
		switch (myShot) {
		case true:
			drawMyShot(gameState.myShotState);
			break;
		case false:
			drawYourShot(gameState.youShotState);
			break;
		}
	}
	drawTank1();
	drawTank2();
};

drawMyShot = function(shotState) {
	var context = canvas.getContext("2d");
	context.arc(toPixel(parseInt(shotState.x)), toY(shotState.y), 20, 0,
			2 * Math.PI, false);
	context.stroke();
};

drawYourShot = function(shotState) {
	var context = canvas.getContext("2d");
	context.arc(toPixel(parseInt(shotState.x)), toY(shotState.y), 20, 0,
			2 * Math.PI, false);
	context.stroke();
};

drawTank1 = function() {
	var context = canvas.getContext("2d");
	context.rect(toPixel(parseInt(gameState.startPointMe)), toY(20), 20, 20);
	context.stroke();
};

drawTank2 = function() {
	var context = canvas.getContext("2d");
	context.rect(toPixel(parseInt(gameState.startPointYou) + 880), toY(20), 20,
			20);
	context.stroke();
};

toY = function(y) {
	return canvas.height - y;
};

toPixel = function(pos) {
	var base = canvas.width / 1000;
	return pos * base;
};

calculateThings = function() {
	if (ended) {
		if (gameDraw) {
			ui.showDrawScreen();
		} else {
			if (win) {
				ui.showWinningScreen();
			} else {
				ui.showLosingScreen();
			}
		}
	} else {
		gameState.angle = null;
		gameState.otherAngle = null;
		ui.showControls();
	}
};