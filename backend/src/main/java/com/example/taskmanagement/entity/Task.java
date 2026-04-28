
package com.example.taskmanagement.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("task")
public class Task {
    @TableId(type = IdType.AUTO)
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
    private Integer maxParticipants;
    private String requirements;
    private String deliveryRequirements;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
