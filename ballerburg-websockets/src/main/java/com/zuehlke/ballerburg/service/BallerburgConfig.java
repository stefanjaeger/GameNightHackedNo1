package com.zuehlke.ballerburg.service;

import java.util.HashSet;
import java.util.Set;

import javax.websocket.Endpoint;
import javax.websocket.server.ServerApplicationConfig;
import javax.websocket.server.ServerEndpointConfig;

public class BallerburgConfig implements ServerApplicationConfig {

	@Override
	public Set<Class<?>> getAnnotatedEndpointClasses(Set<Class<?>> scanned) {
		Set<Class<?>> results = new HashSet<Class<?>>();
		for (Class<?> clazz : scanned) {
			if (clazz.getPackage().getName().startsWith("com.zuehlke.ballerburg.service")) {
				results.add(clazz);
			}
		}
		return results;
	}

	@Override
	public Set<ServerEndpointConfig> getEndpointConfigs(
			Set<Class<? extends Endpoint>> scanned) {
		return new HashSet<ServerEndpointConfig>();
	}

}
