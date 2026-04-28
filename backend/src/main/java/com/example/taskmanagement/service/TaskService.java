
package com.example.taskmanagement.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.taskmanagement.dto.request.TaskCreateRequest;
import com.example.taskmanagement.dto.request.TaskUpdateRequest;
import com.example.taskmanagement.dto.response.TaskResponse;

public interface TaskService {
    TaskResponse createTask(TaskCreateRequest request, Long userId);
    TaskResponse getTaskById(Long id);
    IPage<TaskResponse> getAllTasks(int page, int size);
    IPage<TaskResponse> getTasksByStatus(String status, int page, int size);
    IPage<TaskResponse> getTasksByPublisher(Long publisherId, int page, int size);
    IPage<TaskResponse> getTasksByCategory(String category, int page, int size);
    IPage<TaskResponse> searchTasks(String keyword, int page, int size);
    TaskResponse updateTask(Long id, TaskUpdateRequest request, Long userId);
    void deleteTask(Long id, Long userId);
}
