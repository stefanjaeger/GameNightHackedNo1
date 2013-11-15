function Scene() {
	window.requestAnimFrame = (function(){
		  return  window.requestAnimationFrame       ||
		          window.webkitRequestAnimationFrame ||
		          window.mozRequestAnimationFrame    ||
		          function( callback ){
		            window.setTimeout(callback, 1000 / 60);
		          };
		})();
};

Scene.prototype.initScene = function() {
	canvas = document.getElementById("mainCanvas");

	(function animloop(){
		  requestAnimFrame(animloop);
		  draw();
		})();
};

Scene.prototype.draw = function () {
	draw();
};

draw = function() {
	canvas.width = canvas.width;
	drawTank1();
	drawTank2();
};

drawTank1 = function () {
	var context = canvas.getContext("2d");
	context.rect(toPixel(gameState.startPointMe),canvas.height-20,20,20);
	context.stroke();
};

drawTank2 = function () {
	var context = canvas.getContext("2d");
	context.rect(toPixel(gameState.startPointYou+900),canvas.height-20,20,20);
	context.stroke();
};

toPixel = function(pos) {
	var base = canvas.width / 1000;
	return pos * base;
};