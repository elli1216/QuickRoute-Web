package com.elli.mockserver.repository;

import com.elli.mockserver.model.RequestLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {
    List<RequestLog> findTop20ByMockIdOrderByTimestampDesc(String mockId);
}
