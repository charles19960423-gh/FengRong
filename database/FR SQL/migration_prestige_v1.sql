-- ==============================================
-- 枫榕赏金酒馆 - 声望系统 V1.0 数据迁移
-- 执行时间: 2026-04-28
-- 描述: 为 user 表添加声望、等级、段位相关字段
-- ==============================================

ALTER TABLE user ADD COLUMN prestige INTEGER DEFAULT 2850;
ALTER TABLE user ADD COLUMN level TEXT DEFAULT '初级猎人';
ALTER TABLE user ADD COLUMN tier TEXT DEFAULT 'bronze';
ALTER TABLE user ADD COLUMN continuous_days INTEGER DEFAULT 0;
ALTER TABLE user ADD COLUMN last_login_date TIMESTAMP;
ALTER TABLE user ADD COLUMN last_active_at TIMESTAMP;

-- ==============================================
-- 声望等级阈值参考:
-- 初级猎人   (0-2999)
-- 中坚力量   (3000-5999)
-- 资深猎人   (6000-9999)
-- 法器大师   (10000-14999)
-- 一代宗师   (15000+)
--
-- 段位阈值参考:
-- Bronze    (0-1999)
-- Silver    (2000-4999)
-- Gold      (5000-9999)
-- Legendary (10000+)
-- ==============================================