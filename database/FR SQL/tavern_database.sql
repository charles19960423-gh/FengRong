-- ==============================================
-- 枫榕赏金酒馆 - 数据库架构 V0.6
-- ==============================================
-- 江湖档案系统 · 法器库 · 任务委托系统
-- ==============================================

-- 初始化扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==============================================
-- 1. 冒险者档案表 (Adventurers)
-- ==============================================
CREATE TABLE adventurers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid TEXT UNIQUE NOT NULL,           -- 江湖编号，如 MAGE.Z.012
    display_name TEXT,                  -- 绰号/显示名
    prestige INTEGER DEFAULT 2850,      -- 声望值
    level TEXT DEFAULT '初级猎人',        -- 等级称号
    tier TEXT DEFAULT 'bronze',         -- 段位: bronze/silver/gold/legendary
    avatar_url TEXT,                    -- 头像URL
    bio TEXT,                           -- 个人简介
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引优化
CREATE INDEX idx_adventurers_uid ON adventurers(uid);
CREATE INDEX idx_adventurers_prestige ON adventurers(prestige DESC);
CREATE INDEX idx_adventurers_tier ON adventurers(tier);

-- ==============================================
-- 2. 法器库 (Gears)
-- ==============================================
CREATE TABLE gears (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_uid TEXT REFERENCES adventurers(uid) ON DELETE CASCADE, -- 关联冒险者编号
    gear_type TEXT NOT NULL,            -- 🎥, 💻, 🛸, 🎙️ 等设备类型
    gear_name TEXT NOT NULL,            -- 设备名称
    wear_count INTEGER DEFAULT 0,       -- 战损值 (大力胶数量)
    heat_level INTEGER DEFAULT 0,       -- 热度值 (0-100)
    tape_positions JSONB DEFAULT '[]',  -- 存储大力胶的坐标和旋转角度
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- 索引优化
CREATE INDEX idx_gears_owner_uid ON gears(owner_uid);
CREATE INDEX idx_gears_gear_type ON gears(gear_type);

-- ==============================================
-- 3. 任务委托表 (Bounties)
-- ==============================================
CREATE TABLE bounties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,                -- 委托标题
    description TEXT,                   -- 委托描述
    difficulty TEXT DEFAULT 'normal',   -- 难度: easy/normal/hard/legendary
    reward_prestige INTEGER DEFAULT 100, -- 声望奖励
    reward_items TEXT[],                -- 物品奖励
    issuer_uid TEXT REFERENCES adventurers(uid), -- 发布者
    status TEXT DEFAULT 'active',       -- 状态: active/claimed/completed/expired
    claimed_by_uid TEXT REFERENCES adventurers(uid), -- 领取者
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 索引优化
CREATE INDEX idx_bounties_status ON bounties(status);
CREATE INDEX idx_bounties_difficulty ON bounties(difficulty);
CREATE INDEX idx_bounties_issuer_uid ON bounties(issuer_uid);

-- ==============================================
-- 4. 任务完成记录表 (Bounty_Completions)
-- ==============================================
CREATE TABLE bounty_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bounty_id UUID REFERENCES bounties(id) ON DELETE CASCADE,
    adventurer_uid TEXT REFERENCES adventurers(uid),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 评价星级
    feedback TEXT                       -- 反馈评价
);

-- ==============================================
-- 5. 勋章表 (Medals)
-- ==============================================
CREATE TABLE medals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,                 -- 勋章名称
    description TEXT,                   -- 勋章描述
    icon TEXT,                          -- 勋章图标
    rarity TEXT DEFAULT 'common',       -- 稀有度: common/rare/epic/legendary
    requirement TEXT                    -- 获取条件描述
);

