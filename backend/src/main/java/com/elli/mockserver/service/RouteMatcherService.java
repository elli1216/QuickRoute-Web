package com.elli.mockserver.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class RouteMatcherService {
    public String extractMockId(String uri) {
        String[] parts = uri.replaceFirst("^/", "").split("/");
        if (parts.length > 1 && "mock".equals(parts[0])) {
            return parts[1];
        }
        return null;
    }

    public String extractRelativePath(String uri, String mockId) {
        String prefix = "/mock/" + mockId;
        String relative = uri.substring(prefix.length());
        return relative.isEmpty() ? "/" : relative;
    }

    public boolean matchesPath(String pattern, String requestPath) {
        return buildPattern(pattern).matcher(requestPath).matches();
    }

    public Map<String, String> extractPathVariables(String relativePath, String pathPattern) {
        Map<String, String> vars = new LinkedHashMap<>();
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
