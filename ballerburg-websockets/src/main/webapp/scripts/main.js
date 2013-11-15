
var ui = new UI();
var scene = new Scene();
var ws;

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
                break;
            case 'joined':
                console.log('Joinded Game with ID ' + msg[1]);
                ui.showControls();
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


