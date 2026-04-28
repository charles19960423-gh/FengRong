
package com.example.taskmanagement.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TaskResponse {
    private Long id;
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
    private Long publisherId;
    private String publisherName;
    private Integer maxParticipants;
    private String requirements;
    private String deliveryRequirements;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
