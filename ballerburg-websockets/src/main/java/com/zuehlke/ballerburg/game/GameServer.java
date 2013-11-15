package com.zuehlke.ballerburg.game;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import javax.websocket.Session;

public class GameServer {
	private static final GameServer INSTANCE = new GameServer();
	private AtomicInteger currentToken = new AtomicInteger();
	
	private Map<String,Game> games = new ConcurrentHashMap<>();
	
	private GameServer() {	
	}
	
	public Game getGameForToken(String token) {
		return games.get(token);
	}
	
	public Game createGame(Session playerA) {
		Game g = new Game(generateToken(), playerA);
		games.put(g.getToken(), g);
		return g;
	}
	
	private String generateToken() {
		return String.valueOf(currentToken.incrementAndGet());
	}
	
	public static synchronized GameServer getInstance() {
		return INSTANCE;
	}
}
