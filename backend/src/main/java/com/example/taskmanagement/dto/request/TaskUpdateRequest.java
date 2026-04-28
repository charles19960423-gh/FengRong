
package com.example.taskmanagement.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TaskUpdateRequest {
    private String title;
    private String description;
    private String category;
    private String status;
    private String priority;
    private BigDecimal reward;
    private String location;
    private LocalDateTime deadline;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer maxParticipants;
    private String requirements;
    private String deliveryRequirements;
}
