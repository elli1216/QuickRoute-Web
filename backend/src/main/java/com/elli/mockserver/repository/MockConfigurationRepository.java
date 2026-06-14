package com.elli.mockserver.repository;

import com.elli.mockserver.model.MockConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MockConfigurationRepository extends JpaRepository<MockConfiguration, String> {

    List<MockConfiguration> findByExpiresAtBefore(LocalDateTime time);
}
