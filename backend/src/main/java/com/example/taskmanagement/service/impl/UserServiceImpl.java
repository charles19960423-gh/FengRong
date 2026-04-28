
package com.example.taskmanagement.service.impl;

import com.example.taskmanagement.dto.request.UserLoginRequest;
import com.example.taskmanagement.dto.request.UserRegisterRequest;
import com.example.taskmanagement.dto.response.LoginResponse;
import com.example.taskmanagement.dto.response.UserResponse;
import com.example.taskmanagement.entity.User;
import com.example.taskmanagement.exception.InvalidRequestException;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.exception.UnauthorizedException;
import com.example.taskmanagement.mapper.UserMapper;
import com.example.taskmanagement.service.UserService;
import com.example.taskmanagement.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    
    @Override
    public UserResponse register(UserRegisterRequest request) {
        if (userMapper.findByUsername(request.getUsername()).isPresent()) {
            throw new InvalidRequestException("用户名已存在");
        }
        
        if (request.getEmail() != null && userMapper.findByEmail(request.getEmail()).isPresent()) {
            throw new InvalidRequestException("邮箱已被注册");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNickname(request.getNickname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setStatus(1);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userMapper.insert(user);
        
        return convertToResponse(user);
    }
    
    @Override
    public LoginResponse login(UserLoginRequest request) {
        User user = userMapper.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("用户名或密码错误"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("用户名或密码错误");
        }
        
        if (user.getStatus() != 1) {
            throw new UnauthorizedException("账号已被禁用");
        }
        
        String token = jwtUtil.generateToken(user.getUsername());
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(convertToResponse(user));
        
        return response;
    }
    
    @Override
    public UserResponse getUserById(Long id) {
        User user = userMapper.selectById(id)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
        return convertToResponse(user);
    }
    
    @Override
    public UserResponse getUserByUsername(String username) {
        User user = userMapper.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
        return convertToResponse(user);
    }
    
    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setNickname(user.getNickname());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setStatus(user.getStatus());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
