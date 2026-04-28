package com.example.taskmanagement.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.taskmanagement.entity.TaskComment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Optional;

@Mapper
public interface TaskCommentMapper extends BaseMapper<TaskComment> {
    @Select("SELECT * FROM task_comment WHERE id = #{id}")
    Optional<TaskComment> selectByIdOptional(Long id);

    @Select("SELECT c.*, u.nickname as user_nickname " +
            "FROM task_comment c LEFT JOIN user u ON c.user_id = u.id " +
            "WHERE c.task_id = #{taskId} AND c.parent_id IS NULL " +
            "ORDER BY c.created_at DESC")
    List<TaskComment> findByTaskId(@Param("taskId") Long taskId);

    @Select("SELECT c.*, u.nickname as user_nickname " +
            "FROM task_comment c LEFT JOIN user u ON c.user_id = u.id " +
            "WHERE c.parent_id = #{parentId} " +
            "ORDER BY c.created_at ASC")
    List<TaskComment> findByParentId(@Param("parentId") Long parentId);
}
