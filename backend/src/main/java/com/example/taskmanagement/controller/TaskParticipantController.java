package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.request.TaskParticipateRequest;
import com.example.taskmanagement.dto.response.ApiResponse;
import com.example.taskmanagement.dto.response.TaskParticipantResponse;
import com.example.taskmanagement.entity.User;
import com.example.taskmanagement.service.TaskParticipantService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-participants")
@RequiredArgsConstructor
public class TaskParticipantController {

    private final TaskParticipantService participantService;

    @PostMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskParticipantResponse>> participateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskParticipateRequest request) {
        Long userId = getCurrentUserId();
        TaskParticipantResponse response = participantService.participateTask(taskId, userId, request);
        return ResponseEntity.ok(ApiResponse.success("报名成功", response));
    }

    @PutMapping("/{taskId}/confirm/{participantId}")
    public ResponseEntity<ApiResponse<TaskParticipantResponse>> confirmParticipant(
            @PathVariable Long taskId,
            @PathVariable Long participantId) {
        Long userId = getCurrentUserId();
        TaskParticipantResponse response = participantService.confirmParticipant(taskId, participantId, userId);
        return ResponseEntity.ok(ApiResponse.success("确认成功", response));
    }

    @DeleteMapping("/{taskId}/withdraw")
    public ResponseEntity<ApiResponse<Void>> withdrawParticipation(@PathVariable Long taskId) {
        Long userId = getCurrentUserId();
        participantService.withdrawParticipation(taskId, userId);
        return ResponseEntity.ok(ApiResponse.success("取消报名成功", null));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<ApiResponse<List<TaskParticipantResponse>>> getTaskParticipants(@PathVariable Long taskId) {
        List<TaskParticipantResponse> response = participantService.getTaskParticipants(taskId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TaskParticipantResponse>>> getUserParticipations(@PathVariable Long userId) {
        List<TaskParticipantResponse> response = participantService.getUserParticipations(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return ((User) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("用户未登录");
    }
}
