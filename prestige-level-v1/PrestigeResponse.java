package com.example.taskmanagement.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PrestigeResponse {
    private Long userId;
    private Integer prestige;
    private Integer previousPrestige;
    private String level;
    private String tier;
    private String previousLevel;
    private String previousTier;
    private Integer continuousDays;
    private Integer progressPercent;
    private Integer prestigeToNextLevel;
    private Integer nextLevelThreshold;
    private Boolean isPromoted;
    private String promotionMessage;
    private LocalDateTime lastLoginDate;
    private LocalDateTime lastActiveAt;
    private Boolean dailyBonusReceived;

    public static final int[] PRESTIGE_THRESHOLDS = {
        0, 3000, 6000, 10000, 15000
    };

    public static String[] LEVEL_NAMES = {
        "初级猎人", "中坚力量", "资深猎人", "法器大师", "一代宗师"
    };

    public static String[] TIER_NAMES = {
        "Bronze", "Silver", "Gold", "Legendary"
    };

    public static int calculateProgressPercent(int prestige) {
        if (prestige >= PRESTIGE_THRESHOLDS[4]) return 100;
        for (int i = PRESTIGE_THRESHOLDS.length - 2; i >= 0; i--) {
            if (prestige >= PRESTIGE_THRESHOLDS[i]) {
                int currentThreshold = PRESTIGE_THRESHOLDS[i];
                int nextThreshold = PRESTIGE_THRESHOLDS[i + 1];
                return (int) ((prestige - currentThreshold) * 100.0 / (nextThreshold - currentThreshold));
            }
        }
        return 0;
    }

    public static int getNextLevelThreshold(int prestige) {
        for (int threshold : PRESTIGE_THRESHOLDS) {
            if (prestige < threshold) return threshold;
        }
        return PRESTIGE_THRESHOLDS[PRESTIGE_THRESHOLDS.length - 1];
    }

    public static int getPrestigeToNextLevel(int prestige) {
        return getNextLevelThreshold(prestige) - prestige;
    }
}