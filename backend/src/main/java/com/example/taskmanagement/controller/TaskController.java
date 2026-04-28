package com.example.taskmanagement.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.taskmanagement.dto.request.TaskCreateRequest;
import com.example.taskmanagement.dto.request.TaskUpdateRequest;
import com.example.taskmanagement.dto.response.ApiResponse;
import com.example.taskmanagement.dto.response.TaskResponse;
import com.example.taskmanagement.entity.User;
import com.example.taskmanagement.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskCreateRequest request) {
        Long userId = getCurrentUserId();
        TaskResponse response = taskService.createTask(request, userId);
        return ResponseEntity.ok(ApiResponse.success("任务创建成功", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        TaskResponse response = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<IPage<TaskResponse>>> getAllTasks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        IPage<TaskResponse> response = taskService.getAllTasks(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<IPage<TaskResponse>>> getTasksByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        IPage<TaskResponse> response = taskService.getTasksByStatus(status, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/publisher/{publisherId}")
    public ResponseEntity<ApiResponse<IPage<TaskResponse>>> getTasksByPublisher(
            @PathVariable Long publisherId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        IPage<TaskResponse> response = taskService.getTasksByPublisher(publisherId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<IPage<TaskResponse>>> getTasksByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        IPage<TaskResponse> response = taskService.getTasksByCategory(category, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<IPage<TaskResponse>>> searchTasks(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        IPage<TaskResponse> response = taskService.searchTasks(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @RequestBody TaskUpdateRequest request) {
        Long userId = getCurrentUserId();
        TaskResponse response = taskService.updateTask(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("任务更新成功", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        taskService.deleteTask(id, userId);
        return ResponseEntity.ok(ApiResponse.success("任务删除成功", null));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return ((User) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("用户未登录");
    }
}
