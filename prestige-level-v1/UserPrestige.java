package com.example.taskmanagement.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user_prestige")
public class UserPrestige {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Integer prestige;

    private String level;

    private String tier;

    private Integer continuousDays;

    private LocalDateTime lastLoginDate;

    private LocalDateTime lastActiveAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static final String TIER_BRONZE = "bronze";
    public static final String TIER_SILVER = "silver";
    public static final String TIER_GOLD = "gold";
    public static final String TIER_LEGENDARY = "legendary";

    public static final String LEVEL_BEGINNER = "初级猎人";
    public static final String LEVEL_INTERMEDIATE = "中坚力量";
    public static final String LEVEL_VETERAN = "资深猎人";
    public static final String LEVEL_MASTER = "法器大师";
    public static final String LEVEL_GRANDMASTER = "一代宗师";

    public static final int[] PRESTIGE_THRESHOLDS = {
        0,       // 初级猎人
        3000,    // 中坚力量
        6000,    // 资深猎人
        10000,   // 法器大师
        15000    // 一代宗师
    };

    public static String calculateLevel(int prestige) {
        if (prestige >= PRESTIGE_THRESHOLDS[4]) return LEVEL_GRANDMASTER;
        if (prestige >= PRESTIGE_THRESHOLDS[3]) return LEVEL_MASTER;
        if (prestige >= PRESTIGE_THRESHOLDS[2]) return LEVEL_VETERAN;
        if (prestige >= PRESTIGE_THRESHOLDS[1]) return LEVEL_INTERMEDIATE;
        return LEVEL_BEGINNER;
    }

    public static String calculateTier(int prestige) {
        if (prestige >= 10000) return TIER_LEGENDARY;
        if (prestige >= 5000) return TIER_GOLD;
        if (prestige >= 2000) return TIER_SILVER;
        return TIER_BRONZE;
    }

    public static int getNextLevelThreshold(int prestige) {
        if (prestige >= PRESTIGE_THRESHOLDS[4]) return PRESTIGE_THRESHOLDS[4];
        if (prestige >= PRESTIGE_THRESHOLDS[3]) return PRESTIGE_THRESHOLDS[4];
        if (prestige >= PRESTIGE_THRESHOLDS[2]) return PRESTIGE_THRESHOLDS[3];
        if (prestige >= PRESTIGE_THRESHOLDS[1]) return PRESTIGE_THRESHOLDS[2];
        return PRESTIGE_THRESHOLDS[1];
    }

    public static boolean checkPromotion(int oldPrestige, int newPrestige) {
        return calculateLevel(oldPrestige) != calculateLevel(newPrestige);
    }
}