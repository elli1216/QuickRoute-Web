package com.elli.mockserver.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "route_definitions")
public class RouteDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mock_id")
    @JsonIgnore
    private MockConfiguration mock;

    private String method;

    private String pathPattern;

    @Column(columnDefinition = "TEXT")
    private Object responseBody;

    private int delayMs;

    private int statusCode;

    public RouteDefinition() {
        this.delayMs = 0;
        this.statusCode = 200;
    }

    public RouteDefinition(String method, String pathPattern, Object responseBody, int delayMs, int statusCode) {
        this.method = method;
        this.pathPattern = pathPattern;
        this.responseBody = responseBody;
        this.delayMs = delayMs;
        this.statusCode = statusCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MockConfiguration getMock() {
        return mock;
    }

    public void setMock(MockConfiguration mock) {
        this.mock = mock;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getPathPattern() {
        return pathPattern;
    }

    public void setPathPattern(String pathPattern) {
        this.pathPattern = pathPattern;
    }

    public Object getResponseBody() {
        return responseBody;
    }

    public void setResponseBody(Object responseBody) {
        this.responseBody = responseBody;
    }

    public int getDelayMs() {
        return delayMs;
    }

    public void setDelayMs(int delayMs) {
        this.delayMs = delayMs;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }
}
