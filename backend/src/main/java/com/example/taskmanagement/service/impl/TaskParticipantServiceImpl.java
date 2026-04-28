
package com.example.taskmanagement.service.impl;

import com.example.taskmanagement.dto.request.TaskParticipateRequest;
import com.example.taskmanagement.dto.response.TaskParticipantResponse;
import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.entity.TaskParticipant;
import com.example.taskmanagement.entity.User;
import com.example.taskmanagement.exception.InvalidRequestException;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.exception.UnauthorizedException;
import com.example.taskmanagement.mapper.TaskMapper;
import com.example.taskmanagement.mapper.TaskParticipantMapper;
import com.example.taskmanagement.mapper.UserMapper;
import com.example.taskmanagement.service.TaskParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskParticipantServiceImpl implements TaskParticipantService {
    
    private final TaskParticipantMapper participantMapper;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;
    
    @Override
    public TaskParticipantResponse participateTask(Long taskId, Long userId, TaskParticipateRequest request) {
        Task task = taskMapper.selectById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("任务不存在"));
        
        if (!"pending".equals(task.getStatus())) {
            throw new InvalidRequestException("任务状态不允许报名");
        }
        
        if (participantMapper.findByTaskIdAndUserId(taskId, userId).isPresent()) {
            throw new InvalidRequestException("您已报名此任务");
        }
        
        int confirmedCount = participantMapper.countConfirmedParticipants(taskId);
        if (task.getMaxParticipants() != null && confirmedCount >= task.getMaxParticipants()) {
            throw new InvalidRequestException("任务已满员");
        }
        
        TaskParticipant participant = new TaskParticipant();
        participant.setTaskId(taskId);
        participant.setUserId(userId);
        participant.setRole(request.getRole());
        participant.setStatus("applied");
        participant.setAppliedAt(LocalDateTime.now());
        participant.setCreatedAt(LocalDateTime.now());
        
        participantMapper.insert(participant);
        
        return convertToResponse(participant);
    }
    
    @Override
    public TaskParticipantResponse confirmParticipant(Long taskId, Long participantId, Long userId) {
        Task task = taskMapper.selectById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("任务不存在"));
        
        if (!task.getPublisherId().equals(userId)) {
            throw new UnauthorizedException("无权确认参与者");
        }
        
        TaskParticipant participant = participantMapper.selectById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("参与者不存在"));
        
        if (!participant.getTaskId().equals(taskId)) {
            throw new InvalidRequestException("参与者不属于此任务");
        }
        
        participant.setStatus("confirmed");
        participant.setConfirmedAt(LocalDateTime.now());
        
        participantMapper.updateById(participant);
        
        return convertToResponse(participant);
    }
    
    @Override
    public void withdrawParticipation(Long taskId, Long userId) {
        TaskParticipant participant = participantMapper.findByTaskIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("您未报名此任务"));
        
        if ("confirmed".equals(participant.getStatus())) {
            throw new InvalidRequestException("已确认的参与不能取消");
        }
        
        participantMapper.deleteById(participant.getId());
    }
    
    @Override
    public List<TaskParticipantResponse> getTaskParticipants(Long taskId) {
        if (taskMapper.selectById(taskId).isEmpty()) {
            throw new ResourceNotFoundException("任务不存在");
        }
        
        List<TaskParticipant> participants = participantMapper.findByTaskId(taskId);
        return participants.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TaskParticipantResponse> getUserParticipations(Long userId) {
        List<TaskParticipant> participants = participantMapper.findByUserId(userId);
        return participants.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private TaskParticipantResponse convertToResponse(TaskParticipant participant) {
        TaskParticipantResponse response = new TaskParticipantResponse();
        response.setId(participant.getId());
        response.setTaskId(participant.getTaskId());
        response.setUserId(participant.getUserId());
        response.setRole(participant.getRole());
        response.setStatus(participant.getStatus());
        response.setAppliedAt(participant.getAppliedAt());
        response.setConfirmedAt(participant.getConfirmedAt());
        
        userMapper.selectById(participant.getUserId())
                .ifPresent(user -> response.setUserNickname(user.getNickname()));
        
        return response;
    }
}
