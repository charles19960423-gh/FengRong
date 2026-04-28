package com.example.taskmanagement.service.impl;

import com.example.taskmanagement.dto.response.PrestigeResponse;
import com.example.taskmanagement.entity.UserPrestige;
import com.example.taskmanagement.mapper.UserPrestigeMapper;
import com.example.taskmanagement.service.PrestigeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class PrestigeServiceImpl implements PrestigeService {

    private final UserPrestigeMapper prestigeMapper;

    private static final int DAILY_LOGIN_BONUS = 50;
    private static final int WEEKLY_BONUS_THRESHOLD = 7;
    private static final int WEEKLY_BONUS = 200;
    private static final int MONTHLY_BONUS_THRESHOLD = 30;
    private static final int MONTHLY_BONUS = 500;

    @Override
    public PrestigeResponse getPrestigeInfo(Long userId) {
        UserPrestige prestige = getOrCreatePrestige(userId);
        return buildPrestigeResponse(prestige, false);
    }

    @Override
    public PrestigeResponse addPrestige(Long userId, int amount, String reason) {
        UserPrestige prestige = getOrCreatePrestige(userId);
        int oldPrestige = prestige.getPrestige();
        int oldLevel = calculateLevelIndex(oldPrestige);

        prestige.setPrestige(oldPrestige + amount);
        prestige.setLastActiveAt(LocalDateTime.now());
        prestigeMapper.update(prestige);

        int newLevel = calculateLevelIndex(prestige.getPrestige());
        boolean isPromoted = newLevel > oldLevel;

        PrestigeResponse response = buildPrestigeResponse(prestige, isPromoted);
        if (isPromoted) {
            response.setPromotionMessage(buildPromotionMessage(prestige.getLevel()));
        }

        return response;
    }

    @Override
    public PrestigeResponse deductPrestige(Long userId, int amount, String reason) {
        UserPrestige prestige = getOrCreatePrestige(userId);
        int oldPrestige = prestige.getPrestige();

        int newPrestige = Math.max(0, oldPrestige - amount);
        prestige.setPrestige(newPrestige);
        prestige.setLastActiveAt(LocalDateTime.now());
        prestigeMapper.update(prestige);

        String newLevel = UserPrestige.calculateLevel(newPrestige);
        String newTier = UserPrestige.calculateTier(newPrestige);
        prestige.setLevel(newLevel);
        prestige.setTier(newTier);

        return buildPrestigeResponse(prestige, false);
    }

    @Override
    public PrestigeResponse loginBonus(Long userId) {
        UserPrestige prestige = getOrCreatePrestige(userId);
        LocalDate today = LocalDate.now();
        LocalDate lastLogin = prestige.getLastLoginDate() != null
                ? prestige.getLastLoginDate().toLocalDate()
                : null;

        if (lastLogin != null && lastLogin.equals(today)) {
            PrestigeResponse response = buildPrestigeResponse(prestige, false);
            response.setDailyBonusReceived(false);
            return response;
        }

        int bonusAmount = DAILY_LOGIN_BONUS;
        int continuousDays = prestige.getContinuousDays();

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

        if (continuousDays >= MONTHLY_BONUS_THRESHOLD) {
            bonusAmount += MONTHLY_BONUS;
        } else if (continuousDays >= WEEKLY_BONUS_THRESHOLD) {
            bonusAmount += WEEKLY_BONUS;
        }

        prestige.setContinuousDays(continuousDays);
        prestige.setLastLoginDate(LocalDateTime.now());

        int oldPrestige = prestige.getPrestige();
        prestige.setPrestige(oldPrestige + bonusAmount);
        prestige.setLastActiveAt(LocalDateTime.now());

        String newLevel = UserPrestige.calculateLevel(prestige.getPrestige());
        String newTier = UserPrestige.calculateTier(prestige.getPrestige());
        prestige.setLevel(newLevel);
        prestige.setTier(newTier);

        prestigeMapper.update(prestige);

        PrestigeResponse response = buildPrestigeResponse(prestige, false);
        response.setDailyBonusReceived(true);
        return response;
    }

    @Override
    public PrestigeResponse checkPromotion(Long userId) {
        UserPrestige prestige = getOrCreatePrestige(userId);
        return buildPrestigeResponse(prestige, false);
    }

    private UserPrestige getOrCreatePrestige(Long userId) {
        UserPrestige prestige = prestigeMapper.findByUserId(userId);
        if (prestige == null) {
            prestige = new UserPrestige();
            prestige.setUserId(userId);
            prestige.setPrestige(2850);
            prestige.setLevel(UserPrestige.LEVEL_BEGINNER);
            prestige.setTier(UserPrestige.TIER_BRONZE);
            prestige.setContinuousDays(0);
            prestige.setCreatedAt(LocalDateTime.now());
            prestige.setUpdatedAt(LocalDateTime.now());
            prestigeMapper.insert(prestige);
        }
        return prestige;
    }

    private PrestigeResponse buildPrestigeResponse(UserPrestige prestige, boolean isPromoted) {
        PrestigeResponse response = new PrestigeResponse();
        response.setUserId(prestige.getUserId());
        response.setPrestige(prestige.getPrestige());
        response.setPreviousPrestige(prestige.getPrestige());
        response.setLevel(prestige.getLevel());
        response.setTier(prestige.getTier());
        response.setContinuousDays(prestige.getContinuousDays());
        response.setProgressPercent(PrestigeResponse.calculateProgressPercent(prestige.getPrestige()));
        response.setPrestigeToNextLevel(PrestigeResponse.getPrestigeToNextLevel(prestige.getPrestige()));
        response.setNextLevelThreshold(PrestigeResponse.getNextLevelThreshold(prestige.getPrestige()));
        response.setIsPromoted(isPromoted);
        response.setLastLoginDate(prestige.getLastLoginDate());
        response.setLastActiveAt(prestige.getLastActiveAt());
        response.setDailyBonusReceived(false);
        return response;
    }

    private String buildPromotionMessage(String newLevel) {
        return "恭喜晋升为「" + newLevel + "」！江湖已传遍你的传说！";
    }

    private int calculateLevelIndex(int prestige) {
        int[] thresholds = {0, 3000, 6000, 10000, 15000};
        for (int i = thresholds.length - 1; i >= 0; i--) {
            if (prestige >= thresholds[i]) {
                return i;
            }
        }
        return 0;
    }
}