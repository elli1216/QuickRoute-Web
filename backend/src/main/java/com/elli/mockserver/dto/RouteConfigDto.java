package com.elli.mockserver.dto;

public class RouteConfigDto {

    private Integer status;
    private Integer delay;
    private Object body;
    private String authType;
    private String expectedToken;
    private String description;
    private java.util.Map<String, String> headers;

    public RouteConfigDto() {
    }

    public RouteConfigDto(Integer status, Integer delay, Object body) {
        this.status = status;
        this.delay = delay;
        this.body = body;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getDelay() {
        return delay;
    }

    public void setDelay(Integer delay) {
        this.delay = delay;
    }

    public Object getBody() {
        return body;
    }

    public void setBody(Object body) {
        this.body = body;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public java.util.Map<String, String> getHeaders() {
        return headers;
    }

    public void setHeaders(java.util.Map<String, String> headers) {
        this.headers = headers;
    }
}
