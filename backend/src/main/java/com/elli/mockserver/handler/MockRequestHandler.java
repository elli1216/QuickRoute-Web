package com.elli.mockserver.handler;

import com.elli.mockserver.exception.RouteNotFoundException;
import com.elli.mockserver.model.RouteDefinition;
import com.elli.mockserver.service.MockRegistryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class MockRequestHandler {

    private final MockRegistryService registry;

    public MockRequestHandler(MockRegistryService registry) {
        this.registry = registry;
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void handle(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String requestUri = request.getRequestURI();
        String method = request.getMethod();

        RouteDefinition route = registry.findRoute(requestUri, method);
        if (route == null) {
            throw new RouteNotFoundException(requestUri, method);
        }

        if (route.getDelayMs() > 0) {
            Thread.sleep(route.getDelayMs());
        }

        if (route.getAuthType() != null && route.getAuthType() != com.elli.mockserver.model.AuthType.NONE) {
            boolean authorized = false;
            if (route.getAuthType() == com.elli.mockserver.model.AuthType.BEARER) {
                String authHeader = request.getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    if (token.equals(route.getExpectedToken())) {
                        authorized = true;
                    }
                }
            } else if (route.getAuthType() == com.elli.mockserver.model.AuthType.API_KEY) {
                String apiKey = request.getHeader("X-API-Key");
                if (apiKey != null && apiKey.equals(route.getExpectedToken())) {
                    authorized = true;
                }
            }

            if (!authorized) {
                response.setStatus(401);
                response.setContentType("application/json");
                objectMapper.writeValue(response.getWriter(), Map.of("error", "Unauthorized", "message", "Missing or invalid authentication token."));
                return;
            }
        }

        Map<String, String> pathVars = registry.extractPathVariables(requestUri, route.getPathPattern());
        Object finalBody = substitutePathVars(route.getResponseBody(), pathVars);

        response.setStatus(route.getStatusCode());
        response.setContentType("application/json");
        objectMapper.writeValue(response.getWriter(), finalBody);
    }

    private Object substitutePathVars(Object body, Map<String, String> pathVars) {
        if (body instanceof String text && pathVars != null) {
            for (var entry : pathVars.entrySet()) {
                text = text.replace(":" + entry.getKey(), entry.getValue());
            }
            return text;
        }
        if (body instanceof Map<?, ?> map) {
            Map<String, Object> result = new java.util.LinkedHashMap<>();
            for (var entry : map.entrySet()) {
                String key = entry.getKey().toString();
                Object value = entry.getValue();
                if (pathVars != null && pathVars.containsKey(key)) {
                    value = pathVars.get(key);
                } else {
                    value = substitutePathVars(value, pathVars);
                }
                result.put(key, value);
            }
            return result;
        }
        if (body instanceof java.util.List<?> list) {
            return list.stream()
                    .map(item -> substitutePathVars(item, pathVars))
                    .toList();
        }
        return body;
    }
}
