
package com.example.taskmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskParticipateRequest {
    @NotBlank(message = "角色不能为空")
    private String role;
}
