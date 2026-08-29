package com.elli.mockserver.controller;

import com.elli.mockserver.dto.MockSummaryDto;
import com.elli.mockserver.dto.MockUploadResponse;
import com.elli.mockserver.dto.RouteConfigDto;
import com.elli.mockserver.dto.RouteResponseDto;
import com.elli.mockserver.exception.MockNotFoundException;
import com.elli.mockserver.exception.MockUploadException;
import com.elli.mockserver.model.MockConfiguration;
import com.elli.mockserver.model.RouteDefinition;
import com.elli.mockserver.service.DynamicRouteRegistrar;
import com.elli.mockserver.service.MockRegistryService;
import com.elli.mockserver.repository.RequestLogRepository;
import com.elli.mockserver.model.RequestLog;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class MockManagementController {

    private final DynamicRouteRegistrar routeRegistrar;
    private final MockRegistryService registry;
    private final RequestLogRepository requestLogRepository;

    public MockManagementController(DynamicRouteRegistrar routeRegistrar, MockRegistryService registry, RequestLogRepository requestLogRepository) {
        this.routeRegistrar = routeRegistrar;
        this.registry = registry;
        this.requestLogRepository = requestLogRepository;
    }

    @GetMapping("/mock/{mockId}/logs")
    public ResponseEntity<List<RequestLog>> getMockLogs(@PathVariable String mockId) {
        List<RequestLog> logs = requestLogRepository.findTop20ByMockIdOrderByTimestampDesc(mockId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/mock/upload")
    public ResponseEntity<MockUploadResponse> uploadMock(
            @RequestBody Map<String, RouteConfigDto> definition,
            @RequestParam(defaultValue = "168") int expiresInHours) {
        String mockId = UUID.randomUUID().toString();
        List<RouteDefinition> routes = parseDefinition(definition);

        routes.forEach(route -> routeRegistrar.registerRoute(mockId, route));
        registry.registerMock(mockId, routes, expiresInHours);

        return ResponseEntity.ok(new MockUploadResponse(mockId));
    }

    @GetMapping("/mocks")
    public ResponseEntity<Map<String, MockSummaryDto>> listMocks() {
        Map<String, MockSummaryDto> result = new LinkedHashMap<>();
        for (String id : registry.getMockIds()) {
            MockConfiguration config = registry.getMock(id);
            if (config == null)
                continue;
            result.put(id, new MockSummaryDto(
                    config.getId(),
                    config.getRoutes().size(),
                    config.getCreatedAt(),
                    config.getExpiresAt(),
                    config.getRoutes().stream()
                            .map(r -> new RouteResponseDto(
                                    r.getMethod(),
                                    r.getPathPattern(),
                                    r.getStatusCode(),
                                    r.getDelayMs(),
                                    r.getResponseBody(),
                                    r.getAuthType() != null ? r.getAuthType().name() : null,
                                    r.getExpectedToken(),
                                    r.getDescription(),
                                    r.getResponseHeaders()))
                            .toList()));
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/mock/{mockId}")
    public ResponseEntity<MockSummaryDto> getMock(@PathVariable String mockId) {
        MockConfiguration config = registry.getMock(mockId);
        if (config == null) {
            throw new MockNotFoundException(mockId);
        }
        return ResponseEntity.ok(new MockSummaryDto(
                config.getId(),
                config.getRoutes().size(),
                config.getCreatedAt(),
                config.getExpiresAt(),
                config.getRoutes().stream()
                        .map(r -> new RouteResponseDto(
                                r.getMethod(),
                                r.getPathPattern(),
                                r.getStatusCode(),
                                r.getDelayMs(),
                                r.getResponseBody(),
                                r.getAuthType() != null ? r.getAuthType().name() : null,
                                r.getExpectedToken(),
                                r.getDescription(),
                                r.getResponseHeaders()))
                        .toList()));
    }

    private List<RouteDefinition> parseDefinition(Map<String, RouteConfigDto> definition) {
        List<RouteDefinition> routes = new ArrayList<>();
        for (var entry : definition.entrySet()) {
            String key = entry.getKey();
            String[] parts = key.split(" ", 2);
            if (parts.length != 2) {
                throw new MockUploadException("Invalid route key: " + key + " — expected format: METHOD /path");
            }

            String method = parts[0].toUpperCase();
            String path = parts[1];
            
            if (path.length() > 255) {
                throw new MockUploadException("Path pattern too long (max 255 characters): " + path);
            }
            
            RouteConfigDto config = entry.getValue();

            RouteDefinition route = new RouteDefinition();
            route.setMethod(method);
            route.setPathPattern(path);

            if (config.getStatus() != null) {
                if (config.getStatus() < 100 || config.getStatus() > 599) {
                    throw new MockUploadException("Status code must be between 100 and 599 (got " + config.getStatus() + ")");
                }
                route.setStatusCode(config.getStatus());
            }
            if (config.getDelay() != null) {
                if (config.getDelay() < 0 || config.getDelay() > 60000) {
                    throw new MockUploadException("Delay must be between 0 and 60000 ms (got " + config.getDelay() + ")");
                }
                route.setDelayMs(config.getDelay());
            }
            route.setResponseBody(config.getBody());

            if (config.getDescription() != null) {
                String desc = config.getDescription().trim();
                if (desc.length() > 500) {
                    throw new MockUploadException("Route description too long (max 500 characters)");
                }
                route.setDescription(desc.isEmpty() ? null : desc);
            }

            if (config.getHeaders() != null && !config.getHeaders().isEmpty()) {
                Map<String, String> sanitizedHeaders = new LinkedHashMap<>();
                for (var headerEntry : config.getHeaders().entrySet()) {
                    String headerName = headerEntry.getKey();
                    String headerValue = headerEntry.getValue();
                    if (headerName != null && !headerName.trim().isEmpty() && headerValue != null) {
                        if (headerName.contains("\r") || headerName.contains("\n") ||
                            headerValue.contains("\r") || headerValue.contains("\n")) {
                            throw new MockUploadException("CRLF injection detected in header: " + headerName);
                        }
                        sanitizedHeaders.put(headerName.trim(), headerValue.trim());
                    }
                }
                route.setResponseHeaders(sanitizedHeaders.isEmpty() ? null : sanitizedHeaders);
            }

            if (config.getAuthType() != null) {
                try {
                    route.setAuthType(com.elli.mockserver.model.AuthType.valueOf(config.getAuthType().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    route.setAuthType(com.elli.mockserver.model.AuthType.NONE);
                }
            }
            route.setExpectedToken(config.getExpectedToken());

            routes.add(route);
        }
        return routes;
    }

    @GetMapping("/ping")
    public ResponseEntity<String> keepBackendAlive() {
        return ResponseEntity.ok("Server is pinged.");
    }

}
