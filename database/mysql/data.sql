-- ==============================================
-- 枫榕赏金酒馆 - MySQL初始数据
-- ==============================================

SET NAMES utf8mb4;

-- ==============================================
-- 初始用户数据
-- ==============================================
INSERT INTO users (username, password, email, nickname, role) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'admin@example.com', '馆主大人', 'admin'),
('MAGE.Z.012', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'mage@example.com', '枫榕馆主', 'user'),
('CAM.RED.001', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'cam@example.com', '红隼', 'user'),
('EDIT.WK.002', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'edit@example.com', '剪辑术士', 'user'),
('DRONE.X.003', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'drone@example.com', '飞影', 'user');

-- ==============================================
-- 初始冒险者数据
-- ==============================================
INSERT INTO adventurers (uid, display_name, prestige, level, tier) VALUES
('MAGE.Z.012', '枫榕馆主', 9999, '传奇猎人', 'legendary'),
('CAM.RED.001', '红隼', 5800, '资深猎人', 'gold'),
('EDIT.WK.002', '剪辑术士', 3200, '中级猎人', 'silver'),
('DRONE.X.003', '飞影', 2100, '初级猎人', 'bronze');

-- ==============================================
-- 初始法器数据
-- ==============================================
INSERT INTO gears (owner_uid, gear_type, gear_name, wear_count, heat_level) VALUES
('MAGE.Z.012', '🎥', 'RED V-Raptor', 3, 45),
('MAGE.Z.012', '🛸', 'Inspire 3', 1, 20),
('MAGE.Z.012', '💻', 'M3 Max Node', 0, 60),
('CAM.RED.001', '🎥', 'Sony A1', 2, 30),
('EDIT.WK.002', '💻', 'Mac Studio', 1, 40),
('DRONE.X.003', '🛸', 'Mavic 3', 0, 15);

-- ==============================================
-- 初始勋章数据
-- ==============================================
INSERT INTO medals (name, description, icon, rarity, requirement) VALUES
('黄铜流派胸针', '完成首次任务委托即可获得', '🥉', 'common', '完成1次委托'),
('银翼勋章', '累计完成10次委托', '🥈', 'rare', '完成10次委托'),
('金樽持有者', '累计获得10000声望', '🥇', 'epic', '声望达到10000'),
('传奇刻印', '江湖传说级猎人专属', '👑', 'legendary', '完成50次传说级委托');

-- ==============================================
-- 初始冒险者勋章关联数据
-- ==============================================
INSERT INTO adventurer_medals (adventurer_uid, medal_id)
SELECT 'MAGE.Z.012', id FROM medals WHERE name IN ('黄铜流派胸针', '银翼勋章', '金樽持有者', '传奇刻印');

INSERT INTO adventurer_medals (adventurer_uid, medal_id)
SELECT 'CAM.RED.001', id FROM medals WHERE name IN ('黄铜流派胸针', '银翼勋章');

INSERT INTO adventurer_medals (adventurer_uid, medal_id)
SELECT 'EDIT.WK.002', id FROM medals WHERE name = '黄铜流派胸针';

-- ==============================================
-- 初始任务委托数据
-- ==============================================
INSERT INTO bounties (title, description, difficulty, reward_prestige, issuer_uid, expires_at) VALUES
('西溪湿地风光采集', '记录湿地晨雾美景，需要航拍设备', 'normal', 150, 'MAGE.Z.012', DATE_ADD(NOW(), INTERVAL 7 DAY)),
('古城夜景拍摄', '拍摄杭州古城夜景，要求4K画质', 'hard', 300, 'MAGE.Z.012', DATE_ADD(NOW(), INTERVAL 5 DAY)),
('企业宣传片制作', '为知名企业制作品牌宣传片', 'legendary', 800, 'CAM.RED.001', DATE_ADD(NOW(), INTERVAL 14 DAY)),
('短视频内容创作', '创作系列短视频内容，共10条', 'easy', 80, 'EDIT.WK.002', DATE_ADD(NOW(), INTERVAL 3 DAY)),
('活动现场直播', '大型活动现场直播技术支持', 'hard', 450, 'MAGE.Z.012', DATE_ADD(NOW(), INTERVAL 10 DAY));

-- ==============================================
-- 初始江湖传闻数据
-- ==============================================
INSERT INTO gossips (content, source_uid, is_verified) VALUES
('江湖传闻：枫榕馆主正在筹备一场盛大的武林大会', 'MAGE.Z.012', 1),
('红隼获得了最新的Sony A1相机，实力大增', 'CAM.RED.001', 1),
('剪辑术士正在闭关修炼新的剪辑秘籍', 'EDIT.WK.002', 0);

-- ==============================================
-- 初始通知数据
-- ==============================================
INSERT INTO notifications (recipient_uid, type, title, content) VALUES
('MAGE.Z.012', 'system', '系统公告', '欢迎来到枫榕赏金酒馆！'),
('CAM.RED.001', 'bounty', '新任务发布', '枫榕馆主发布了新的赏金任务'),
('EDIT.WK.002', 'medal', '勋章提醒', '恭喜您获得了黄铜流派胸针！');

-- ==============================================
-- 初始任务完成记录
-- ==============================================
INSERT INTO bounty_completions (bounty_id, adventurer_uid, rating, feedback)
SELECT b.id, 'DRONE.X.003', 5, '任务完成得非常顺利！'
FROM bounties b
WHERE b.title = '西溪湿地风光采集';

-- ==============================================
-- 初始数据插入完成
-- ==============================================
COMMIT;