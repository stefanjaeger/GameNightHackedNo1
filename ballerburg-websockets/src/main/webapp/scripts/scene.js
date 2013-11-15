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
	drawTank1();
	drawTank2();
};

drawTank1 = function () {
	var context = canvas.getContext("2d");
	context.rect(20,20,150,100);
	context.stroke();
};

drawTank2 = function () {
	
};