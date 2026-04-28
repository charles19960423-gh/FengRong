
package com.example.taskmanagement.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.taskmanagement.dto.request.TaskCreateRequest;
import com.example.taskmanagement.dto.request.TaskUpdateRequest;
import com.example.taskmanagement.dto.response.TaskResponse;
import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.exception.InvalidRequestException;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.exception.UnauthorizedException;
import com.example.taskmanagement.mapper.TaskMapper;
import com.example.taskmanagement.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    
    private final TaskMapper taskMapper;
    
    @Override
    public TaskResponse createTask(TaskCreateRequest request, Long userId) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCategory(request.getCategory());
        task.setStatus("pending");
        task.setPriority(request.getPriority());
        task.setReward(request.getReward());
        task.setLocation(request.getLocation());
        task.setDeadline(request.getDeadline());
        task.setStartTime(request.getStartTime());
        task.setEndTime(request.getEndTime());
        task.setPublisherId(userId);
        task.setMaxParticipants(request.getMaxParticipants());
        task.setRequirements(request.getRequirements());
        task.setDeliveryRequirements(request.getDeliveryRequirements());
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        
        taskMapper.insert(task);
        
        return convertToResponse(task);
    }
    
    @Override
    public TaskResponse getTaskById(Long id) {
        Task task = taskMapper.selectById(id)
                .orElseThrow(() -> new ResourceNotFoundException("任务不存在"));
        return convertToResponse(task);
    }
    
    @Override
    public IPage<TaskResponse> getAllTasks(int page, int size) {
        Page<Task> taskPage = new Page<>(page, size);
        IPage<Task> result = taskMapper.selectPage(taskPage, null);
        return result.convert(this::convertToResponse);
    }
    
    @Override
    public IPage<TaskResponse> getTasksByStatus(String status, int page, int size) {
        Page<Task> taskPage = new Page<>(page, size);
        IPage<Task> result = taskMapper.findByStatus(taskPage, status);
        return result.convert(this::convertToResponse);
    }
    
    @Override
    public IPage<TaskResponse> getTasksByPublisher(Long publisherId, int page, int size) {
        Page<Task> taskPage = new Page<>(page, size);
        IPage<Task> result = taskMapper.findByPublisherId(taskPage, publisherId);
        return result.convert(this::convertToResponse);
    }
    
    @Override
    public IPage<TaskResponse> getTasksByCategory(String category, int page, int size) {
        Page<Task> taskPage = new Page<>(page, size);
        IPage<Task> result = taskMapper.findByCategory(taskPage, category);
        return result.convert(this::convertToResponse);
    }
    
    @Override
    public IPage<TaskResponse> searchTasks(String keyword, int page, int size) {
        if (!StringUtils.hasText(keyword)) {
            throw new InvalidRequestException("搜索关键词不能为空");
        }
        Page<Task> taskPage = new Page<>(page, size);
        IPage<Task> result = taskMapper.searchTasks(taskPage, keyword);
        return result.convert(this::convertToResponse);
    }
    
    @Override
    public TaskResponse updateTask(Long id, TaskUpdateRequest request, Long userId) {
        Task task = taskMapper.selectById(id)
                .orElseThrow(() -> new ResourceNotFoundException("任务不存在"));
        
        if (!task.getPublisherId().equals(userId)) {
            throw new UnauthorizedException("无权修改此任务");
        }
        
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getCategory() != null) task.setCategory(request.getCategory());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getReward() != null) task.setReward(request.getReward());
        if (request.getLocation() != null) task.setLocation(request.getLocation());
        if (request.getDeadline() != null) task.setDeadline(request.getDeadline());
        if (request.getStartTime() != null) task.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) task.setEndTime(request.getEndTime());
        if (request.getMaxParticipants() != null) task.setMaxParticipants(request.getMaxParticipants());
        if (request.getRequirements() != null) task.setRequirements(request.getRequirements());
        if (request.getDeliveryRequirements() != null) task.setDeliveryRequirements(request.getDeliveryRequirements());
        task.setUpdatedAt(LocalDateTime.now());
        
        taskMapper.updateById(task);
        
        return convertToResponse(task);
    }
    
    @Override
    public void deleteTask(Long id, Long userId) {
        Task task = taskMapper.selectById(id)
                .orElseThrow(() -> new ResourceNotFoundException("任务不存在"));
        
        if (!task.getPublisherId().equals(userId)) {
            throw new UnauthorizedException("无权删除此任务");
        }
        
        taskMapper.deleteById(id);
    }
    
    private TaskResponse convertToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setCategory(task.getCategory());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setReward(task.getReward());
        response.setLocation(task.getLocation());
        response.setDeadline(task.getDeadline());
        response.setStartTime(task.getStartTime());
        response.setEndTime(task.getEndTime());
        response.setPublisherId(task.getPublisherId());
        response.setMaxParticipants(task.getMaxParticipants());
        response.setRequirements(task.getRequirements());
        response.setDeliveryRequirements(task.getDeliveryRequirements());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        return response;
    }
}
