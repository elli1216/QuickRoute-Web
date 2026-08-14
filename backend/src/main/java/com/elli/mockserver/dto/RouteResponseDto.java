package com.elli.mockserver.dto;

public class RouteResponseDto {

    private String method;
    private String pathPattern;
    private int statusCode;
    private int delayMs;
    private Object responseBody;
    private String authType;
    private String expectedToken;

    public RouteResponseDto() {
    }

    public RouteResponseDto(String method, String pathPattern, int statusCode, int delayMs, Object responseBody, String authType, String expectedToken) {
        this.method = method;
        this.pathPattern = pathPattern;
        this.statusCode = statusCode;
        this.delayMs = delayMs;
        this.responseBody = responseBody;
        this.authType = authType;
        this.expectedToken = expectedToken;
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

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public int getDelayMs() {
        return delayMs;
    }

    public void setDelayMs(int delayMs) {
        this.delayMs = delayMs;
    }

    public Object getResponseBody() {
        return responseBody;
    }

    public void setResponseBody(Object responseBody) {
        this.responseBody = responseBody;
    }

    public String getAuthType() {
        return authType;
    }

    public void setAuthType(String authType) {
        this.authType = authType;
    }

    public String getExpectedToken() {
        return expectedToken;
    }

    public void setExpectedToken(String expectedToken) {
        this.expectedToken = expectedToken;
    }
}
