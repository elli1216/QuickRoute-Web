package com.elli.mockserver.handler;

import com.elli.mockserver.model.MockConfiguration;
import com.elli.mockserver.model.RouteDefinition;
import com.elli.mockserver.repository.RequestLogRepository;
import com.elli.mockserver.service.MockRegistryService;
import com.elli.mockserver.service.StatisticsService;
import com.elli.mockserver.service.TemplateResolutionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MockRequestHandlerTest {

    @Mock
    private MockRegistryService registry;

    @Mock
    private TemplateResolutionService templateService;

    @Mock
    private StatisticsService statisticsService;

    @Mock
    private RequestLogRepository requestLogRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    private MockRequestHandler handler;

    @BeforeEach
    void setUp() {
        handler = new MockRequestHandler(registry, templateService, statisticsService, requestLogRepository);
    }

    @Test
    void testArrayGenerationAndPagination() throws Exception {
        // Arrange
        String mockUri = "/api/items";
        String method = "GET";
        
        when(request.getRequestURI()).thenReturn(mockUri);
        when(request.getMethod()).thenReturn(method);
        
        // Mock query params for page=2, limit=2
        when(request.getParameter("page")).thenReturn("2");
        when(request.getParameter("limit")).thenReturn("2");
        when(request.getParameter("offset")).thenReturn(null);
        
        // Setup route with array count = 5
        RouteDefinition route = new RouteDefinition();
        route.setPathPattern("/api/items");
        route.setMethod("GET");
        route.setStatusCode(200);
        route.setGenerateArrayCount(5);
        route.setResponseBody("Item"); // Base body is just "Item"
        
        MockConfiguration mockConfig = new MockConfiguration();
        mockConfig.setId("mock-123");
        route.setMock(mockConfig);
        
        when(registry.findRoute(mockUri, method)).thenReturn(route);
        when(registry.extractPathVariables(mockUri, "/api/items")).thenReturn(Collections.emptyMap());
        
        // TemplateService mock
        // Expecting a list of 5 "Item"s to be passed in
        when(templateService.resolveTemplates(any(), any())).thenAnswer(invocation -> invocation.getArgument(0));

        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);

        // Act
        handler.handle(request, response);

        // Assert
        verify(response).setStatus(200);
        
        // The output should be sliced: 5 items total, page 2 limit 2 means items index 2 and 3.
        // So size should be 2.
        String jsonResponse = stringWriter.toString();
        assertEquals("[\"Item\",\"Item\"]", jsonResponse);
    }

    @Test
    void testPaginationWithOffset() throws Exception {
        // Arrange
        String mockUri = "/api/items";
        String method = "GET";
        
        when(request.getRequestURI()).thenReturn(mockUri);
        when(request.getMethod()).thenReturn(method);
        
        when(request.getParameter("page")).thenReturn(null);
        when(request.getParameter("limit")).thenReturn("3");
        when(request.getParameter("offset")).thenReturn("4");
        
        RouteDefinition route = new RouteDefinition();
        route.setPathPattern("/api/items");
        route.setMethod("GET");
        route.setStatusCode(200);
        route.setGenerateArrayCount(10);
        route.setResponseBody("Data");
        
        MockConfiguration mockConfig = new MockConfiguration();
        mockConfig.setId("mock-123");
        route.setMock(mockConfig);
        
        when(registry.findRoute(mockUri, method)).thenReturn(route);
        when(templateService.resolveTemplates(any(), any())).thenAnswer(invocation -> invocation.getArgument(0));

        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);

        // Act
        handler.handle(request, response);

        // Assert
        String jsonResponse = stringWriter.toString();
        // offset=4, limit=3 on 10 items -> index 4, 5, 6
        assertEquals("[\"Data\",\"Data\",\"Data\"]", jsonResponse);
    }
}
