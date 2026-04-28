-- ==============================================
-- 枫榕赏金酒馆 - 数据库架构 V0.6 (安全版本)
-- 支持重复执行，不会因表已存在而报错
-- ==============================================

-- 初始化扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==============================================
-- 1. 冒险者档案表 (Adventurers)
-- ==============================================
CREATE TABLE IF NOT EXISTS adventurers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid TEXT UNIQUE NOT NULL,
    display_name TEXT,
    prestige INTEGER DEFAULT 2850,
    level TEXT DEFAULT '初级猎人',
    tier TEXT DEFAULT 'bronze',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. 法器库 (Gears)
-- ==============================================
CREATE TABLE IF NOT EXISTS gears (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_uid TEXT REFERENCES adventurers(uid) ON DELETE CASCADE,
    gear_type TEXT NOT NULL,
    gear_name TEXT NOT NULL,
    wear_count INTEGER DEFAULT 0,
    heat_level INTEGER DEFAULT 0,
    tape_positions JSONB DEFAULT '[]',
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================
-- 3. 任务委托表 (Bounties)
-- ==============================================
CREATE TABLE IF NOT EXISTS bounties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT DEFAULT 'normal',
    reward_prestige INTEGER DEFAULT 100,
    reward_items TEXT[],
    issuer_uid TEXT REFERENCES adventurers(uid),
    status TEXT DEFAULT 'active',
    claimed_by_uid TEXT REFERENCES adventurers(uid),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================
-- 4. 任务完成记录表 (Bounty_Completions)
-- ==============================================
CREATE TABLE IF NOT EXISTS bounty_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bounty_id UUID REFERENCES bounties(id) ON DELETE CASCADE,
    adventurer_uid TEXT REFERENCES adventurers(uid),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT
);

-- ==============================================
-- 5. 勋章表 (Medals)
-- ==============================================
CREATE TABLE IF NOT EXISTS medals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    rarity TEXT DEFAULT 'common',
    requirement TEXT
);

-- ==============================================
-- 6. 冒险者勋章关联表 (Adventurer_Medals)
-- ==============================================
CREATE TABLE IF NOT EXISTS adventurer_medals (
    adventurer_uid TEXT REFERENCES adventurers(uid) ON DELETE CASCADE,
    medal_id UUID REFERENCES medals(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (adventurer_uid, medal_id)
);

-- ==============================================
-- 7. 江湖传闻表 (Gossips)
-- ==============================================
CREATE TABLE IF NOT EXISTS gossips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    source_uid TEXT REFERENCES adventurers(uid),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 8. 酒馆通知表 (Notifications)
-- ==============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_uid TEXT REFERENCES adventurers(uid) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 数据库函数（如果不存在则创建）
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

-- 法器热度增加函数
CREATE OR REPLACE FUNCTION increase_gear_heat(gear_id UUID, amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
    new_heat INTEGER;
BEGIN
    UPDATE gears
    SET heat_level = LEAST(100, heat_level + amount),
        last_used_at = NOW()
    WHERE id = gear_id
    RETURNING heat_level INTO new_heat;
    
    RETURN new_heat;
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

-- ==============================================
-- 触发器函数
-- ==============================================
CREATE OR REPLACE FUNCTION update_gear_last_used()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE gears
    SET last_used_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 视图（如果不存在则创建）
-- ==============================================
CREATE OR REPLACE VIEW adventurer_details AS
SELECT 
    a.*,
    (SELECT COUNT(*) FROM gears g WHERE g.owner_uid = a.uid) as gear_count,
    (SELECT COUNT(*) FROM adventurer_medals am WHERE am.adventurer_uid = a.uid) as medal_count
FROM adventurers a;

CREATE OR REPLACE VIEW active_bounties AS
SELECT 
    b.*,
    a.display_name as issuer_name
FROM bounties b
JOIN adventurers a ON b.issuer_uid = a.uid
WHERE b.status = 'active'
ORDER BY b.created_at DESC;

-- ==============================================
-- 初始化数据（仅在表为空时插入）
-- ==============================================

-- 初始冒险者数据
INSERT INTO adventurers (uid, display_name, prestige, level, tier)
SELECT 'MAGE.Z.012', '枫榕馆主', 9999, '传奇猎人', 'legendary'
WHERE NOT EXISTS (SELECT 1 FROM adventurers WHERE uid = 'MAGE.Z.012');

INSERT INTO adventurers (uid, display_name, prestige, level, tier)
SELECT 'CAM.RED.001', '红隼', 5800, '资深猎人', 'gold'
WHERE NOT EXISTS (SELECT 1 FROM adventurers WHERE uid = 'CAM.RED.001');

INSERT INTO adventurers (uid, display_name, prestige, level, tier)
SELECT 'EDIT.WK.002', '剪辑术士', 3200, '中级猎人', 'silver'
WHERE NOT EXISTS (SELECT 1 FROM adventurers WHERE uid = 'EDIT.WK.002');

INSERT INTO adventurers (uid, display_name, prestige, level, tier)
SELECT 'DRONE.X.003', '飞影', 2100, '初级猎人', 'bronze'
WHERE NOT EXISTS (SELECT 1 FROM adventurers WHERE uid = 'DRONE.X.003');

-- 初始勋章数据
INSERT INTO medals (name, description, icon, rarity, requirement)
SELECT '黄铜流派胸针', '完成首次任务委托即可获得', '🥉', 'common', '完成1次委托'
WHERE NOT EXISTS (SELECT 1 FROM medals WHERE name = '黄铜流派胸针');

INSERT INTO medals (name, description, icon, rarity, requirement)
SELECT '银翼勋章', '累计完成10次委托', '🥈', 'rare', '完成10次委托'
WHERE NOT EXISTS (SELECT 1 FROM medals WHERE name = '银翼勋章');

INSERT INTO medals (name, description, icon, rarity, requirement)
SELECT '金樽持有者', '累计获得10000声望', '🥇', 'epic', '声望达到10000'
WHERE NOT EXISTS (SELECT 1 FROM medals WHERE name = '金樽持有者');

INSERT INTO medals (name, description, icon, rarity, requirement)
SELECT '传奇刻印', '江湖传说级猎人专属', '👑', 'legendary', '完成50次传说级委托'
WHERE NOT EXISTS (SELECT 1 FROM medals WHERE name = '传奇刻印');

-- ==============================================
-- V0.7 优化：声望增长函数
-- ==============================================
CREATE OR REPLACE FUNCTION increment_prestige(user_uid TEXT, amount INT)
RETURNS void AS $$
BEGIN
  UPDATE adventurers
  SET prestige = prestige + amount
  WHERE uid = user_uid;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 完成
-- ==============================================
SELECT '枫榕赏金酒馆数据库初始化完成！' as result;
