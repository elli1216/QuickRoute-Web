package com.elli.mockserver.controller;

import com.elli.mockserver.dto.RouteConfigDto;
import com.elli.mockserver.model.MockConfiguration;
import com.elli.mockserver.model.RouteDefinition;
import com.elli.mockserver.service.DynamicRouteRegistrar;
import com.elli.mockserver.service.MockRegistryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MockManagementController.class)
class MockManagementControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockitoBean
        private DynamicRouteRegistrar routeRegistrar;

        @MockitoBean
        private MockRegistryService registry;

        @MockitoBean
        private com.elli.mockserver.repository.RequestLogRepository requestLogRepository;

        @Test
        void testUploadMock() throws Exception {
                Map<String, RouteConfigDto> requestBody = Map.of(
                                "GET /test", new RouteConfigDto(200, 100, "{\"msg\":\"ok\"}"));

                doNothing().when(routeRegistrar).registerRoute(anyString(),
                                org.mockito.ArgumentMatchers.any(RouteDefinition.class));
                doNothing().when(registry).registerMock(anyString(), anyList(), anyInt());

                mockMvc.perform(post("/mock/upload")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.mockId").exists());
        }

        @Test
        void testUploadMockInvalidFormat() throws Exception {
                Map<String, RouteConfigDto> requestBody = Map.of(
                                "GET_test", new RouteConfigDto(200, 100, "{\"msg\":\"ok\"}"));

                mockMvc.perform(post("/mock/upload")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                                .andExpect(status().isBadRequest()); // Handled by GlobalExceptionHandler
        }

        @Test
        void testGetMockSuccess() throws Exception {
                String mockId = "test-mock";
                MockConfiguration mockConfig = new MockConfiguration(mockId, List.of(),
                                LocalDateTime.now().plusHours(1));
                when(registry.getMock(mockId)).thenReturn(mockConfig);

                mockMvc.perform(get("/mock/{mockId}", mockId))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(mockId));
        }

        @Test
        void testGetMockNotFound() throws Exception {
                String mockId = "unknown-mock";
                when(registry.getMock(mockId)).thenReturn(null);

                mockMvc.perform(get("/mock/{mockId}", mockId))
                                .andExpect(status().isNotFound()); // MockNotFoundException
        }

        @Test
        void testListMocks() throws Exception {
                String mockId = "test-mock";
                MockConfiguration mockConfig = new MockConfiguration(mockId, List.of(),
                                LocalDateTime.now().plusHours(1));

                when(registry.getMockIds()).thenReturn(Set.of(mockId));
                when(registry.getMock(mockId)).thenReturn(mockConfig);

                mockMvc.perform(get("/mocks"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.['test-mock'].id").value(mockId));
        }

        @Test
        void testDeleteMock() throws Exception {
                String mockId = "test-mock";
                when(registry.getRoutes(mockId)).thenReturn(List.of(new RouteDefinition()));
                doNothing().when(routeRegistrar).unregisterRoute(anyString(),
                                org.mockito.ArgumentMatchers.any(RouteDefinition.class));
                doNothing().when(registry).removeMock(mockId);

                mockMvc.perform(delete("/mock/{mockId}", mockId))
                                .andExpect(status().isNoContent());
        }

        @Test
        void testUploadMockWithHeadersAndDescription() throws Exception {
                RouteConfigDto route = new RouteConfigDto(201, 50, "{\"id\":1}");
                route.setDescription("Create user endpoint");
                route.setHeaders(Map.of("X-Custom-Header", "CustomValue", "Cache-Control", "no-cache"));

                Map<String, RouteConfigDto> requestBody = Map.of("POST /api/users", route);

                doNothing().when(routeRegistrar).registerRoute(anyString(),
                                org.mockito.ArgumentMatchers.any(RouteDefinition.class));
                doNothing().when(registry).registerMock(anyString(), anyList(), anyInt());

                mockMvc.perform(post("/mock/upload")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.mockId").exists());
        }

        @Test
        void testUploadMockInvalidStatusCode() throws Exception {
                RouteConfigDto route = new RouteConfigDto(99, 0, "{}");
                Map<String, RouteConfigDto> requestBody = Map.of("GET /invalid-status", route);

                mockMvc.perform(post("/mock/upload")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void testUploadMockCrlfHeaderInjection() throws Exception {
                RouteConfigDto route = new RouteConfigDto(200, 0, "{}");
                route.setHeaders(Map.of("X-Bad-Header\r\nInjected", "value"));
                Map<String, RouteConfigDto> requestBody = Map.of("GET /bad-header", route);

                mockMvc.perform(post("/mock/upload")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                                .andExpect(status().isBadRequest());
        }
}
