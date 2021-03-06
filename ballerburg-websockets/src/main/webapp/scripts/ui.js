function UI() {
};

UI.prototype.registerListeners = function() {
	window.onresize = this.resizeCanvas;

	document.getElementById('angleScroller').onchange = this
			.createScrollViewUpdater('angleView');
	document.getElementById('velocityScroller').onchange = this
			.createScrollViewUpdater('velocityView');
};

UI.prototype.createScrollViewUpdater = function(elementId) {
	return function() {
		document.getElementById(elementId).value = this.value;
	};
};

UI.prototype.setGameId = function(gameId) {
	document.getElementById("gameId").innerHTML = gameId;
};

UI.prototype.showCanvas = function() {
	document.getElementById('controls').className = 'hidden';
	gameState.myShotState = {
		'x' : parseInt(gameState.startPointMe),
		'y' : 1,
		'vx' : gameState.velocity / 5.0
				* Math.cos(gameState.angle * Math.PI / 180),
		'vy' : gameState.velocity / 5.0
				* Math.sin(gameState.angle * Math.PI / 180),
		'ay' : -0.000981 * 100
	};
	gameState.youShotState = {
		'x' : parseInt(gameState.startPointYou)+880,
		'y' : 1,
		'vx' : gameState.otherVelocity / 5.0
				* Math.cos(gameState.otherAngle * Math.PI / 180),
		'vy' : gameState.otherVelocity / 5.0
				* Math.sin(gameState.otherAngle * Math.PI / 180),
		'ay' : -0.000981 * 100
	};
	scene.animate();
	scene.initScene();
};

UI.prototype.resizeCanvas = function() {
	var canvas = document.getElementById("mainCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

UI.prototype.showCreateGame = function() {
	document.getElementById('welcomeScreen').className = 'hidden';
	document.getElementById('createScreen').className = 'full-overlay';
};

UI.prototype.showJoinGame = function() {
	document.getElementById('welcomeScreen').className = 'hidden';
	document.getElementById('joinScreen').className = 'full-overlay';
};

UI.prototype.showControls = function() {
	document.getElementById('welcomeScreen').className = 'hidden';
	document.getElementById('joinScreen').className = 'hidden';
	document.getElementById('createScreen').className = 'hidden';
	document.getElementById('controls').className = 'full-overlay';
};

UI.prototype.showWinningScreen = function() {
	document.getElementById('controls').className = 'hidden';
	document.getElementById('winningScreen').className = 'full-overlay';
};

UI.prototype.showLosingScreen = function() {
	document.getElementById('controls').className = 'hidden';
	document.getElementById('losingScreen').className = 'full-overlay';
};

UI.prototype.showDrawScreen = function() {
	document.getElementById('controls').className = 'hidden';
	document.getElementById('drawScreen').className = 'full-overlay';
};