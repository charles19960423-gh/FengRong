
package com.example.taskmanagement.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.taskmanagement.entity.TaskAttachment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TaskAttachmentMapper extends BaseMapper<TaskAttachment> {
    @Select("SELECT * FROM task_attachment WHERE task_id = #{taskId} ORDER BY created_at DESC")
    List<TaskAttachment> findByTaskId(@Param("taskId") Long taskId);
}
