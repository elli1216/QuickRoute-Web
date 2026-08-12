package com.elli.mockserver.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "global_statistics")
public class GlobalStatistics {

    @Id
    private LocalDate date;
    
    private long totalMocksCreated;
    private long totalRequestsServed;

    public GlobalStatistics() {
    }

    public GlobalStatistics(LocalDate date, long totalMocksCreated, long totalRequestsServed) {
        this.date = date;
        this.totalMocksCreated = totalMocksCreated;
        this.totalRequestsServed = totalRequestsServed;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public long getTotalMocksCreated() {
        return totalMocksCreated;
    }

    public void setTotalMocksCreated(long totalMocksCreated) {
        this.totalMocksCreated = totalMocksCreated;
    }

    public long getTotalRequestsServed() {
        return totalRequestsServed;
    }

    public void setTotalRequestsServed(long totalRequestsServed) {
        this.totalRequestsServed = totalRequestsServed;
    }
}
