
package com.example.taskmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskCommentRequest {
    @NotBlank(message = "评论内容不能为空")
    private String content;
    
    private Long parentId;
}
