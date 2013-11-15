package com.zuehlke.ballerburg.game;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class GameServer {
	private static final GameServer INSTANCE = new GameServer();
	private AtomicInteger currentToken = new AtomicInteger();
	
	private Map<String,Game> games = new ConcurrentHashMap<>();
	
	private GameServer() {	
	}
	
	public Game getGameForToken(String token) {
		return games.get(token);
	}
	
	public Game createGame() {
		return new Game(generateToken());
	}
	
	private String generateToken() {
		return String.valueOf(currentToken.incrementAndGet());
	}
	
	public static synchronized GameServer getInstance() {
		return INSTANCE;
	}
}
