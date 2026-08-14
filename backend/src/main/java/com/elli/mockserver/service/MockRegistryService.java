package com.elli.mockserver.service;

import com.elli.mockserver.model.MockConfiguration;
import com.elli.mockserver.model.RouteDefinition;
import com.elli.mockserver.repository.MockConfigurationRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MockRegistryService {

    private final MockConfigurationRepository mockRepo;
    private final DynamicRouteRegistrar routeRegistrar;
    private final RouteMatcherService routeMatcherService;
    private final CacheManager cacheManager;
    private final StatisticsService statisticsService;
    private final com.elli.mockserver.repository.RequestLogRepository requestLogRepository;

    public MockRegistryService(MockConfigurationRepository mockRepo,
            @Lazy DynamicRouteRegistrar routeRegistrar,
            RouteMatcherService routeMatcherService,
            CacheManager cacheManager,
            StatisticsService statisticsService,
            com.elli.mockserver.repository.RequestLogRepository requestLogRepository) {
        this.mockRepo = mockRepo;
        this.routeRegistrar = routeRegistrar;
        this.routeMatcherService = routeMatcherService;
        this.cacheManager = cacheManager;
        this.statisticsService = statisticsService;
        this.requestLogRepository = requestLogRepository;
    }

    @Transactional
    public void registerMock(String mockId, List<RouteDefinition> routes, int expiresInHours) {
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(expiresInHours);
        MockConfiguration mock = new MockConfiguration(mockId, routes, expiresAt);
        for (RouteDefinition route : routes) {
            route.setMock(mock);
        }
        mockRepo.save(mock);
        statisticsService.incrementMocksCreated();
    }

    @Transactional
    @CacheEvict(value = "mocks", key = "#mockId")
    public void removeMock(String mockId) {
        requestLogRepository.deleteByMockId(mockId);
        mockRepo.deleteById(mockId);
    }

    @Transactional(readOnly = true)
    public List<RouteDefinition> getRoutes(String mockId) {
        MockConfiguration mock = getMock(mockId);
        if (mock != null) {
            return mock.getRoutes();
        }
        return List.of();
    }

    @Transactional(readOnly = true)
    public RouteDefinition findRoute(String requestUri, String method) {
        String mockId = routeMatcherService.extractMockId(requestUri);
        if (mockId == null)
            return null;

        MockConfiguration mock = getMock(mockId);
        if (mock == null)
            return null;

        String relativePath = routeMatcherService.extractRelativePath(requestUri, mockId);

        for (RouteDefinition route : mock.getRoutes()) {
            if (route.getMethod().equalsIgnoreCase(method) &&
                    routeMatcherService.matchesPath(route.getPathPattern(), relativePath)) {
                return route;
            }
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Map<String, String> extractPathVariables(String requestUri, String pathPattern) {
        String mockId = routeMatcherService.extractMockId(requestUri);
        if (mockId == null)
            return Map.of();

        String relativePath = routeMatcherService.extractRelativePath(requestUri, mockId);
        return routeMatcherService.extractPathVariables(relativePath, pathPattern);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "mocks", key = "#mockId")
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
        int pageSize = 100;
        Pageable pageable = PageRequest.of(0, pageSize);
        Page<MockConfiguration> page;

        do {
            page = mockRepo.findByExpiresAtBefore(LocalDateTime.now(), pageable);
            for (MockConfiguration mock : page.getContent()) {
                for (RouteDefinition route : mock.getRoutes()) {
                    routeRegistrar.unregisterRoute(mock.getId(), route);
                }

                var cache = cacheManager.getCache("mocks");
                if (cache != null) {
                    cache.evict(mock.getId());
                }

                requestLogRepository.deleteByMockId(mock.getId());
                mockRepo.delete(mock);
            }
        } while (page.hasNext());
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
}
