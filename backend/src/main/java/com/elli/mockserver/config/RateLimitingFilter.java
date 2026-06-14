package com.elli.mockserver.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Order(1)
public class RateLimitingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    static final int WINDOW_SECONDS = 60;
    static final int MAX_REQUESTS_PER_WINDOW = 60;
    static final int MAX_MOCK_CALLS_PER_WINDOW = 200;

    private final Map<String, RateBucket> buckets = new ConcurrentHashMap<>();

    public RateLimitingFilter() {
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(this::cleanup, 1, 1, TimeUnit.MINUTES);
    }

    void cleanup() {
        long cutoff = System.currentTimeMillis() - (WINDOW_SECONDS * 1000L);
        buckets.entrySet().removeIf(e -> e.getValue().windowStart < cutoff);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String ip = resolveIp(req);
        String path = req.getRequestURI();

        boolean isMockCall = path.matches("/mock/[^/]+/.*");

        int limit = isMockCall ? MAX_MOCK_CALLS_PER_WINDOW : MAX_REQUESTS_PER_WINDOW;

        RateBucket bucket = buckets.computeIfAbsent(ip, k -> new RateBucket());

        if (bucket.isExceeded(limit)) {
            log.warn("Rate limit exceeded for IP {} on path {}", ip, path);
            res.setStatus(429);
            res.setContentType("application/json");
            res.getWriter().write("{\"error\":\"Too many requests. Try again later.\"}");
            return;
        }

        bucket.increment();
        chain.doFilter(request, response);
    }

    private String resolveIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }

    static class RateBucket {
        private final long windowStart = System.currentTimeMillis();
        private final AtomicInteger count = new AtomicInteger(0);

        boolean isExceeded(int limit) {
            long elapsed = System.currentTimeMillis() - windowStart;
            if (elapsed > WINDOW_SECONDS * 1000L) {
                return false;
            }
            return count.get() >= limit;
        }

        void increment() {
            long elapsed = System.currentTimeMillis() - windowStart;
            if (elapsed > WINDOW_SECONDS * 1000L) {
                count.set(0);
            }
            count.incrementAndGet();
        }
    }
}
