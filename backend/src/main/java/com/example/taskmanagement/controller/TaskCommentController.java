package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.request.TaskCommentRequest;
import com.example.taskmanagement.dto.response.ApiResponse;
import com.example.taskmanagement.dto.response.TaskCommentResponse;
import com.example.taskmanagement.entity.User;
import com.example.taskmanagement.service.TaskCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-comments")
@RequiredArgsConstructor
public class TaskCommentController {

    private final TaskCommentService commentService;

    @PostMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskCommentResponse>> addComment(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskCommentRequest request) {
        Long userId = getCurrentUserId();
        TaskCommentResponse response = commentService.addComment(taskId, userId, request);
        return ResponseEntity.ok(ApiResponse.success("评论成功", response));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<ApiResponse<List<TaskCommentResponse>>> getTaskComments(@PathVariable Long taskId) {
        List<TaskCommentResponse> response = commentService.getTaskComments(taskId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable Long commentId) {
        Long userId = getCurrentUserId();
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return ((User) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("用户未登录");
    }
}
