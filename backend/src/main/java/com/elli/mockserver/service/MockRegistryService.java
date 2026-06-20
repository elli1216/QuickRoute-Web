package com.elli.mockserver.service;

import com.elli.mockserver.model.MockConfiguration;
import com.elli.mockserver.model.RouteDefinition;
import com.elli.mockserver.repository.MockConfigurationRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class MockRegistryService {

    private final MockConfigurationRepository mockRepo;

    private final DynamicRouteRegistrar routeRegistrar;

    public MockRegistryService(MockConfigurationRepository mockRepo, @Lazy DynamicRouteRegistrar routeRegistrar) {
        this.mockRepo = mockRepo;
        this.routeRegistrar = routeRegistrar;
    }

    @Transactional
    public void registerMock(String mockId, List<RouteDefinition> routes, int expiresInHours) {
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(expiresInHours);
        MockConfiguration mock = new MockConfiguration(mockId, routes, expiresAt);
        for (RouteDefinition route : routes) {
            route.setMock(mock);
        }
        mockRepo.save(mock);
    }

    @Transactional
    public void removeMock(String mockId) {
        mockRepo.deleteById(mockId);
    }

    @Transactional(readOnly = true)
    public List<RouteDefinition> getRoutes(String mockId) {
        return mockRepo.findById(mockId)
                .map(MockConfiguration::getRoutes)
                .orElse(List.of());
    }

    @Transactional(readOnly = true)
    public RouteDefinition findRoute(String requestUri, String method) {
        String mockId = extractMockId(requestUri);
        if (mockId == null)
            return null;

        Optional<MockConfiguration> opt = mockRepo.findById(mockId);
        if (opt.isEmpty())
            return null;

        String relativePath = extractRelativePath(requestUri, mockId);

        for (RouteDefinition route : opt.get().getRoutes()) {
            if (route.getMethod().equalsIgnoreCase(method) && matchesPath(route.getPathPattern(), relativePath)) {
                return route;
            }
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Map<String, String> extractPathVariables(String requestUri, String pathPattern) {
        Map<String, String> vars = new LinkedHashMap<>();
        String mockId = extractMockId(requestUri);
        if (mockId == null)
            return vars;

        String relativePath = extractRelativePath(requestUri, mockId);
        Pattern pattern = buildPattern(pathPattern);
        Matcher matcher = pattern.matcher(relativePath);

        if (matcher.matches()) {
            List<String> varNames = extractVarNames(pathPattern);
            for (int i = 0; i < varNames.size(); i++) {
                vars.put(varNames.get(i), matcher.group(i + 1));
            }
        }
        return vars;
    }

    @Transactional(readOnly = true)
    public MockConfiguration getMock(String mockId) {
        return mockRepo.findById(mockId).orElse(null);
    }

    @Transactional(readOnly = true)
    public Set<String> getMockIds() {
        return mockRepo.findAll().stream()
                .map(MockConfiguration::getId)
                .collect(Collectors.toSet());
    }

    @Scheduled(cron = "0 0 */6 * * *")
    @Transactional
    public void cleanupExpiredMocks() {
        List<MockConfiguration> expired = mockRepo.findByExpiresAtBefore(LocalDateTime.now());
        for (MockConfiguration mock : expired) {
            for (RouteDefinition route : mock.getRoutes()) {
                routeRegistrar.unregisterRoute(mock.getId(), route);
            }
            mockRepo.delete(mock);
        }
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional(readOnly = true)
    public void reRegisterRoutesOnStartup() {
        List<MockConfiguration> mocks = mockRepo.findAll();
        for (MockConfiguration mock : mocks) {
            for (RouteDefinition route : mock.getRoutes()) {
                routeRegistrar.registerRoute(mock.getId(), route);
            }
        }
    }

    private String extractMockId(String uri) {
        String[] parts = uri.replaceFirst("^/", "").split("/");
        if (parts.length > 1 && "mock".equals(parts[0])) {
            return parts[1];
        }
        return null;
    }

    private String extractRelativePath(String uri, String mockId) {
        String prefix = "/mock/" + mockId;
        String relative = uri.substring(prefix.length());
        return relative.isEmpty() ? "/" : relative;
    }

    private boolean matchesPath(String pattern, String requestPath) {
        return buildPattern(pattern).matcher(requestPath).matches();
    }

    private Pattern buildPattern(String pathPattern) {
        String regex = Arrays.stream(pathPattern.split("/"))
                .map(segment -> segment.startsWith(":") ? "([^/]+)" : Pattern.quote(segment))
                .reduce((a, b) -> a + "/" + b)
                .orElse("");
        return Pattern.compile("^" + regex + "$");
    }

    private List<String> extractVarNames(String pathPattern) {
        return Arrays.stream(pathPattern.split("/"))
                .filter(segment -> segment.startsWith(":"))
                .map(segment -> segment.substring(1))
                .toList();
    }
}
