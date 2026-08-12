package com.elli.mockserver.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "global_statistics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalStatistics {
    @Id
    private LocalDate date;
    
    private long totalMocksCreated;
    private long totalRequestsServed;
}
