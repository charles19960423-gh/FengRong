
package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.request.TaskParticipateRequest;
import com.example.taskmanagement.dto.response.TaskParticipantResponse;

import java.util.List;

public interface TaskParticipantService {
    TaskParticipantResponse participateTask(Long taskId, Long userId, TaskParticipateRequest request);
    TaskParticipantResponse confirmParticipant(Long taskId, Long participantId, Long userId);
    void withdrawParticipation(Long taskId, Long userId);
    List<TaskParticipantResponse> getTaskParticipants(Long taskId);
    List<TaskParticipantResponse> getUserParticipations(Long userId);
}
