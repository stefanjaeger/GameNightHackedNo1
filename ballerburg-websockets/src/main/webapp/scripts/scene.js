var anim = false;
var myShot = true;

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
			if(anim === true && myShot === true){
				gameState.myShotState.x += gameState.myShotState.vx;
				gameState.myShotState.y += gameState.myShotState.vy;
				gameState.myShotState.vy += gameState.myShotState.ay;
				drawShot(gameStae.myShotState);
				if(toY(gameState.myShotState.y < 0)) {
					myShot = false;
				}
			}
			if(anim === true && myShot === false) {
				gameState.myShotState.x += gameState.myShotState.vx;
				gameState.myShotState.y += gameState.myShotState.vy;
				gameState.myShotState.vy += gameState.myShotState.ay;
			}
			draw();
			requestAnimFrame(animloop);
		})();
};

Scene.prototype.draw = function () {
	draw();
};

Scene.prototype.animate = function() {
	anim = true;
};

draw = function() {
	canvas.width = canvas.width;
	if(anim) {
		drawMyShot();
	}
	drawTank1();
	drawTank2();
};

drawShot = function(shotState)  {
	var context = canvas.getContext("2d");
	context.arc(toPixel(parseInt(shotState.x)), toY(shotState.y), 20, 0, 2 * Math.PI, false);
	context.stroke();
};

drawTank1 = function () {
	var context = canvas.getContext("2d");
	context.rect(toPixel(parseInt(gameState.startPointMe)),toY(20),20,20);
	context.stroke();
};

drawTank2 = function () {
	var context = canvas.getContext("2d");
	context.rect(toPixel(parseInt(gameState.startPointYou) + 880),toY(20),20,20);
	context.stroke();
};

toY = function(y) {
	return canvas.height-y;
};

toPixel = function(pos) {
	var base = canvas.width / 1000;
	return pos * base;
};