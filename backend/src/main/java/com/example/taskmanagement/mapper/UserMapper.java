
package com.example.taskmanagement.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.taskmanagement.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.Optional;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    @Select("SELECT * FROM user WHERE username = #{username}")
    Optional<User> findByUsername(String username);

    @Select("SELECT * FROM user WHERE email = #{email}")
    Optional<User> findByEmail(String email);

    @Update("UPDATE user SET prestige = #{prestige}, level = #{level}, tier = #{tier}, " +
            "continuous_days = #{continuousDays}, last_login_date = #{lastLoginDate}, " +
            "last_active_at = #{lastActiveAt}, updated_at = NOW() WHERE id = #{id}")
    void update(User user);
}
