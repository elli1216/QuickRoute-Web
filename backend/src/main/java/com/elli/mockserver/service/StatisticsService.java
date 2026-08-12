package com.elli.mockserver.service;

import com.elli.mockserver.model.GlobalStatistics;
import com.elli.mockserver.repository.GlobalStatisticsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class StatisticsService {

    private final GlobalStatisticsRepository repository;

    public StatisticsService(GlobalStatisticsRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void incrementMocksCreated() {
        LocalDate today = LocalDate.now();
        GlobalStatistics stats = repository.findById(today).orElseGet(() -> new GlobalStatistics(today, 0, 0));
        stats.setTotalMocksCreated(stats.getTotalMocksCreated() + 1);
        repository.save(stats);
    }

    @Transactional
    public void incrementRequestsServed() {
        LocalDate today = LocalDate.now();
        GlobalStatistics stats = repository.findById(today).orElseGet(() -> new GlobalStatistics(today, 0, 0));
        stats.setTotalRequestsServed(stats.getTotalRequestsServed() + 1);
        repository.save(stats);
    }

    public List<GlobalStatistics> getAllStats() {
        return repository.findAll();
    }
}