-- ==============================================
-- 6. 冒险者勋章关联表 (Adventurer_Medals)
-- ==============================================
CREATE TABLE adventurer_medals (
    adventurer_uid TEXT REFERENCES adventurers(uid) ON DELETE CASCADE,
    medal_id UUID REFERENCES medals(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (adventurer_uid, medal_id)
);

-- ==============================================
-- 7. 江湖传闻表 (Gossips)
-- ==============================================
CREATE TABLE gossips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,              -- 传闻内容
    source_uid TEXT REFERENCES adventurers(uid), -- 来源冒险者
    is_verified BOOLEAN DEFAULT FALSE, -- 是否已验证
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 8. 酒馆通知表 (Notifications)
-- ==============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_uid TEXT REFERENCES adventurers(uid) ON DELETE CASCADE,
    type TEXT NOT NULL,                 -- 通知类型: system/bounty/medal/gossip
    title TEXT,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 数据库函数与触发器
-- ==============================================

-- 声望增长函数
CREATE OR REPLACE FUNCTION increment_prestige(user_uid TEXT, amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
    new_prestige INTEGER;
BEGIN
    UPDATE adventurers
    SET prestige = prestige + amount,
        last_active_at = NOW()
    WHERE uid = user_uid
    RETURNING prestige INTO new_prestige;
    
    RETURN new_prestige;
END;
$$ LANGUAGE plpgsql;

-- 法器热度冷却函数
CREATE OR REPLACE FUNCTION cool_down_gears()
RETURNS VOID AS $$
BEGIN
    UPDATE gears
    SET heat_level = GREATEST(0, heat_level - 5)
    WHERE heat_level > 0;
END;
$$ LANGUAGE plpgsql;

-- 法器使用记录触发器
CREATE OR REPLACE FUNCTION update_gear_last_used()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE gears
    SET last_used_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_gear_used
AFTER UPDATE OF heat_level ON gears
FOR EACH ROW EXECUTE FUNCTION update_gear_last_used();

-- ==============================================
-- 初始化数据
-- ==============================================

-- 初始冒险者数据
INSERT INTO adventurers (uid, display_name, prestige, level, tier) VALUES
('MAGE.Z.012', '枫榕馆主', 9999, '传奇猎人', 'legendary'),
('CAM.RED.001', '红隼', 5800, '资深猎人', 'gold'),
('EDIT.WK.002', '剪辑术士', 3200, '中级猎人', 'silver'),
('DRONE.X.003', '飞影', 2100, '初级猎人', 'bronze');

-- 初始法器数据
INSERT INTO gears (owner_uid, gear_type, gear_name, wear_count, heat_level) VALUES
('MAGE.Z.012', '🎥', 'RED V-Raptor', 3, 45),
('MAGE.Z.012', '🛸', 'Inspire 3', 1, 20),
('MAGE.Z.012', '💻', 'M3 Max Node', 0, 60),
('CAM.RED.001', '🎥', 'Sony A1', 2, 30),
('EDIT.WK.002', '💻', 'Mac Studio', 1, 40),
('DRONE.X.003', '🛸', 'Mavic 3', 0, 15);

-- 初始勋章数据
INSERT INTO medals (name, description, icon, rarity, requirement) VALUES
('黄铜流派胸针', '完成首次任务委托即可获得', '🥉', 'common', '完成1次委托'),
('银翼勋章', '累计完成10次委托', '🥈', 'rare', '完成10次委托'),
('金樽持有者', '累计获得10000声望', '🥇', 'epic', '声望达到10000'),
('传奇刻印', '江湖传说级猎人专属', '👑', 'legendary', '完成50次传说级委托');

-- 初始任务委托
INSERT INTO bounties (title, description, difficulty, reward_prestige, issuer_uid, expires_at) VALUES
('西溪湿地风光采集', '记录湿地晨雾美景，需要航拍设备', 'normal', 150, 'MAGE.Z.012', NOW() + INTERVAL '7 days'),
('古城夜景拍摄', '拍摄杭州古城夜景，要求4K画质', 'hard', 300, 'MAGE.Z.012', NOW() + INTERVAL '5 days'),
('企业宣传片制作', '为知名企业制作品牌宣传片', 'legendary', 800, 'CAM.RED.001', NOW() + INTERVAL '14 days');

-- ==============================================
-- 视图定义
-- ==============================================

-- 冒险者详情视图（包含法器数量和勋章数量）
CREATE VIEW adventurer_details AS
SELECT 
    a.*,
    (SELECT COUNT(*) FROM gears g WHERE g.owner_uid = a.uid) as gear_count,
    (SELECT COUNT(*) FROM adventurer_medals am WHERE am.adventurer_uid = a.uid) as medal_count
FROM adventurers a;

-- 热门任务视图
CREATE VIEW active_bounties AS
SELECT 
    b.*,
    a.display_name as issuer_name
FROM bounties b
JOIN adventurers a ON b.issuer_uid = a.uid
WHERE b.status = 'active'
ORDER BY b.created_at DESC;

-- ==============================================
-- 权限设置示例
-- ==============================================
-- CREATE ROLE tavern_app WITH LOGIN PASSWORD 'your_password';
-- GRANT SELECT, INSERT, UPDATE ON adventurers TO tavern_app;
-- GRANT SELECT, INSERT, UPDATE ON gears TO tavern_app;
-- GRANT SELECT, INSERT ON bounties TO tavern_app;
-- GRANT EXECUTE ON FUNCTION increment_prestige TO tavern_app;

-- ==============================================
-- 结束
-- ==============================================
COMMIT;
-- ==============================================
-- 枫榕赏金酒馆数据库架构设计完成
-- ==============================================