
package com.example.taskmanagement.dto.request;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TaskCreateRequest {
    @NotBlank(message = "任务标题不能为空")
    private String title;
    
    private String description;
    
    private String category;
    
    private String priority;
    
    @NotNull(message = "赏金不能为空")
    @DecimalMin(value = "0", message = "赏金不能为负数")
    private BigDecimal reward;
    
    private String location;
    
    private LocalDateTime deadline;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private Integer maxParticipants;
    
    private String requirements;
    
    private String deliveryRequirements;
}
