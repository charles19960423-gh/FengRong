
package com.example.taskmanagement.service.impl;

import com.example.taskmanagement.dto.request.UserLoginRequest;
import com.example.taskmanagement.dto.request.UserRegisterRequest;
import com.example.taskmanagement.dto.response.LoginResponse;
import com.example.taskmanagement.dto.response.PrestigeResponse;
import com.example.taskmanagement.dto.response.UserResponse;
import com.example.taskmanagement.entity.User;
import com.example.taskmanagement.exception.InvalidRequestException;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.exception.UnauthorizedException;
import com.example.taskmanagement.mapper.UserMapper;
import com.example.taskmanagement.service.UserService;
import com.example.taskmanagement.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private static final int DAILY_LOGIN_BONUS = 50;
    private static final int WEEKLY_BONUS = 200;
    private static final int MONTHLY_BONUS = 500;
    private static final int INITIAL_PRESTIGE = 2850;

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
        user.setPrestige(INITIAL_PRESTIGE);
        user.setLevel(User.calculateLevel(INITIAL_PRESTIGE));
        user.setTier(User.TIER_BRONZE);
        user.setContinuousDays(0);
        user.setLastLoginDate(LocalDateTime.now());
        user.setLastActiveAt(LocalDateTime.now());
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
        
        // 处理登录奖励
        PrestigeResponse prestigeResponse = loginBonus(user.getId());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(convertToResponse(user));
        response.setPrestige(prestigeResponse);

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

    @Override
    public PrestigeResponse getPrestigeInfo(Long userId) {
        User user = userMapper.selectById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
        return buildPrestigeResponse(user, false);
    }

    @Override
    public PrestigeResponse addPrestige(Long userId, int amount, String reason) {
        User user = userMapper.selectById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        int oldPrestige = user.getPrestige() != null ? user.getPrestige() : INITIAL_PRESTIGE;
        int oldLevelIndex = getLevelIndex(oldPrestige);

        int newPrestige = oldPrestige + amount;
        user.setPrestige(newPrestige);
        user.setLevel(User.calculateLevel(newPrestige));
        user.setTier(User.calculateTier(newPrestige));
        user.setLastActiveAt(LocalDateTime.now());
        userMapper.update(user);

        int newLevelIndex = getLevelIndex(newPrestige);
        boolean isPromoted = newLevelIndex > oldLevelIndex;

        PrestigeResponse response = buildPrestigeResponse(user, isPromoted);
        if (isPromoted) {
            response.setPromotionMessage("恭喜晋升为「" + user.getLevel() + "」！江湖已传遍你的传说！");
        }
        return response;
    }

    @Override
    public PrestigeResponse deductPrestige(Long userId, int amount, String reason) {
        User user = userMapper.selectById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        int oldPrestige = user.getPrestige() != null ? user.getPrestige() : INITIAL_PRESTIGE;
        int newPrestige = Math.max(0, oldPrestige - amount);

        user.setPrestige(newPrestige);
        user.setLevel(User.calculateLevel(newPrestige));
        user.setTier(User.calculateTier(newPrestige));
        user.setLastActiveAt(LocalDateTime.now());
        userMapper.update(user);

        return buildPrestigeResponse(user, false);
    }

    @Override
    public PrestigeResponse loginBonus(Long userId) {
        User user = userMapper.selectById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        LocalDate today = LocalDate.now();
        LocalDate lastLogin = user.getLastLoginDate() != null ? user.getLastLoginDate().toLocalDate() : null;

        if (lastLogin != null && lastLogin.equals(today)) {
            PrestigeResponse response = buildPrestigeResponse(user, false);
            response.setDailyBonusReceived(false);
            return response;
        }

        int bonusAmount = DAILY_LOGIN_BONUS;
        int continuousDays = user.getContinuousDays() != null ? user.getContinuousDays() : 0;

        if (lastLogin != null) {
            long daysSinceLastLogin = ChronoUnit.DAYS.between(lastLogin, today);
            if (daysSinceLastLogin == 1) {
                continuousDays++;
            } else if (daysSinceLastLogin > 1) {
                continuousDays = 1;
            }
        } else {
            continuousDays = 1;
        }

        if (continuousDays >= 30) {
            bonusAmount += MONTHLY_BONUS;
        } else if (continuousDays >= 7) {
            bonusAmount += WEEKLY_BONUS;
        }

        user.setContinuousDays(continuousDays);
        user.setLastLoginDate(LocalDateTime.now());

        int oldPrestige = user.getPrestige() != null ? user.getPrestige() : INITIAL_PRESTIGE;
        int newPrestige = oldPrestige + bonusAmount;
        user.setPrestige(newPrestige);
        user.setLevel(User.calculateLevel(newPrestige));
        user.setTier(User.calculateTier(newPrestige));
        user.setLastActiveAt(LocalDateTime.now());
        userMapper.update(user);

        PrestigeResponse response = buildPrestigeResponse(user, false);
        response.setDailyBonusReceived(true);
        return response;
    }

    private PrestigeResponse buildPrestigeResponse(User user, boolean isPromoted) {
        int prestige = user.getPrestige() != null ? user.getPrestige() : INITIAL_PRESTIGE;
        PrestigeResponse response = new PrestigeResponse();
        response.setUserId(user.getId());
        response.setPrestige(prestige);
        response.setPreviousPrestige(prestige);
        response.setLevel(user.getLevel());
        response.setTier(user.getTier());
        response.setContinuousDays(user.getContinuousDays() != null ? user.getContinuousDays() : 0);
        response.setProgressPercent(PrestigeResponse.calculateProgressPercent(prestige));
        response.setPrestigeToNextLevel(PrestigeResponse.getPrestigeToNextLevel(prestige));
        response.setNextLevelThreshold(PrestigeResponse.getNextLevelThreshold(prestige));
        response.setIsPromoted(isPromoted);
        response.setLastLoginDate(user.getLastLoginDate());
        response.setLastActiveAt(user.getLastActiveAt());
        response.setDailyBonusReceived(false);
        return response;
    }

    private int getLevelIndex(int prestige) {
        int[] thresholds = {0, 3000, 6000, 10000, 15000};
        for (int i = thresholds.length - 1; i >= 0; i--) {
            if (prestige >= thresholds[i]) return i;
        }
        return 0;
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
