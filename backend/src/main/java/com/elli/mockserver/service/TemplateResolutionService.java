package com.elli.mockserver.service;

import net.datafaker.Faker;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TemplateResolutionService {

    private final Faker faker = new Faker();
    private final Pattern pattern = Pattern.compile("\\{\\{([^}]+)\\}\\}");

    public Object resolveTemplates(Object body) {
        if (body instanceof String text) {
            return resolveString(text);
        }
        if (body instanceof Map<?, ?> map) {
            Map<String, Object> result = new java.util.LinkedHashMap<>();
            for (var entry : map.entrySet()) {
                result.put(entry.getKey().toString(), resolveTemplates(entry.getValue()));
            }
            return result;
        }
        if (body instanceof List<?> list) {
            return list.stream().map(this::resolveTemplates).toList();
        }
        return body;
    }

    private String resolveString(String text) {
        Matcher matcher = pattern.matcher(text);
        StringBuilder sb = new StringBuilder();
        while (matcher.find()) {
            String expression = matcher.group(1).trim();
            String replacement = generateFakerValue(expression);
            matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String generateFakerValue(String expression) {
        try {
            // Convert e.g., "name.firstName" to "#{Name.firstName}" for Datafaker
            String[] parts = expression.split("\\.");
            if (parts.length == 2) {
                String category = parts[0].substring(0, 1).toUpperCase() + parts[0].substring(1);
                String method = parts[1];
                return faker.expression("#{" + category + "." + method + "}");
            }
            return faker.expression("#{" + expression + "}");
        } catch (Exception e) {
            // fallback if it's invalid faker syntax
            return "{{" + expression + "}}";
        }
    }
}
