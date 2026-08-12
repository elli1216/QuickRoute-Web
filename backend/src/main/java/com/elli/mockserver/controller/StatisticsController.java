package com.elli.mockserver.controller;

import com.elli.mockserver.model.GlobalStatistics;
import com.elli.mockserver.service.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping
    public ResponseEntity<List<GlobalStatistics>> getStats() {
        return ResponseEntity.ok(statisticsService.getAllStats());
    }
}
