
var ui = new UI();
var scene = new Scene();
var ws;
var gameState = {};

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
    gameState.gameId = gameId;
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
                console.log('Joined Game with ID ' + gameState.gameId);
                gameState.startPointYou = parseInt(msg[1]);
                gameState.startPointMe = parseInt(msg[2]);
                console.log(gameState);
                ui.showControls();
                break;
            case 'shoot':
            	console.log('receive enemy shot');
            	gameState.otherAngle = msg[2];
            	gameState.otherVelocity = msg[3];
            	if(gameState.angle != undefined) {
            		ui.showCanvas();
            	}
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
	var startPointMe = Math.floor((Math.random()*100)+1);
	var startPointYou = Math.floor((Math.random()*100)+1);
	gameState.startPointMe = startPointMe;
	gameState.startPointYou = startPointYou;
    ws.send("create_game " + startPointMe + " " + startPointYou);
}

function sendJoinGame(gameId) {
    ws.send("join_game " + gameId);
}

function shoot() {
	ws.send("shoot " + gameState.gameId + " " + document.getElementById('angleView').value + " " + document.getElementById('velocityView').value);
	gameState.angle = document.getElementById('angleView').value;
	gameState.velocity = document.getElementById('velocityView').value;
	if(gameState.otherAngle != undefined) {
		ui.showCanvas();
	}
}


