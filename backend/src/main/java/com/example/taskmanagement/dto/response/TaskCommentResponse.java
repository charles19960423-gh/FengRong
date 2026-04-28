
package com.example.taskmanagement.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskCommentResponse {
    private Long id;
    private Long taskId;
    private Long userId;
    private String userNickname;
    private String content;
    private Long parentId;
    private LocalDateTime createdAt;
    private List<TaskCommentResponse> replies;
}
