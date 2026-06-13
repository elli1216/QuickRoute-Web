package com.elli.mockserver.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mock_configurations")
public class MockConfiguration {

    @Id
    private String id;

    @OneToMany(mappedBy = "mock", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RouteDefinition> routes = new ArrayList<>();

    private LocalDateTime createdAt;

    public MockConfiguration() {
    }

    public MockConfiguration(String id, List<RouteDefinition> routes) {
        this.id = id;
        this.routes = routes;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<RouteDefinition> getRoutes() {
        return routes;
    }

    public void setRoutes(List<RouteDefinition> routes) {
        this.routes = routes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void addRoute(RouteDefinition route) {
        routes.add(route);
        route.setMock(this);
    }

    public void removeRoute(RouteDefinition route) {
        routes.remove(route);
        route.setMock(null);
    }
}
