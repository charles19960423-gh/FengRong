
package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.request.UserLoginRequest;
import com.example.taskmanagement.dto.request.UserRegisterRequest;
import com.example.taskmanagement.dto.response.LoginResponse;
import com.example.taskmanagement.dto.response.PrestigeResponse;
import com.example.taskmanagement.dto.response.UserResponse;

public interface UserService {
    UserResponse register(UserRegisterRequest request);
    LoginResponse login(UserLoginRequest request);
    UserResponse getUserById(Long id);
    UserResponse getUserByUsername(String username);

    PrestigeResponse getPrestigeInfo(Long userId);
    PrestigeResponse addPrestige(Long userId, int amount, String reason);
    PrestigeResponse deductPrestige(Long userId, int amount, String reason);
    PrestigeResponse loginBonus(Long userId);
}
