# 枫榕赏金酒馆 - 数据库架构 V0.6

## 📁 目录结构

```
FR SQL/
├── tavern_database.sql      # 完整数据库建表脚本
├── database_config.js       # 前端数据库API服务层
└── README.md                # 数据库使用说明
```

## 🚀 快速开始

### 1. 数据库部署

#### PostgreSQL (推荐)

```bash
# 创建数据库
createdb -U postgres tavern_db

# 执行建表脚本
psql -U postgres -d tavern_db -f tavern_database.sql
```

#### Supabase (云服务)

1. 在 [Supabase](https://supabase.com/) 创建新项目
2. 在 SQL Editor 中执行 `tavern_database.sql` 脚本
3. 获取项目 URL 和 API Key

### 2. 配置前端连接

编辑 `database_config.js` 文件：

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

## 🗄️ 数据库架构

### 核心表结构

| 表名 | 说明 | 状态 |
|------|------|------|
| `adventurers` | 冒险者档案 | ✅ |
| `gears` | 法器库 | ✅ |
| `bounties` | 任务委托 | ✅ |
| `bounty_completions` | 任务完成记录 | ✅ |
| `medals` | 勋章定义 | ✅ |
| `adventurer_medals` | 冒险者勋章关联 | ✅ |
| `gossips` | 江湖传闻 | ✅ |
| `notifications` | 酒馆通知 | ✅ |

### 关系图

```
adventurers 1:N gears
adventurers 1:N bounties (issuer)
adventurers 1:N bounties (claimant)
adventurers 1:N adventurer_medals
medals 1:N adventurer_medals
bounties 1:N bounty_completions
```

## 🔧 API 服务层

### 使用示例

```javascript
// 加载冒险者档案
const adventurer = await TavernDatabase.adventurer.loadAdventurer('MAGE.Z.012');

// 增加声望
const newPrestige = await TavernDatabase.prestige.addPrestige('MAGE.Z.012', 150);

// 获取活跃任务
const bounties = await TavernDatabase.bounty.getActiveBounties();

// 添加法器战损
const result = await TavernDatabase.gear.applyTape(gearId);
```

### 服务模块

| 模块 | 方法 | 说明 |
|------|------|------|
| `adventurer` | `loadAdventurer(uid)` | 加载冒险者档案 |
| `adventurer` | `updateAdventurer(uid, updates)` | 更新档案 |
| `adventurer` | `getLeaderboard(limit)` | 获取排行榜 |
| `gear` | `getGearsByOwner(uid)` | 获取法器列表 |
| `gear` | `updateGear(id, updates)` | 更新法器状态 |
| `gear` | `applyTape(gearId)` | 添加大力胶 |
| `bounty` | `getActiveBounties()` | 获取活跃任务 |
| `bounty` | `createBounty(data)` | 创建任务 |
| `bounty` | `claimBounty(id, uid)` | 领取任务 |
| `bounty` | `completeBounty(id, uid, rating, feedback)` | 完成任务 |
| `prestige` | `addPrestige(uid, amount)` | 增加声望 |
| `prestige` | `getPrestige(uid)` | 获取声望 |
| `medal` | `getMedalsByAdventurer(uid)` | 获取勋章 |
| `medal` | `awardMedal(uid, medalId)` | 授予勋章 |
| `gossip` | `getLatestGossips(limit)` | 获取传闻 |
| `gossip` | `createGossip(content, uid)` | 发布传闻 |
| `notification` | `getUnreadNotifications(uid)` | 获取未读通知 |
| `notification` | `markAllAsRead(uid)` | 标记已读 |

## ⚡ 数据库函数

### increment_prestige
```sql
SELECT increment_prestige('MAGE.Z.012', 100);
```
增加冒险者声望值。

### cool_down_gears
```sql
SELECT cool_down_gears();
```
冷却所有法器热度（每调用一次降低5点热度）。

## 📊 视图

### adventurer_details
包含法器数量和勋章数量的冒险者详情视图。

### active_bounties
活跃任务视图，包含发布者信息。

## 🔐 权限设置示例

```sql
-- 创建应用用户
CREATE ROLE tavern_app WITH LOGIN PASSWORD 'secure_password';

-- 授予权限
GRANT SELECT, INSERT, UPDATE ON adventurers TO tavern_app;
GRANT SELECT, INSERT, UPDATE ON gears TO tavern_app;
GRANT SELECT, INSERT ON bounties TO tavern_app;
GRANT EXECUTE ON FUNCTION increment_prestige TO tavern_app;
```

## 📝 数据初始化

脚本已包含以下初始数据：

**冒险者**
- MAGE.Z.012 - 枫榕馆主（传奇猎人）
- CAM.RED.001 - 红隼（资深猎人）
- EDIT.WK.002 - 剪辑术士（中级猎人）
- DRONE.X.003 - 飞影（初级猎人）

**勋章**
- 🥉 黄铜流派胸针
- 🥈 银翼勋章
- 🥇 金樽持有者
- 👑 传奇刻印

**任务委托示例**
- 西溪湿地风光采集
- 古城夜景拍摄
- 企业宣传片制作

## 📈 索引优化

脚本已为常用查询创建索引：

- `idx_adventurers_uid` - 冒险者编号查询
- `idx_adventurers_prestige` - 声望排行榜
- `idx_adventurers_tier` - 段位筛选
- `idx_gears_owner_uid` - 法器归属查询
- `idx_bounties_status` - 任务状态筛选
- `idx_bounties_difficulty` - 难度筛选

## 📌 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| V0.6 | 2026-04-27 | 完整数据库架构 |
| V0.5 | 2026-04-27 | 添加声望系统、通知系统 |
| V0.4 | 2026-04-27 | 法器状态机、视图管理器 |
| V0.3 | 2026-04-27 | 天气系统、深夜模式 |
| V0.2 | 2026-04-27 | 拟物化设计、火漆印章 |
| V0.1 | 2026-04-27 | 基础静态页面 |

## 📞 联系信息

**枫榕赏金酒馆** · 传媒江湖补给站  
杭州 · 3号桌恭候大驾  
Powered by 林峰系统论 V3.1