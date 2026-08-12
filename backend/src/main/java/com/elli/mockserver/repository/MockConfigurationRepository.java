package com.elli.mockserver.repository;

import com.elli.mockserver.model.MockConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MockConfigurationRepository extends JpaRepository<MockConfiguration, String> {

    Page<MockConfiguration> findByExpiresAtBefore(LocalDateTime time, Pageable pageable);
}
