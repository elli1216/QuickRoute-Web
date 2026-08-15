package com.elli.mockserver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class WebConfig {

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfigurationSource source = new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                String method = request.getMethod();
                String uri = request.getRequestURI();
                
                if ("OPTIONS".equalsIgnoreCase(method)) {
                    String requestedMethod = request.getHeader("Access-Control-Request-Method");
                    if (requestedMethod != null) {
                        method = requestedMethod;
                    }
                }

                CorsConfiguration config = new CorsConfiguration();
                config.addAllowedHeader("*");
                config.addAllowedMethod("*");
                
                boolean isMutation = "POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method) || 
                                     "DELETE".equalsIgnoreCase(method) || "PATCH".equalsIgnoreCase(method);
                                     
                // Management endpoints are /mock/upload, /mocks, and /mock/{mockId} (no trailing slash)
                boolean isManagementMutation = isMutation && 
                        (uri.equals("/mock/upload") || uri.equals("/mocks") || uri.matches("^/mock/[^/]+$"));

                if (isManagementMutation) {
                    // Restrict creation/updates/deletes of the mock configs to the frontend
                    config.addAllowedOriginPattern(frontendUrl);
                } else {
                    // Allow public access to all GET requests, AND all mock endpoints (e.g., POST /mock/123/users)
                    config.addAllowedOriginPattern("*");
                }
                
                return config;
            }
        };
        return new CorsFilter(source);
    }
}
