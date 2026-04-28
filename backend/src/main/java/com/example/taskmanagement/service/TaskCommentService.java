
package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.request.TaskCommentRequest;
import com.example.taskmanagement.dto.response.TaskCommentResponse;

import java.util.List;

public interface TaskCommentService {
    TaskCommentResponse addComment(Long taskId, Long userId, TaskCommentRequest request);
    List<TaskCommentResponse> getTaskComments(Long taskId);
    void deleteComment(Long commentId, Long userId);
}
