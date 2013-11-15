
var ui = new UI();
var scene = new Scene();

/* Main entrypoint of ballerburg.js */
function main() {
	ui.resizeCanvas();
	scene.initScene();
	scene.draw();
	
	ui.registerListeners();
	ui.setGameId("ASDF");
	
	connectToServer();
}

function createGame() {
	document.getElementById('welcomeScreen').className = 'hidden';
	document.getElementById('createScreen').className = 'full-overlay';
};

function joinGame() {
	document.getElementById('welcomeScreen').className = 'hidden';
	document.getElementById('joinScreen').className = 'full-overlay';
};

function connectToServer() {
	var target = "ws://"+window.location.host+window.location.pathname+"websocket/echo";
	console.log(target);
	if ('WebSocket' in window) {
		ws = new WebSocket(target);
	} else if ('MozWebSocket' in window) {
		ws = new MozWebSocket(target);
	} else {
		alert('WebSocket is not supported by this browser.');
	}
	ws.onopen = function () {
		console.log('Info: WebSocket connection opened.');
	};
	ws.onmessage = function (event) {
		console.log('Received: ' + event.data);
	};
	ws.onclose = function () {
	  	console.log('Info: WebSocket connection closed.');
	};
	window.onclose = function() { ws.close(); };
};



