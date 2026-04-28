package com.example.taskmanagement.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.taskmanagement.entity.Task;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Optional;

@Mapper
public interface TaskMapper extends BaseMapper<Task> {
    @Select("SELECT * FROM task WHERE id = #{id}")
    Optional<Task> selectByIdOptional(Long id);

    @Select("SELECT t.*, u.nickname as publisher_name " +
            "FROM task t LEFT JOIN user u ON t.publisher_id = u.id " +
            "WHERE t.status = #{status} " +
            "ORDER BY t.created_at DESC")
    IPage<Task> findByStatus(Page<Task> page, @Param("status") String status);

    @Select("SELECT t.*, u.nickname as publisher_name " +
            "FROM task t LEFT JOIN user u ON t.publisher_id = u.id " +
            "WHERE t.publisher_id = #{publisherId} " +
            "ORDER BY t.created_at DESC")
    IPage<Task> findByPublisherId(Page<Task> page, @Param("publisherId") Long publisherId);

    @Select("SELECT t.*, u.nickname as publisher_name " +
            "FROM task t LEFT JOIN user u ON t.publisher_id = u.id " +
            "WHERE t.category = #{category} " +
            "ORDER BY t.created_at DESC")
    IPage<Task> findByCategory(Page<Task> page, @Param("category") String category);

    @Select("SELECT t.*, u.nickname as publisher_name " +
            "FROM task t LEFT JOIN user u ON t.publisher_id = u.id " +
            "WHERE t.title LIKE CONCAT('%', #{keyword}, '%') OR t.description LIKE CONCAT('%', #{keyword}, '%') " +
            "ORDER BY t.created_at DESC")
    IPage<Task> searchTasks(Page<Task> page, @Param("keyword") String keyword);
}
