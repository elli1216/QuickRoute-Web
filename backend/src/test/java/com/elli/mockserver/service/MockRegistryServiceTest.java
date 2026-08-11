package com.elli.mockserver.service;

import com.elli.mockserver.model.MockConfiguration;
import com.elli.mockserver.model.RouteDefinition;
import com.elli.mockserver.repository.MockConfigurationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MockRegistryServiceTest {

    @Mock
    private MockConfigurationRepository mockRepo;

    @Mock
    private DynamicRouteRegistrar routeRegistrar;

    @InjectMocks
    private MockRegistryService mockRegistryService;

    private MockConfiguration mockConfiguration;
    private RouteDefinition routeDefinition;

    @BeforeEach
    void setUp() {
        routeDefinition = new RouteDefinition("GET", "/users/:id", "{\"name\":\"Test\"}", 0, 200);
        mockConfiguration = new MockConfiguration("test-mock-id", List.of(routeDefinition), LocalDateTime.now().plusHours(1));
        routeDefinition.setMock(mockConfiguration);
    }

    @Test
    void testRegisterMock() {
        mockRegistryService.registerMock("test-mock-id", List.of(routeDefinition), 24);

        ArgumentCaptor<MockConfiguration> captor = ArgumentCaptor.forClass(MockConfiguration.class);
        verify(mockRepo).save(captor.capture());

        MockConfiguration savedMock = captor.getValue();
        assertEquals("test-mock-id", savedMock.getId());
        assertEquals(1, savedMock.getRoutes().size());
        assertEquals(savedMock, savedMock.getRoutes().get(0).getMock());
    }

    @Test
    void testFindRoute_Success() {
        when(mockRepo.findById("test-mock-id")).thenReturn(Optional.of(mockConfiguration));

        RouteDefinition result = mockRegistryService.findRoute("/mock/test-mock-id/users/123", "GET");

        assertNotNull(result);
        assertEquals("/users/:id", result.getPathPattern());
    }

    @Test
    void testFindRoute_NotFound() {
        when(mockRepo.findById("test-mock-id")).thenReturn(Optional.of(mockConfiguration));

        RouteDefinition result = mockRegistryService.findRoute("/mock/test-mock-id/users/123/profile", "GET");

        assertNull(result);
    }
    
    @Test
    void testFindRoute_MethodMismatch() {
        when(mockRepo.findById("test-mock-id")).thenReturn(Optional.of(mockConfiguration));

        RouteDefinition result = mockRegistryService.findRoute("/mock/test-mock-id/users/123", "POST");

        assertNull(result);
    }

    @Test
    void testExtractPathVariables() {
        Map<String, String> vars = mockRegistryService.extractPathVariables("/mock/test-mock-id/users/123", "/users/:id");
        
        assertEquals(1, vars.size());
        assertEquals("123", vars.get("id"));
    }

    @Test
    void testCleanupExpiredMocks() {
        MockConfiguration expiredMock = new MockConfiguration("expired-id", List.of(routeDefinition), LocalDateTime.now().minusHours(1));
        when(mockRepo.findByExpiresAtBefore(any(LocalDateTime.class))).thenReturn(List.of(expiredMock));

        mockRegistryService.cleanupExpiredMocks();

        verify(routeRegistrar).unregisterRoute(eq("expired-id"), eq(routeDefinition));
        verify(mockRepo).delete(expiredMock);
    }
}
