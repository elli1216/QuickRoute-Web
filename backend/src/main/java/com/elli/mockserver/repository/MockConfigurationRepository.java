package com.elli.mockserver.repository;

import com.elli.mockserver.model.MockConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MockConfigurationRepository extends JpaRepository<MockConfiguration, String> {
}
