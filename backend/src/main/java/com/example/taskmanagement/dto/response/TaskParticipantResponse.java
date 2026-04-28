
package com.example.taskmanagement.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskParticipantResponse {
    private Long id;
    private Long taskId;
    private Long userId;
    private String userNickname;
    private String role;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime confirmedAt;
}
