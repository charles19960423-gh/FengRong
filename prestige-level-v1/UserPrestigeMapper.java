package com.example.taskmanagement.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.taskmanagement.entity.UserPrestige;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserPrestigeMapper extends BaseMapper<UserPrestige> {

    @Select("SELECT * FROM user_prestige WHERE user_id = #{userId}")
    UserPrestige findByUserId(Long userId);

    @Update("UPDATE user_prestige SET prestige = #{prestige}, level = #{level}, tier = #{tier}, " +
            "continuous_days = #{continuousDays}, last_login_date = #{lastLoginDate}, " +
            "last_active_at = #{lastActiveAt}, updated_at = NOW() WHERE user_id = #{userId}")
    void update(UserPrestige prestige);

    default void insert(UserPrestige prestige) {
        com.baomidou.mybatisplus.core.mapper.BaseMapper.super.insert(prestige);
    }
}