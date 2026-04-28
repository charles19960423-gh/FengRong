-- ==============================================
-- 枫榕赏金酒馆 - 批量导入示例数据
-- 使用方法：在 Supabase SQL Editor 中执行此脚本
-- ==============================================

-- ==============================================
-- 1. 冒险者数据 (adventurers)
-- ==============================================
INSERT INTO adventurers (uid, display_name, prestige, tier, level, avatar_url, bio, created_at)
VALUES
  ('MAGE.Z.012', '枫榕馆主', 9999, 'legendary', '传奇猎人', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=ancient%20tavern%20keeper%20portrait%20medieval%20fantasy&image_size=portrait_4_3', '枫榕酒馆创始人，江湖人称馆主。十年传媒行业经验，擅长大型活动策划与执行。', NOW()),
  ('CAM.RED.001', '红隼', 5800, 'gold', '资深猎人', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20photographer%20with%20camera%20portrait&image_size=portrait_4_3', '资深摄影师，擅长捕捉瞬间之美，作品曾获多项摄影大奖。', NOW()),
  ('EDIT.WK.002', '剪辑术士', 3200, 'silver', '中级猎人', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=video%20editor%20creative%20professional%20portrait&image_size=portrait_4_3', '剪辑大师，能将平凡素材化为精彩故事。', NOW()),
  ('DRONE.X.003', '飞影', 2100, 'bronze', '初级猎人', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=drones%20operator%20tech%20professional%20portrait&image_size=portrait_4_3', '无人机专家，带你从天空视角看世界。', NOW()),
  ('DESIGN.ART.004', '墨染', 4500, 'gold', '资深猎人', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=graphic%20designer%20creative%20artist%20portrait&image_size=portrait_4_3', '创意设计师，用色彩与线条讲述品牌故事。', NOW()),
  ('SOUND.MIC.005', '回声', 1800, 'bronze', '初级猎人', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=audio%20engineer%20with%20microphone%20portrait&image_size=portrait_4_3', '声音魔法师，让作品更有感染力。', NOW())
ON CONFLICT (uid) DO NOTHING;

-- ==============================================
-- 2. 法器数据 (gears)
-- 字段: id, owner_uid, gear_type, gear_name, wear_count, heat_level, tape_positions, acquired_at, last_used_at
-- ==============================================
INSERT INTO gears (owner_uid, gear_type, gear_name, wear_count, heat_level, tape_positions, acquired_at)
VALUES
  ('MAGE.Z.012', 'camera', '索尼 A7M4', 150, 35, '[{"x": 20, "y": 30}, {"x": 70, "y": 60}]', NOW()),
  ('CAM.RED.001', 'camera', '佳能 R5', 80, 28, '[]', NOW()),
  ('CAM.RED.001', 'drone', '大疆 Air 3', 60, 42, '[{"x": 45, "y": 55}]', NOW()),
  ('EDIT.WK.002', 'computer', 'MacBook Pro 16', 200, 22, '[]', NOW()),
  ('DRONE.X.003', 'drone', '大疆 Mavic 3 Pro', 120, 55, '[{"x": 30, "y": 40}, {"x": 60, "y": 70}]', NOW()),
  ('DESIGN.ART.004', 'tablet', 'Wacom Cintiq 22', 90, 18, '[]', NOW()),
  ('SOUND.MIC.005', 'microphone', '罗德 NTG-5', 50, 25, '[]', NOW());

-- ==============================================
-- 3. 勋章数据 (medals)
-- 字段: id, name, description, icon, rarity, requirement
-- ==============================================
INSERT INTO medals (name, description, icon, rarity, requirement)
VALUES
  ('初入江湖', '完成首次任务委托', '🌱', 'common', '完成1次委托'),
  ('黄铜流派胸针', '累计完成10次委托', '🥉', 'common', '完成10次委托'),
  ('银翼勋章', '累计完成50次委托', '🥈', 'rare', '完成50次委托'),
  ('金樽持有者', '累计获得10000声望', '🥇', 'epic', '声望达到10000'),
  ('传奇刻印', '江湖传说级猎人专属', '👑', 'legendary', '完成100次传说级委托'),
  ('摄影大师', '完成50次摄影任务', '📷', 'epic', '完成50次摄影类任务'),
  ('剪辑达人', '完成50次剪辑任务', '✂️', 'epic', '完成50次剪辑类任务'),
  ('航拍专家', '完成30次航拍任务', '🚁', 'rare', '完成30次航拍任务'),
  ('深夜行者', '在22:00-06:00完成任务', '🌙', 'rare', '夜间完成10次任务'),
  ('社交达人', '邀请10位冒险者加入', '👥', 'common', '邀请10位好友');

-- ==============================================
-- 4. 冒险者-勋章关联 (adventurer_medals)
-- 字段: adventurer_uid, medal_id, acquired_at
-- 需要先获取 medal_id
-- ==============================================
INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'MAGE.Z.012', id, NOW() - INTERVAL '365 days' FROM medals WHERE name = '初入江湖';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'MAGE.Z.012', id, NOW() - INTERVAL '300 days' FROM medals WHERE name = '黄铜流派胸针';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'MAGE.Z.012', id, NOW() - INTERVAL '200 days' FROM medals WHERE name = '银翼勋章';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'MAGE.Z.012', id, NOW() - INTERVAL '100 days' FROM medals WHERE name = '金樽持有者';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'MAGE.Z.012', id, NOW() - INTERVAL '50 days' FROM medals WHERE name = '传奇刻印';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'CAM.RED.001', id, NOW() - INTERVAL '200 days' FROM medals WHERE name = '初入江湖';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'CAM.RED.001', id, NOW() - INTERVAL '150 days' FROM medals WHERE name = '黄铜流派胸针';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'CAM.RED.001', id, NOW() - INTERVAL '80 days' FROM medals WHERE name = '银翼勋章';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'CAM.RED.001', id, NOW() - INTERVAL '30 days' FROM medals WHERE name = '摄影大师';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'EDIT.WK.002', id, NOW() - INTERVAL '180 days' FROM medals WHERE name = '初入江湖';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'EDIT.WK.002', id, NOW() - INTERVAL '120 days' FROM medals WHERE name = '黄铜流派胸针';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'EDIT.WK.002', id, NOW() - INTERVAL '40 days' FROM medals WHERE name = '剪辑达人';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'DRONE.X.003', id, NOW() - INTERVAL '100 days' FROM medals WHERE name = '初入江湖';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'DRONE.X.003', id, NOW() - INTERVAL '20 days' FROM medals WHERE name = '航拍专家';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'DESIGN.ART.004', id, NOW() - INTERVAL '150 days' FROM medals WHERE name = '初入江湖';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'DESIGN.ART.004', id, NOW() - INTERVAL '90 days' FROM medals WHERE name = '黄铜流派胸针';

INSERT INTO adventurer_medals (adventurer_uid, medal_id, acquired_at)
SELECT 'SOUND.MIC.005', id, NOW() - INTERVAL '80 days' FROM medals WHERE name = '初入江湖';

-- ==============================================
-- 5. 赏金任务数据 (bounties)
-- 字段: id, title, description, difficulty, reward_prestige, reward_items, issuer_uid, status, claimed_by_uid, created_at, expires_at
-- ==============================================
INSERT INTO bounties (title, description, difficulty, reward_prestige, reward_items, issuer_uid, status, created_at, expires_at)
VALUES
  ('西溪湿地风光拍摄', '需要一名摄影师完成西溪湿地秋季风光拍摄，要求日出和日落时段各拍摄3小时。', 'normal', 200, '{"相机", "三脚架"}', 'MAGE.Z.012', 'active', NOW(), NOW() + INTERVAL '7 days'),
  ('企业宣传片后期制作', '时长3分钟的企业宣传片后期制作，包含剪辑、调色、配乐。', 'hard', 500, '{"剪辑软件"}', 'MAGE.Z.012', 'active', NOW(), NOW() + INTERVAL '14 days'),
  ('新品发布会跟拍', '全程跟拍科技新品发布会，包括彩排和正式活动。', 'hard', 450, '{"双机位", "灯光设备"}', 'DESIGN.ART.004', 'active', NOW(), NOW() + INTERVAL '5 days'),
  ('短视频内容创作', '为电商平台创作10条产品短视频，每条30秒。', 'normal', 300, '{"拍摄设备"}', 'CAM.RED.001', 'active', NOW(), NOW() + INTERVAL '10 days'),
  ('城市夜景航拍', '拍摄杭州城市夜景航拍素材，要求4K分辨率。', 'hard', 350, '{"无人机", "夜航灯"}', 'DRONE.X.003', 'active', NOW(), NOW() + INTERVAL '7 days'),
  ('活动照片精修', '精修200张活动照片，包括调色、人像处理。', 'easy', 150, '{"修图软件"}', 'CAM.RED.001', 'active', NOW(), NOW() + INTERVAL '5 days'),
  ('品牌视觉设计', '设计一套品牌视觉识别系统，包含Logo和VI手册。', 'legendary', 800, '{"设计软件"}', 'DESIGN.ART.004', 'active', NOW(), NOW() + INTERVAL '21 days'),
  ('纪录片剪辑', '时长30分钟的纪录片粗剪，素材已拍摄完成。', 'legendary', 1000, '{"剪辑工作站"}', 'EDIT.WK.002', 'active', NOW(), NOW() + INTERVAL '28 days'),
  ('会议录音整理', '整理4小时的会议录音，输出文字稿。', 'easy', 100, '{"录音设备"}', 'SOUND.MIC.005', 'active', NOW(), NOW() + INTERVAL '3 days'),
  ('短视频账号运营', '负责短视频账号运营1个月，包括内容策划和发布。', 'normal', 600, '{"运营工具"}', 'EDIT.WK.002', 'active', NOW(), NOW() + INTERVAL '30 days'),
  ('产品摄影', '为电商产品拍摄白底图和场景图各20张。', 'normal', 250, '{"摄影棚", "灯光"}', 'CAM.RED.001', 'active', NOW(), NOW() + INTERVAL '7 days'),
  ('广告配音', '为30秒广告片录制配音。', 'easy', 180, '{"麦克风", "录音棚"}', 'SOUND.MIC.005', 'active', NOW(), NOW() + INTERVAL '3 days');

-- ==============================================
-- 6. 江湖传闻 (gossips)
-- 字段: id, content, source_uid, is_verified, created_at
-- ==============================================
INSERT INTO gossips (content, source_uid, is_verified, created_at)
VALUES
  ('🎉 枫榕酒馆声望系统正式上线！完成任务可获得声望奖励', 'MAGE.Z.012', true, NOW()),
  ('📢 新到一批顶级摄影器材，欢迎冒险者前来品鉴', 'CAM.RED.001', true, NOW() - INTERVAL '1 day'),
  ('⭐ 传奇猎人「枫榕馆主」解锁全新成就「江湖传说」', 'MAGE.Z.012', true, NOW() - INTERVAL '2 days'),
  ('🌧️ 雨天活动注意事项：法器防潮保护指南已更新', 'DRONE.X.003', false, NOW() - INTERVAL '3 days'),
  ('🎁 新会员注册即送100声望，快来加入我们！', 'MAGE.Z.012', true, NOW() - INTERVAL '4 days'),
  ('📸 本周热门任务：西溪湿地秋季拍摄，奖励丰厚！', 'CAM.RED.001', true, NOW() - INTERVAL '5 days');

-- ==============================================
-- 完成
-- ==============================================
SELECT '示例数据导入完成！' as result;
SELECT (SELECT COUNT(*) FROM adventurers) as adventurers_count;
SELECT (SELECT COUNT(*) FROM gears) as gears_count;
SELECT (SELECT COUNT(*) FROM bounties) as bounties_count;
SELECT (SELECT COUNT(*) FROM medals) as medals_count;