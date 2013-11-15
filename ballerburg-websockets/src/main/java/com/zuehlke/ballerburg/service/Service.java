package com.zuehlke.ballerburg.service;

import java.util.logging.Logger;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.zuehlke.ballerburg.game.Game;
import com.zuehlke.ballerburg.game.GameServer;

@ServerEndpoint(value = "/websocket/echo")
public class Service {
	private Logger logger = Logger.getLogger(this.getClass().getName());
	private GameServer server = GameServer.getInstance();
	
	public Service() {
		logger.info("Service started");
		logger.info("Service started");
	}
	
	@OnOpen
	public void onOpen(Session session) {
		logger.info("Connected ... " + session.getId());
	}

	@OnMessage
	public String onMessage(String message, Session session) {
		String[] msg = message.split(" ");
		String code = msg[0];
		switch(code) {
		case "create_game":
			logger.info(String.format("Creating game %s", message));
			return "token " + server.createGame(session).getToken();
		case "join_game":
			logger.info(String.format("Joining game %s", message));
			final String joinToken = msg[1];
			Game g = server.getGameForToken(joinToken);
			g.setPlayerB(session);
			return "joined";
		case "shoot":
			final String shootToken = msg[1];
			final boolean isA = "A".equals(msg[2]);
			
			Game game = server.getGameForToken(shootToken);
			if(isA) {
				game.getPlayerB().getAsyncRemote().sendText(message);
			} else {
				game.getPlayerA().getAsyncRemote().sendText(message);
			}
			break;
		default:
			logger.info(String.format("Unknown message received %s", code));
		}
		return message;
	}

	@OnClose
	public void onClose(Session session, CloseReason closeReason) {
		logger.info(String.format("Session %s closed because of %s",
				session.getId(), closeReason));
	}
}
