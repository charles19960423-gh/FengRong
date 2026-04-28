package com.example.taskmanagement.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;
    private String password;
    private String nickname;
    private String email;
    private String phone;
    private Integer status;
    private Integer prestige;
    private String level;
    private String tier;
    private Integer continuousDays;
    private LocalDateTime lastLoginDate;
    private LocalDateTime lastActiveAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static final int[] PRESTIGE_THRESHOLDS = {0, 3000, 6000, 10000, 15000};
    public static final String[] LEVEL_NAMES = {"初级猎人", "中坚力量", "资深猎人", "法器大师", "一代宗师"};
    public static final String TIER_BRONZE = "bronze";
    public static final String TIER_SILVER = "silver";
    public static final String TIER_GOLD = "gold";
    public static final String TIER_LEGENDARY = "legendary";

    public String getLevel() {
        return calculateLevel(this.prestige != null ? this.prestige : 2850);
    }

    public String getTier() {
        return calculateTier(this.prestige != null ? this.prestige : 2850);
    }

    public static String calculateLevel(int prestige) {
        if (prestige >= PRESTIGE_THRESHOLDS[4]) return LEVEL_NAMES[4];
        if (prestige >= PRESTIGE_THRESHOLDS[3]) return LEVEL_NAMES[3];
        if (prestige >= PRESTIGE_THRESHOLDS[2]) return LEVEL_NAMES[2];
        if (prestige >= PRESTIGE_THRESHOLDS[1]) return LEVEL_NAMES[1];
        return LEVEL_NAMES[0];
    }

    public static String calculateTier(int prestige) {
        if (prestige >= 10000) return TIER_LEGENDARY;
        if (prestige >= 5000) return TIER_GOLD;
        if (prestige >= 2000) return TIER_SILVER;
        return TIER_BRONZE;
    }

    public static int getNextLevelThreshold(int prestige) {
        for (int threshold : PRESTIGE_THRESHOLDS) {
            if (prestige < threshold) return threshold;
        }
        return PRESTIGE_THRESHOLDS[PRESTIGE_THRESHOLDS.length - 1];
    }

    public int getPrestigeToNextLevel() {
        return getNextLevelThreshold(this.prestige != null ? this.prestige : 2850) - (this.prestige != null ? this.prestige : 2850);
    }

    public int getProgressPercent() {
        int prestige = this.prestige != null ? this.prestige : 2850;
        int currentLevelIndex = getLevelIndex(prestige);
        int nextThreshold = PRESTIGE_THRESHOLDS[currentLevelIndex];
        int prevThreshold = currentLevelIndex > 0 ? PRESTIGE_THRESHOLDS[currentLevelIndex - 1] : 0;
        int levelRange = nextThreshold - prevThreshold;
        int progress = prestige - prevThreshold;
        return (int) ((progress * 100.0) / levelRange);
    }

    private int getLevelIndex(int prestige) {
        for (int i = PRESTIGE_THRESHOLDS.length - 1; i >= 0; i--) {
            if (prestige >= PRESTIGE_THRESHOLDS[i]) return i;
        }
        return 0;
    }
}
