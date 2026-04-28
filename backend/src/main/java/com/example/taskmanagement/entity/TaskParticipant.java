
package com.example.taskmanagement.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("task_participant")
public class TaskParticipant {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long taskId;
    private Long userId;
    private String role;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime createdAt;
}
