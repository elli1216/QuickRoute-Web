package com.elli.mockserver.service;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class TemplateResolutionServiceTest {
    private final TemplateResolutionService service = new TemplateResolutionService();

    @Test
    void testResolveQueryParameters() {
        Map<String, String[]> queryParams = new HashMap<>();
        queryParams.put("search", new String[]{"hello"});
        queryParams.put("page", new String[]{"2"});

        String input = "Looking for {{query.search}} on page {{query.page}}.";
        Object result = service.resolveTemplates(input, queryParams);

        assertEquals("Looking for hello on page 2.", result);
    }

    @Test
    void testResolveMissingQueryParameters() {
        Map<String, String[]> queryParams = new HashMap<>();
        // No query params provided

        String input = "Empty: {{query.missing}}";
        Object result = service.resolveTemplates(input, queryParams);

        assertEquals("Empty: ", result); // Should replace with empty string
    }

    @Test
    void testResolveFakerValue() {
        String input = "My name is {{name.firstName}}.";
        Object result = service.resolveTemplates(input, null);
        
        assertTrue(result instanceof String);
        String text = (String) result;
        assertFalse(text.contains("{{name.firstName}}")); // Should be replaced
        assertTrue(text.startsWith("My name is "));
    }

    @Test
    void testResolveComplexMap() {
        Map<String, Object> body = new HashMap<>();
        body.put("username", "{{name.username}}");
        body.put("filter", "{{query.q}}");

        Map<String, String[]> queryParams = new HashMap<>();
        queryParams.put("q", new String[]{"active"});

        Object result = service.resolveTemplates(body, queryParams);
        
        assertTrue(result instanceof Map);
        Map<?, ?> resultMap = (Map<?, ?>) result;
        
        assertFalse(resultMap.get("username").toString().contains("{{"));
        assertEquals("active", resultMap.get("filter"));
    }
}
