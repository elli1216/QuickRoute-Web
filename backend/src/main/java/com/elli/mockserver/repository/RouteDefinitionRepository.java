package com.elli.mockserver.repository;

import com.elli.mockserver.model.RouteDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteDefinitionRepository extends JpaRepository<RouteDefinition, Long> {
    List<RouteDefinition> findByMockId(String mockId);
}
