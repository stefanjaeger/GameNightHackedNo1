package com.zuehlke.ballerburg.game;

import javax.websocket.Session;

public class Game {
	private final String token;
	private Session playerA;
	private Session playerB;
	
	public Game(String token, Session player) {
        this.playerA = player;
		this.token = token;
	}
	
	public Session getPlayerA() {
		return playerA;
	}

	public void setPlayerA(Session playerA) {
		this.playerA = playerA;
	}

	public Session getPlayerB() {
		return playerB;
	}

	public void setPlayerB(Session playerB) {
		this.playerB = playerB;
	}

	public String getToken() {
		return token;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((token == null) ? 0 : token.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Game other = (Game) obj;
		if (token == null) {
			if (other.token != null)
				return false;
		} else if (!token.equals(other.token))
			return false;
		return true;
	}
	
	
}
