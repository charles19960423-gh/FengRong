
package com.example.taskmanagement.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.taskmanagement.entity.TaskParticipant;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Optional;

@Mapper
public interface TaskParticipantMapper extends BaseMapper<TaskParticipant> {
    @Select("SELECT * FROM task_participant WHERE task_id = #{taskId} AND user_id = #{userId}")
    Optional<TaskParticipant> findByTaskIdAndUserId(@Param("taskId") Long taskId, @Param("userId") Long userId);
    
    @Select("SELECT * FROM task_participant WHERE task_id = #{taskId}")
    List<TaskParticipant> findByTaskId(@Param("taskId") Long taskId);
    
    @Select("SELECT * FROM task_participant WHERE user_id = #{userId}")
    List<TaskParticipant> findByUserId(@Param("userId") Long userId);
    
    @Select("SELECT COUNT(*) FROM task_participant WHERE task_id = #{taskId} AND status = 'confirmed'")
    int countConfirmedParticipants(@Param("taskId") Long taskId);
}
