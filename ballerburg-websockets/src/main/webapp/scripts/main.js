
var ui = new UI();
var scene = new Scene();
var ws;
var gameState;

/* Main entrypoint of ballerburg.js */
function main() {
	ui.resizeCanvas();
	scene.initScene();
	scene.draw();
	
	ui.registerListeners();
	
	connectToServer();
}

function createGame() {
    ui.showCreateGame();
    sendCreateGame();
};

function joinGame() {
    ui.showJoinGame();
};

function joinGameWithGameId() {
    var gameId = document.getElementById('otherGameId').value;
    sendJoinGame(gameId);
}

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
		var msg = event.data.split(" ");
        switch(msg[0])
        {
            case 'token':
                var gameId = msg[1];
                console.log('Created game with ID ' + gameId);
                ui.setGameId(gameId);
                gameState.gameId = gameId;
                break;
            case 'joined':
                console.log('Joined Game with ID ' + msg[1]);
                ui.showControls();
                gameState.gameId = msg[1];
                break;
            default:
                alert('Unknown command ' + msg[0]);
        }
	};
	ws.onclose = function () {
	  	console.log('Info: WebSocket connection closed.');
	};
	window.onclose = function() { ws.close(); };
};

function sendCreateGame() {
    ws.send("create_game");
}

function sendJoinGame(gameId) {
    ws.send("join_game " + gameId);
}

function shoot() {
	ws.send("shoot " + gameState.gameId + document.getElementById('angleView').value + document.getElementById('velocityView').value);
	gameState.angle = document.getElementById('angleView').value;
	gameState.velocity = document.getElementById('velocityView').value;
}
