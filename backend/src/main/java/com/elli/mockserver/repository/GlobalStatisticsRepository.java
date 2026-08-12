package com.elli.mockserver.repository;

import com.elli.mockserver.model.GlobalStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface GlobalStatisticsRepository extends JpaRepository<GlobalStatistics, LocalDate> {
}
