
package com.example.taskmanagement.service.impl;

import com.example.taskmanagement.dto.request.TaskCommentRequest;
import com.example.taskmanagement.dto.response.TaskCommentResponse;
import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.entity.TaskComment;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.exception.UnauthorizedException;
import com.example.taskmanagement.mapper.TaskCommentMapper;
import com.example.taskmanagement.mapper.TaskMapper;
import com.example.taskmanagement.mapper.UserMapper;
import com.example.taskmanagement.service.TaskCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskCommentServiceImpl implements TaskCommentService {
    
    private final TaskCommentMapper commentMapper;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;
    
    @Override
    public TaskCommentResponse addComment(Long taskId, Long userId, TaskCommentRequest request) {
        Task task = taskMapper.selectById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("任务不存在"));
        
        TaskComment comment = new TaskComment();
        comment.setTaskId(taskId);
        comment.setUserId(userId);
        comment.setContent(request.getContent());
        comment.setParentId(request.getParentId());
        comment.setCreatedAt(LocalDateTime.now());
        
        commentMapper.insert(comment);
        
        return convertToResponse(comment, null);
    }
    
    @Override
    public List<TaskCommentResponse> getTaskComments(Long taskId) {
        if (taskMapper.selectById(taskId).isEmpty()) {
            throw new ResourceNotFoundException("任务不存在");
        }
        
        List<TaskComment> comments = commentMapper.findByTaskId(taskId);
        Map<Long, List<TaskComment>> replyMap = commentMapper.findByTaskId(taskId).stream()
                .filter(c -> c.getParentId() != null)
                .collect(Collectors.groupingBy(TaskComment::getParentId));
        
        return comments.stream()
                .filter(c -> c.getParentId() == null)
                .map(c -> convertToResponse(c, replyMap.getOrDefault(c.getId(), List.of())))
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteComment(Long commentId, Long userId) {
        TaskComment comment = commentMapper.selectById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("评论不存在"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new UnauthorizedException("无权删除此评论");
        }
        
        commentMapper.deleteById(commentId);
    }
    
    private TaskCommentResponse convertToResponse(TaskComment comment, List<TaskComment> replies) {
        TaskCommentResponse response = new TaskCommentResponse();
        response.setId(comment.getId());
        response.setTaskId(comment.getTaskId());
        response.setUserId(comment.getUserId());
        response.setContent(comment.getContent());
        response.setParentId(comment.getParentId());
        response.setCreatedAt(comment.getCreatedAt());
        
        userMapper.selectById(comment.getUserId())
                .ifPresent(user -> response.setUserNickname(user.getNickname()));
        
        if (replies != null) {
            response.setReplies(replies.stream()
                    .map(r -> convertToResponse(r, null))
                    .collect(Collectors.toList()));
        }
        
        return response;
    }
}
