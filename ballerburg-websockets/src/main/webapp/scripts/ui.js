function UI() {
};


UI.prototype.registerListeners = function () {
	window.onresize = this.resizeCanvas;

	document.getElementById('angleScroller').onchange = this.createScrollViewUpdater('angleView');
	document.getElementById('velocityScroller').onchange = this.createScrollViewUpdater('velocityView');
};

UI.prototype.createScrollViewUpdater = function (elementId) {
	return function() {
		document.getElementById(elementId).value = this.value;
	};
};

UI.prototype.setGameId = function (gameId) {
	document.getElementById("gameId").innerHTML = gameId;
};


UI.prototype.resizeCanvas = function() {
	var canvas = document.getElementById("mainCanvas");
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
};