/**
 * 成就模块 - AchievementModule
 * 提供成就数据管理、佩戴、统计等功能
 * 使用方式：AchievementModule.getStats(), AchievementModule.equip(), etc.
 */
const AchievementModule = (function() {
    // 成就数据模型
    const achievementData = {
        "first-bounty": {
            id: "first-bounty",
            name: "首次揭榜",
            icon: "🪵",
            rarity: "common",
            rarityText: "普通",
            category: "赏金任务",
            description: "完成第一个赏金任务",
            story: "江湖新人初入酒馆，在悬赏公告板前驻足良久，终于接下人生第一份委托。从此，传奇的序章正式展开...",
            unlockedAt: "2024-01-15",
            progress: 100,
            requirements: { type: "task", target: 1, current: 1 },
            rewards: { prestige: 50, title: "江湖新秀" }
        },
        "regular": {
            id: "regular",
            name: "酒馆熟客",
            icon: "🔑",
            rarity: "common",
            rarityText: "普通",
            category: "酒馆打卡",
            description: "连续7天登录",
            story: "每日必到酒馆报到，与掌柜相谈甚欢。这份坚持，让你成为了酒馆里最熟悉的面孔。",
            unlockedAt: "2024-01-22",
            progress: 100,
            requirements: { type: "login", target: 7, current: 7 },
            rewards: { prestige: 100, title: "常客" }
        },
        "whiskey": {
            id: "whiskey",
            name: "威士忌收藏家",
            icon: "🥃",
            rarity: "uncommon",
            rarityText: "精良",
            category: "藏品收集",
            description: "收集10种法器",
            story: "在江湖中闯荡，收集了各式各样的法器。每一件都是冒险的见证，每一件都藏着独特的故事。",
            unlockedAt: "2024-02-01",
            progress: 100,
            requirements: { type: "collect", target: 10, current: 10 },
            rewards: { prestige: 200, title: "收藏家" }
        },
        "legend": {
            id: "legend",
            name: "江湖传说",
            icon: "⚔️",
            rarity: "legendary",
            rarityText: "传说",
            category: "传奇殿堂",
            description: "声望达到1000",
            story: "你的名字在江湖中广为流传，无论是酒馆里的闲谈，还是茶楼中的议论，都离不开你的传奇故事。",
            unlockedAt: null,
            progress: 65,
            requirements: { type: "prestige", target: 1000, current: 650 },
            rewards: { prestige: 500, title: "江湖传说" }
        },
        "task-master": {
            id: "task-master",
            name: "赏金猎人",
            icon: "🎯",
            rarity: "uncommon",
            rarityText: "精良",
            category: "赏金任务",
            description: "完成10个赏金任务",
            story: "十次揭榜，十次凯旋。你的战绩在酒馆公告板上熠熠生辉，成为众多冒险者的榜样。",
            unlockedAt: null,
            progress: 70,
            requirements: { type: "task", target: 10, current: 7 },
            rewards: { prestige: 300, title: "赏金猎人" }
        },
        "perfect-task": {
            id: "perfect-task",
            name: "完美执行",
            icon: "⭐",
            rarity: "rare",
            rarityText: "稀有",
            category: "赏金任务",
            description: "以完美评价完成5个任务",
            story: "不仅完成任务，更追求极致。每一次交付都无可挑剔，你的专业精神令人叹服。",
            unlockedAt: null,
            progress: 40,
            requirements: { type: "perfect", target: 5, current: 2 },
            rewards: { prestige: 400, title: "完美执行者" }
        },
        "social-star": {
            id: "social-star",
            name: "社交达人",
            icon: "🌟",
            rarity: "uncommon",
            rarityText: "精良",
            category: "社交达人",
            description: "邀请3位好友加入",
            story: "一人独行快，众人同行远。你将酒馆的故事分享给更多人，让江湖更加热闹。",
            unlockedAt: "2024-02-10",
            progress: 100,
            requirements: { type: "invite", target: 3, current: 3 },
            rewards: { prestige: 150, title: "社交达人" }
        },
        "night-owl": {
            id: "night-owl",
            name: "夜猫子",
            icon: "🦉",
            rarity: "common",
            rarityText: "普通",
            category: "酒馆打卡",
            description: "在深夜(23:00-02:00)登录5次",
            story: "夜深人静时，酒馆的灯火依然为你点亮。那些在深夜完成的任务，都成了难忘的回忆。",
            unlockedAt: null,
            progress: 60,
            requirements: { type: "night", target: 5, current: 3 },
            rewards: { prestige: 80, title: "夜行者" }
        },
        "gear-master": {
            id: "gear-master",
            name: "法器大师",
            icon: "🔮",
            rarity: "epic",
            rarityText: "史诗",
            category: "藏品收集",
            description: "收集30种法器",
            story: "从普通的铜剑到传说中的神器，你的藏品足以开设一座小型法器博物馆。",
            unlockedAt: null,
            progress: 20,
            requirements: { type: "collect", target: 30, current: 6 },
            rewards: { prestige: 800, title: "法器大师" }
        },
        "season-1": {
            id: "season-1",
            name: "第一季参与者",
            icon: "🏅",
            rarity: "rare",
            rarityText: "稀有",
            category: "赛季之星",
            description: "参与第一赛季活动",
            story: "在酒馆开业之初便投身其中，见证了第一个赛季的风起云涌。这份经历，是你江湖资历的最好证明。",
            unlockedAt: "2024-01-31",
            progress: 100,
            requirements: { type: "season", target: 1, current: 1 },
            rewards: { prestige: 250, title: "先驱者" }
        },
        "rich-man": {
            id: "rich-man",
            name: "金主",
            icon: "💰",
            rarity: "rare",
            rarityText: "稀有",
            category: "传奇殿堂",
            description: "累计获得10000声望",
            story: "声望如流水般汇聚而来，你的名字已成为财富与实力的象征。",
            unlockedAt: null,
            progress: 28,
            requirements: { type: "total-prestige", target: 10000, current: 2800 },
            rewards: { prestige: 500, title: "金主" }
        },
        "loyal": {
            id: "loyal",
            name: "忠诚卫士",
            icon: "🛡️",
            rarity: "epic",
            rarityText: "史诗",
            category: "酒馆打卡",
            description: "连续登录30天",
            story: "一个月的坚守，见证了你的忠诚与执着。酒馆因你这样的守护者而更加温暖。",
            unlockedAt: null,
            progress: 45,
            requirements: { type: "login", target: 30, current: 13 },
            rewards: { prestige: 600, title: "忠诚卫士" }
        },
        // === 现代传媒风成就 ===
        "headline-author": {
            id: "headline-author",
            name: "头条作者",
            icon: "📰",
            rarity: "common",
            rarityText: "普通",
            category: "头条速递",
            description: "发布首篇任务报道",
            story: "笔尖为剑，记录江湖风云的第一篇报道！你的文字将传遍整个酒馆。",
            unlockedAt: "2024-03-01",
            progress: 100,
            requirements: { type: "task", target: 1, current: 1 },
            rewards: { prestige: 50, title: "新锐记者" }
        },
        "traffic-star": {
            id: "traffic-star",
            name: "流量明星",
            icon: "📈",
            rarity: "uncommon",
            rarityText: "精良",
            category: "社交达人",
            description: "获得100次点赞",
            story: "你的报道引起了广泛关注，点赞数突破百次。江湖中，你的名字越来越响亮。",
            unlockedAt: null,
            progress: 75,
            requirements: { type: "likes", target: 100, current: 75 },
            rewards: { prestige: 150, title: "流量达人" }
        },
        "deep-investigation": {
            id: "deep-investigation",
            name: "深度调查",
            icon: "🔍",
            rarity: "uncommon",
            rarityText: "精良",
            category: "赏金任务",
            description: "完成10个深度任务",
            story: "深入事件背后，挖掘真相。每一次深度调查，都让你更接近江湖的本质。",
            unlockedAt: null,
            progress: 40,
            requirements: { type: "deep-task", target: 10, current: 4 },
            rewards: { prestige: 250, title: "调查记者" }
        },
        "material-expert": {
            id: "material-expert",
            name: "素材达人",
            icon: "📸",
            rarity: "rare",
            rarityText: "稀有",
            category: "藏品收集",
            description: "上传50张任务素材",
            story: "用镜头记录江湖的每一个精彩瞬间，你的素材库已经相当丰富。",
            unlockedAt: null,
            progress: 30,
            requirements: { type: "upload", target: 50, current: 15 },
            rewards: { prestige: 350, title: "素材大师" }
        },
        "opinion-leader": {
            id: "opinion-leader",
            name: "意见领袖",
            icon: "🎤",
            rarity: "rare",
            rarityText: "稀有",
            category: "社交达人",
            description: "粉丝数达到1000",
            story: "你的观点影响着众多江湖人士，成为大家信赖的意见领袖。",
            unlockedAt: null,
            progress: 25,
            requirements: { type: "followers", target: 1000, current: 250 },
            rewards: { prestige: 450, title: "江湖名嘴" }
        },
        "yearly-journalist": {
            id: "yearly-journalist",
            name: "年度记者",
            icon: "🏅",
            rarity: "epic",
            rarityText: "史诗",
            category: "赛季之星",
            description: "获得年度最佳记者称号",
            story: "一年的辛勤耕耘，终于收获荣誉。你成为了江湖公认的年度最佳记者！",
            unlockedAt: null,
            progress: 0,
            requirements: { type: "season-points", target: 5000, current: 0 },
            rewards: { prestige: 800, title: "年度风云记者" }
        },
        "media-tycoon": {
            id: "media-tycoon",
            name: "传媒大亨",
            icon: "👑",
            rarity: "legendary",
            rarityText: "传说",
            category: "传奇殿堂",
            description: "建立自己的传媒帝国",
            story: "从一名普通记者到传媒帝国的缔造者，你的传奇故事将被永远铭记。",
            unlockedAt: null,
            progress: 0,
            requirements: { type: "complete-all", target: 1, current: 0 },
            rewards: { prestige: 1500, title: "传媒帝王" }
        },
        "daily-update": {
            id: "daily-update",
            name: "每日一更",
            icon: "⏰",
            rarity: "common",
            rarityText: "普通",
            category: "酒馆打卡",
            description: "连续发布30天内容",
            story: "坚持每日更新，从未间断。你的勤奋与坚持，让读者养成了每天期待的习惯。",
            unlockedAt: null,
            progress: 10,
            requirements: { type: "daily-post", target: 30, current: 3 },
            rewards: { prestige: 100, title: "勤勉作者" }
        },
        // === 现代传媒风扩展成就 ===
        "hotspot-tracker": {
            id: "hotspot-tracker",
            name: "热点追踪者",
            icon: "🌡️",
            rarity: "common",
            rarityText: "普通",
            category: "头条速递",
            description: "连续7天发布热点内容",
            story: "紧跟时事热点，第一时间传递江湖动态。你的报道总是走在最前沿！",
            unlockedAt: null,
            progress: 50,
            requirements: { type: "hotspot", target: 7, current: 3 },
            rewards: { prestige: 80, title: "热点先锋" }
        },
        "exclusive-scoop": {
            id: "exclusive-scoop",
            name: "独家爆料",
            icon: "🎯",
            rarity: "uncommon",
            rarityText: "精良",
            category: "头条速递",
            description: "发布5篇独家报道",
            story: "挖掘不为人知的内幕，每一篇独家报道都能引起江湖震动！",
            unlockedAt: null,
            progress: 60,
            requirements: { type: "exclusive", target: 5, current: 3 },
            rewards: { prestige: 200, title: "独家记者" }
        },
        "video-creator": {
            id: "video-creator",
            name: "视频达人",
            icon: "🎬",
            rarity: "uncommon",
            rarityText: "精良",
            category: "藏品收集",
            description: "发布10个视频内容",
            story: "用镜头讲述江湖故事，你的视频作品广受好评！",
            unlockedAt: null,
            progress: 40,
            requirements: { type: "video", target: 10, current: 4 },
            rewards: { prestige: 220, title: "视频创作者" }
        },
        "columnist": {
            id: "columnist",
            name: "专栏作家",
            icon: "✍️",
            rarity: "rare",
            rarityText: "稀有",
            category: "头条速递",
            description: "开设并更新专栏10期",
            story: "深耕某一领域，你的专栏成为众多读者的必读内容！",
            unlockedAt: null,
            progress: 30,
            requirements: { type: "column", target: 10, current: 3 },
            rewards: { prestige: 400, title: "专栏作家" }
        },
        "live-star": {
            id: "live-star",
            name: "直播新星",
            icon: "🎤",
            rarity: "rare",
            rarityText: "稀有",
            category: "社交达人",
            description: "完成5次直播",
            story: "镜头前的你魅力四射，每次直播都吸引众多观众！",
            unlockedAt: null,
            progress: 20,
            requirements: { type: "live", target: 5, current: 1 },
            rewards: { prestige: 380, title: "直播达人" }
        },
        "data-analyst": {
            id: "data-analyst",
            name: "数据分析师",
            icon: "📊",
            rarity: "epic",
            rarityText: "史诗",
            category: "赛季之星",
            description: "发布20篇数据报告",
            story: "用数据解读江湖趋势，你的分析报告成为决策参考！",
            unlockedAt: null,
            progress: 15,
            requirements: { type: "data-report", target: 20, current: 3 },
            rewards: { prestige: 750, title: "数据专家" }
        }
    };

    // 成就分类（方案三：酒馆传媒融合风）
    const achievementCategories = [
        { id: "all", name: "全部", icon: "📋" },
        { id: "酒馆打卡", name: "酒馆打卡", icon: "🍶" },
        { id: "头条速递", name: "头条速递", icon: "📰" },
        { id: "赏金任务", name: "赏金任务", icon: "🎯" },
        { id: "社交达人", name: "社交达人", icon: "👥" },
        { id: "藏品收集", name: "藏品收集", icon: "🎒" },
        { id: "赛季之星", name: "赛季之星", icon: "⭐" },
        { id: "传奇殿堂", name: "传奇殿堂", icon: "👑" }
    ];

    // 稀有度颜色映射
    const rarityColors = {
        "common": "#9e9e9e",
        "uncommon": "#2ecc71",
        "rare": "#3498db",
        "epic": "#9b59b6",
        "legendary": "#ffd700"
    };

    // 佩戴槽数量
    const MAX_EQUIP_SLOTS = 3;

    // 当前选中的成就
    let currentAchievement = null;

    /**
     * 获取成就数据
     */
    function getAchievementData(achievementId) {
        return achievementData[achievementId] || null;
    }

    /**
     * 获取所有成就数据
     */
    function getAllAchievements() {
        return achievementData;
    }

    /**
     * 获取成就统计
     */
    function getStats() {
        const all = Object.values(achievementData);
        const unlocked = all.filter(a => a.unlockedAt !== null);
        const legendary = all.filter(a => a.rarity === "legendary");
        const unlockedLegendary = legendary.filter(a => a.unlockedAt !== null);

        return {
            total: all.length,
            unlocked: unlocked.length,
            legendary: legendary.length,
            unlockedLegendary: unlockedLegendary.length,
            progress: Math.round((unlocked.length / all.length) * 100)
        };
    }

    /**
     * 按分类筛选成就
     */
    function filterByCategory(categoryId) {
        if (categoryId === "all") {
            return Object.values(achievementData);
        }
        return Object.values(achievementData).filter(a => a.category === categoryId);
    }

    /**
     * 获取成就状态
     */
    function getStatus(achievement) {
        if (achievement.unlockedAt !== null) {
            return "unlocked";
        }
        if (achievement.progress > 0 && achievement.progress < 100) {
            return "in-progress";
        }
        return "locked";
    }

    /**
     * 获取稀有度颜色
     */
    function getRarityColor(rarity) {
        return rarityColors[rarity] || "#9e9e9e";
    }

    /**
     * 获取稀有度中文名称
     */
    function getRarityText(rarity) {
        const rarityTexts = {
            common: '普通',
            uncommon: '优秀',
            rare: '稀有',
            epic: '史诗',
            legendary: '传说'
        };
        return rarityTexts[rarity] || '普通';
    }

    /**
     * 获取成就分类列表
     */
    function getCategories() {
        return achievementCategories;
    }

    // ===== 佩戴状态管理 =====

    /**
     * 获取所有已佩戴的成就
     */
    function getEquipped() {
        const stored = localStorage.getItem('equippedAchievements');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                return Array.isArray(data) ? data : [];
            } catch (e) {
                console.error('解析佩戴数据失败:', e);
                return [];
            }
        }
        return [];
    }

    /**
     * 佩戴成就到指定槽位
     */
    function equip(achievementId, slotIndex = 0) {
        const achievement = achievementData[achievementId];
        if (!achievement || achievement.unlockedAt === null) {
            return false;
        }

        const equipped = getEquipped();

        while (equipped.length < MAX_EQUIP_SLOTS) {
            equipped.push(null);
        }

        const existingIndex = equipped.findIndex(e => e && e.id === achievementId);
        if (existingIndex !== -1 && existingIndex !== slotIndex) {
            equipped[existingIndex] = null;
        }

        equipped[slotIndex] = {
            id: achievementId,
            equippedAt: new Date().toISOString().split('T')[0]
        };

        localStorage.setItem('equippedAchievements', JSON.stringify(equipped));
        return true;
    }

    /**
     * 从指定槽位卸下成就
     */
    function unequip(slotIndex) {
        const equipped = getEquipped();
        if (equipped[slotIndex]) {
            equipped[slotIndex] = null;
            localStorage.setItem('equippedAchievements', JSON.stringify(equipped));
            return true;
        }
        return false;
    }

    /**
     * 检查成就是否已佩戴
     */
    function isEquipped(achievementId) {
        const equipped = getEquipped();
        return equipped.some(e => e && e.id === achievementId);
    }

    /**
     * 获取已佩戴的成就数据列表
     */
    function getEquippedData() {
        const equipped = getEquipped();
        return equipped.map(e => e ? achievementData[e.id] : null);
    }

    /**
     * 获取已佩戴成就数量
     */
    function getEquippedCount() {
        const equipped = getEquipped();
        return equipped.filter(e => e !== null).length;
    }

    /**
     * 获取最大佩戴槽数量
     */
    function getMaxSlots() {
        return MAX_EQUIP_SLOTS;
    }

    // ===== 目标成就管理 =====

    /**
     * 获取目标成就
     */
    function getTarget() {
        const stored = localStorage.getItem('targetAchievement');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('解析目标成就数据失败:', e);
                return null;
            }
        }
        return null;
    }

    /**
     * 设置目标成就
     */
    function setTarget(achievementId) {
        const achievement = achievementData[achievementId];
        if (!achievement) return false;

        const data = {
            id: achievementId,
            setAt: new Date().toISOString().split('T')[0]
        };

        localStorage.setItem('targetAchievement', JSON.stringify(data));
        return true;
    }

    /**
     * 清除目标成就
     */
    function clearTarget() {
        localStorage.removeItem('targetAchievement');
    }

    /**
     * 获取目标成就数据
     */
    function getTargetData() {
        const target = getTarget();
        if (target) {
            return achievementData[target.id];
        }
        return null;
    }

    // ===== UI渲染方法 =====

    /**
     * 渲染统计数据
     */
    function renderStats() {
        const stats = getStats();

        const statTotal = document.getElementById('stat-total');
        const statUnlocked = document.getElementById('stat-unlocked');
        const statProgress = document.getElementById('stat-progress');
        const statLegendary = document.getElementById('stat-legendary');

        if (statTotal) statTotal.textContent = stats.total;
        if (statUnlocked) statUnlocked.textContent = stats.unlocked;
        if (statProgress) statProgress.textContent = stats.progress + '%';
        if (statLegendary) statLegendary.textContent = stats.unlockedLegendary + '/' + stats.legendary;
    }

    /**
     * 渲染分类标签
     */
    function renderCategories() {
        const cloudContainer = document.getElementById('category-cloud');
        if (!cloudContainer) return;

        cloudContainer.innerHTML = '';

        achievementCategories.forEach(category => {
            const tag = document.createElement('div');
            tag.className = 'category-tag';
            tag.dataset.category = category.id;
            tag.innerHTML = `<span>${category.icon}</span><span>${category.name}</span>`;

            if (category.id === 'all') {
                tag.classList.add('active');
            }

            tag.addEventListener('click', function() {
                document.querySelectorAll('.category-tag').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                renderAchievements(category.id);
            });

            cloudContainer.appendChild(tag);
        });
    }

    /**
     * 渲染成就卡片列表
     */
    function renderAchievements(categoryId) {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        grid.innerHTML = '';

        const achievements = filterByCategory(categoryId);

        achievements.forEach(achievement => {
            const card = createAchievementCard(achievement);
            grid.appendChild(card);
        });
    }

    /**
     * 创建成就卡片
     */
    function createAchievementCard(achievement) {
        const status = getStatus(achievement);
        const equipped = isEquipped(achievement.id);

        const card = document.createElement('div');
        card.className = `achievement-card ${status} ${equipped ? 'equipped' : ''} rarity-${achievement.rarity}`;
        card.dataset.achievementId = achievement.id;
        card.style.position = 'relative';

        card.innerHTML = `
            <div class="card-top-bar"></div>
            ${equipped ? '<div class="equip-badge">⚡</div>' : ''}
            <div class="card-header">
                <div class="card-icon">${achievement.icon}</div>
                <div class="card-info">
                    <div class="card-name">${achievement.name}</div>
                    <div class="card-rarity rarity-${achievement.rarity}">${achievement.rarityText}</div>
                </div>
            </div>
            <div class="card-body">
                <div class="card-description">${achievement.description}</div>
                <div class="card-progress">
                    <div class="progress-bar">
                        <div class="progress-fill ${status}" style="width: ${achievement.progress}%"></div>
                    </div>
                    <div class="progress-text">
                        ${status === 'locked' ? '未解锁' :
                          status === 'unlocked' ? '已完成' :
                          `${achievement.requirements.current}/${achievement.requirements.target}`}
                    </div>
                </div>
                ${status === 'unlocked' ? `
                    <button class="equip-btn ${equipped ? 'unequip' : 'equip'}" onclick="AchievementModule.handleEquipClick('${achievement.id}', event)">
                        ${equipped ? '取下' : '佩戴'}
                    </button>
                ` : ''}
            </div>
            <div class="card-footer">
                <div class="card-category">${achievement.category}</div>
                <div class="card-status ${status}">
                    ${status === 'locked' ? '🔒' : status === 'unlocked' ? '✓' : '...'}
                </div>
            </div>
        `;

        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('equip-btn')) {
                card.classList.add('animate-scaleIn');
                setTimeout(() => {
                    card.classList.remove('animate-scaleIn');
                }, 400);
                showDetail(achievement);
            }
        });

        // 双击快捷操作
        card.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            if (status === 'unlocked') {
                if (equipped) {
                    // 双击已佩戴的成就，快速取下
                    const equippedList = getEquipped();
                    const index = equippedList.findIndex(e => e && e.id === achievement.id);
                    if (index !== -1) {
                        unequip(index);
                        card.classList.remove('equipped');
                        if (typeof showNotification === 'function') {
                            showNotification(`「${achievement.name}」已取下！`, 'success');
                        }
                        renderAchievements(document.querySelector('.category-tag.active')?.dataset.category || 'all');
                    }
                } else {
                    // 双击未佩戴的成就，快速佩戴到第一个空槽位
                    const equippedList = getEquipped();
                    const emptySlot = equippedList.findIndex(e => !e);
                    if (emptySlot !== -1) {
                        equip(achievement.id, emptySlot);
                        card.classList.add('equipped');
                        if (typeof showNotification === 'function') {
                            showNotification(`「${achievement.name}」已佩戴到槽位${emptySlot + 1}！`, 'success');
                        }
                        renderAchievements(document.querySelector('.category-tag.active')?.dataset.category || 'all');
                    } else {
                        // 没有空槽位，显示槽位选择弹窗
                        showSlotModal(achievement.id);
                    }
                }
            }
        });

        return card;
    }

    /**
     * 处理佩戴/取下点击
     */
    function handleEquipClick(achievementId, event) {
        event.stopPropagation();

        const equipped = isEquipped(achievementId);

        if (equipped) {
            const equippedList = getEquipped();
            const index = equippedList.findIndex(e => e && e.id === achievementId);
            if (index !== -1) {
                unequip(index);
                // 使用 Toast 通知
                if (typeof showNotification === 'function') {
                    showNotification('成就已取下！', 'success');
                } else {
                    console.log('成就已取下！');
                }
            }
        } else {
            showSlotModal(achievementId);
        }

        renderAchievements(document.querySelector('.category-tag.active')?.dataset.category || 'all');
    }

    /**
     * 显示佩戴槽选择弹窗
     */
    function showSlotModal(achievementId) {
        const equipped = getEquipped();
        const achievement = achievementData[achievementId];

        let slotsHtml = '';
        for (let i = 0; i < MAX_EQUIP_SLOTS; i++) {
            const slotData = equipped[i];
            const isEmpty = !slotData;
            const slotAchievement = slotData ? achievementData[slotData.id] : null;

            slotsHtml += `
                <div class="slot-option ${isEmpty ? 'empty' : 'filled'}" 
                     data-slot="${i}" 
                     draggable="${!isEmpty}"
                     ondragstart="handleDragStart(event)"
                     ondragenter="handleDragEnter(event)"
                     ondragover="handleDragOver(event)"
                     ondragleave="handleDragLeave(event)"
                     ondrop="handleDrop(event)">
                    <div class="slot-preview">
                        ${isEmpty ? '📭' : slotAchievement.icon}
                    </div>
                    <div class="slot-info">
                        <div class="slot-title">槽位${i + 1}</div>
                        <div class="slot-content">${isEmpty ? '空槽位' : slotAchievement.name}</div>
                    </div>
                    ${!isEmpty ? '<div class="slot-replace">点击替换或拖拽排序</div>' : ''}
                </div>
            `;
        }

        const modalContent = `
            <div class="modal-header">
                <h3>选择佩戴槽位</h3>
                <button class="modal-close" onclick="AchievementModule.closeSlotModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="equip-preview">
                    <span class="preview-icon">${achievement.icon}</span>
                    <span class="preview-name">${achievement.name}</span>
                </div>
                <div class="slots-list">
                    ${slotsHtml}
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.id = 'slot-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `<div class="modal-content">${modalContent}</div>`;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        modal.querySelectorAll('.slot-option').forEach(slot => {
            slot.addEventListener('click', function() {
                const slotIndex = parseInt(this.dataset.slot);
                equip(achievementId, slotIndex);
                AchievementModule.closeSlotModal();
                if (typeof showNotification === 'function') {
                    showNotification(`成就「${achievement.name}」已佩戴到槽位${slotIndex + 1}！`, 'success');
                }
                renderAchievements(document.querySelector('.category-tag.active')?.dataset.category || 'all');
            });
        });
    }

    /**
     * 关闭槽位选择弹窗
     */
    function closeSlotModal() {
        const modal = document.getElementById('slot-modal');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * 显示成就详情弹窗
     */
    function showDetail(achievement) {
        currentAchievement = achievement;
        const modal = document.getElementById('achievement-modal');
        if (!modal) return;

        const modalIcon = document.getElementById('modal-icon');
        const modalName = document.getElementById('modal-name');
        const modalRarity = document.getElementById('modal-rarity');
        const modalDescription = document.getElementById('modal-description');
        const modalStory = document.getElementById('modal-story');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const modalRewards = document.getElementById('modal-rewards');

        if (modalIcon) modalIcon.textContent = achievement.icon;
        if (modalName) modalName.textContent = achievement.name;

        if (modalRarity) {
            modalRarity.className = `modal-rarity rarity-${achievement.rarity}`;
            modalRarity.textContent = achievement.rarityText;
        }

        if (modalDescription) modalDescription.textContent = achievement.description;
        if (modalStory) modalStory.textContent = achievement.story;

        if (progressFill) {
            progressFill.className = `progress-fill ${getStatus(achievement)}`;
            progressFill.style.width = achievement.progress + '%';
        }

        if (progressText) {
            progressText.textContent =
                achievement.progress === 100 ? '已完成' :
                `${achievement.requirements.current}/${achievement.requirements.target}`;
        }

        if (modalRewards) {
            modalRewards.innerHTML = `
                <div class="reward-item">
                    <span>⭐</span>
                    <span>声望 +${achievement.rewards.prestige}</span>
                </div>
                <div class="reward-item">
                    <span>🏷️</span>
                    <span>称号: ${achievement.rewards.title}</span>
                </div>
            `;
        }

        // 渲染目标追踪面板
        renderTargetProgressPanel(achievement);

        modal.classList.add('show');
    }

    /**
     * 渲染目标追踪面板
     */
    function renderTargetProgressPanel(achievement) {
        const targetPanel = document.getElementById('target-progress-panel');
        if (!targetPanel) return;

        // 如果成就已完成，不显示目标追踪面板
        if (achievement.progress >= 100) {
            targetPanel.style.display = 'none';
            return;
        }

        const progressCircle = document.getElementById('target-progress-circle');
        const progressValue = document.getElementById('target-progress-value');
        const progressDetail = document.getElementById('target-progress-detail');
        const milestoneList = document.getElementById('milestone-list');
        const suggestionContent = document.getElementById('suggestion-content');

        // 更新进度圆圈
        if (progressCircle) {
            const progress = achievement.progress;
            progressCircle.style.background = `conic-gradient(var(--gold) ${progress * 3.6}deg, rgba(212, 175, 55, 0.2) ${progress * 3.6}deg)`;
        }

        if (progressValue) {
            progressValue.textContent = achievement.progress + '%';
        }

        if (progressDetail) {
            progressDetail.textContent = `${achievement.requirements.current}/${achievement.requirements.target}`;
        }

        // 生成里程碑
        if (milestoneList) {
            milestoneList.innerHTML = generateMilestones(achievement);
        }

        // 生成行动建议
        if (suggestionContent) {
            suggestionContent.innerHTML = generateSuggestion(achievement);
        }

        targetPanel.style.display = 'block';
    }

    /**
     * 生成里程碑列表HTML
     */
    function generateMilestones(achievement) {
        const current = achievement.requirements.current;
        const target = achievement.requirements.target;
        const milestones = [];

        // 生成4个里程碑
        const step = Math.ceil(target / 4);
        for (let i = 1; i <= 4; i++) {
            const milestoneTarget = step * i;
            const isCompleted = current >= milestoneTarget;
            const actualTarget = Math.min(milestoneTarget, target);
            milestones.push({
                target: actualTarget,
                completed: isCompleted,
                percentage: Math.round((actualTarget / target) * 100)
            });
        }

        return milestones.map(m => `
            <div class="milestone-item">
                <div class="milestone-check ${m.completed ? 'completed' : ''}">
                    ${m.completed ? '✓' : ''}
                </div>
                <div class="milestone-text">达成 ${m.target} 次</div>
                <div class="milestone-progress">${m.percentage}%</div>
            </div>
        `).join('');
    }

    /**
     * 生成智能行动建议
     */
    function generateSuggestion(achievement) {
        const current = achievement.requirements.current;
        const target = achievement.requirements.target;
        const remaining = target - current;
        const progress = achievement.progress;

        let suggestion = '';
        
        // 根据进度生成不同的建议
        if (progress < 25) {
            suggestion = `刚刚起步！您还需要完成 <strong>${remaining}</strong> 次来解锁此成就。每天坚持完成几个，很快就能看到进展！`;
        } else if (progress < 50) {
            suggestion = `进展不错！已经完成了一半，再坚持一下，还需要 <strong>${remaining}</strong> 次就能达成目标！`;
        } else if (progress < 75) {
            suggestion = `即将突破！只剩 <strong>${remaining}</strong> 次了，加油！您离成功只差一步之遥！`;
        } else {
            suggestion = `最后冲刺！仅剩 <strong>${remaining}</strong> 次，胜利就在眼前，不要放弃！`;
        }

        return suggestion;
    }

    /**
     * 关闭成就详情弹窗
     */
    function closeModal() {
        const modal = document.getElementById('achievement-modal');
        if (modal) {
            modal.classList.remove('show');
        }
        currentAchievement = null;
    }

    /**
     * 获取当前选中的成就
     */
    function getCurrentAchievement() {
        return currentAchievement;
    }

    // ===== 初始化 =====

    /**
     * 初始化默认佩戴数据
     */
    function initDefaultEquipped() {
        let stored = localStorage.getItem('equippedAchievements');
        
        // 验证存储的数据格式
        let equipped = [];
        if (stored) {
            try {
                equipped = JSON.parse(stored);
                // 确保数组长度正确
                if (!Array.isArray(equipped)) {
                    equipped = [];
                }
                // 清理无效数据，确保只保留有效的成就ID
                equipped = equipped.map(e => {
                    if (e && e.id && achievementData[e.id]) {
                        return { id: e.id };
                    }
                    return null;
                });
                // 确保数组长度为MAX_EQUIP_SLOTS
                while (equipped.length < MAX_EQUIP_SLOTS) {
                    equipped.push(null);
                }
                equipped = equipped.slice(0, MAX_EQUIP_SLOTS);
            } catch (e) {
                equipped = [];
            }
        }
        
        // 如果没有有效数据，初始化默认佩戴
        if (!stored || equipped.every(e => e === null)) {
            const unlocked = Object.values(achievementData).filter(a => a.unlockedAt !== null).slice(0, MAX_EQUIP_SLOTS);
            for (let i = 0; i < MAX_EQUIP_SLOTS; i++) {
                equipped[i] = unlocked[i] ? { id: unlocked[i].id } : null;
            }
        }
        
        localStorage.setItem('equippedAchievements', JSON.stringify(equipped));
        console.log('初始化佩戴数据:', equipped);
    }

    /**
     * 初始化成就模块
     */
    function init() {
        console.log('AchievementModule 初始化');
        
        // 初始化默认佩戴数据（如果localStorage中没有数据）
        initDefaultEquipped();

        // 只有在成就子页面时才渲染页面内容
        if (document.getElementById('achievements-grid')) {
            renderStats();
            renderCategories();
            renderAchievements('all');

            // 绑定模态框外部点击关闭
            document.addEventListener('click', function(e) {
                const modals = ['achievement-modal', 'share-modal', 'poster-modal'];
                modals.forEach(modalId => {
                    const modal = document.getElementById(modalId);
                    if (modal && modal.classList.contains('show') && e.target === modal) {
                        modal.classList.remove('show');
                    }
                });
            });
        }
    }

    // 暴露公共API
    return {
        // 数据获取
        getAchievementData: getAchievementData,
        getAllAchievements: getAllAchievements,
        getStats: getStats,
        getCategories: getCategories,
        getStatus: getStatus,
        getRarityColor: getRarityColor,
        getRarityText: getRarityText,

        // 佩戴管理
        equip: equip,
        unequip: unequip,
        isEquipped: isEquipped,
        getEquipped: getEquipped,
        getEquippedData: getEquippedData,
        getEquippedCount: getEquippedCount,
        getMaxSlots: getMaxSlots,

        // 目标成就
        getTarget: getTarget,
        setTarget: setTarget,
        clearTarget: clearTarget,
        getTargetData: getTargetData,

        // UI渲染
        renderStats: renderStats,
        renderCategories: renderCategories,
        renderAchievements: renderAchievements,
        createAchievementCard: createAchievementCard,

        // 交互
        handleEquipClick: handleEquipClick,
        showSlotModal: showSlotModal,
        closeSlotModal: closeSlotModal,
        showDetail: showDetail,
        closeModal: closeModal,
        getCurrentAchievement: getCurrentAchievement,

        // 初始化
        init: init
    };
})();

// 页面加载完成后初始化成就模块
document.addEventListener('DOMContentLoaded', function() {
    // 如果在成就页面则初始化
    if (document.getElementById('achievements-grid')) {
        AchievementModule.init();
    }
});

// 监听localStorage变化（跨页面联动）
window.addEventListener('storage', function(e) {
    if (e.key === 'equippedAchievement') {
        const activeCategory = document.querySelector('.category-tag.active')?.dataset.category;
        if (activeCategory) {
            AchievementModule.renderAchievements(activeCategory);
        }
    }
});

// 全局函数 - 关闭成就详情弹窗
function closeModal() {
    AchievementModule.closeModal();
}

// 全局函数 - 关闭分享弹窗
function closeShareModal() {
    ShareModule.closeShareModal();
}

// 全局函数 - 搜索成就
function searchAchievements() {
    const searchInput = document.getElementById('achievement-search');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // 搜索为空，显示所有成就
        const activeCategory = document.querySelector('.category-tag.active')?.dataset.category || 'all';
        AchievementModule.renderAchievements(activeCategory);
    } else {
        // 执行搜索
        const achievements = AchievementModule.getAllAchievements();
        const filtered = Object.values(achievements).filter(a => {
            const nameMatch = a.name.toLowerCase().includes(searchTerm);
            const descMatch = a.description.toLowerCase().includes(searchTerm);
            const categoryMatch = a.category.toLowerCase().includes(searchTerm);
            return nameMatch || descMatch || categoryMatch;
        });
        
        // 渲染搜索结果
        const gridContainer = document.getElementById('achievements-grid');
        if (gridContainer) {
            gridContainer.innerHTML = '';
            if (filtered.length === 0) {
                gridContainer.innerHTML = '<div class="no-results">未找到匹配的成就</div>';
            } else {
                filtered.forEach(achievement => {
                    gridContainer.appendChild(AchievementModule.createAchievementCard(achievement));
                });
            }
        }
    }
}

// 全局函数 - 清除搜索
function clearSearch() {
    const searchInput = document.getElementById('achievement-search');
    searchInput.value = '';
    searchAchievements();
}

// 拖拽排序相关变量
let draggedSlot = null;

// 全局函数 - 开始拖拽
function handleDragStart(event) {
    draggedSlot = event.target;
    event.target.style.opacity = '0.5';
    event.dataTransfer.effectAllowed = 'move';
}

// 全局函数 - 拖拽进入
function handleDragEnter(event) {
    if (event.target.classList.contains('slot-option')) {
        event.target.classList.add('drag-over');
    }
}

// 全局函数 - 拖拽经过
function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

// 全局函数 - 拖拽离开
function handleDragLeave(event) {
    if (event.target.classList.contains('slot-option')) {
        event.target.classList.remove('drag-over');
    }
}

// 全局函数 - 放置
function handleDrop(event) {
    event.preventDefault();
    
    const targetSlot = event.target.closest('.slot-option');
    if (!targetSlot || !draggedSlot || draggedSlot === targetSlot) {
        draggedSlot?.classList.remove('dragging');
        draggedSlot = null;
        document.querySelectorAll('.slot-option').forEach(s => s.classList.remove('drag-over'));
        return;
    }

    const draggedIndex = parseInt(draggedSlot.dataset.slot);
    const targetIndex = parseInt(targetSlot.dataset.slot);

    // 获取当前佩戴状态
    const equipped = [...AchievementModule.getEquipped()];
    
    // 交换位置
    const temp = equipped[draggedIndex];
    equipped[draggedIndex] = equipped[targetIndex];
    equipped[targetIndex] = temp;

    // 保存新的佩戴顺序
    equipped.forEach((item, index) => {
        if (item) {
            AchievementModule.equip(item.id, index);
        }
    });

    // 重新渲染弹窗
    const currentModal = document.getElementById('slot-modal');
    if (currentModal) {
        currentModal.remove();
        // 重新打开弹窗显示新顺序
        const activeCategory = document.querySelector('.category-tag.active')?.dataset.category || 'all';
        AchievementModule.renderAchievements(activeCategory);
    }

    draggedSlot = null;
    document.querySelectorAll('.slot-option').forEach(s => s.classList.remove('drag-over'));
}

// 全局函数 - 关闭海报弹窗
function closePosterModal() {
    ShareModule.closePosterModal();
}

// 全局函数 - 设为目标
function setTargetAchievementClick() {
    const achievement = AchievementModule.getCurrentAchievement();
    if (achievement) {
        AchievementModule.setTarget(achievement.id);
        StateManager.setTargetAchievement(achievement.id);
        if (typeof showNotification === 'function') {
            showNotification(`已将「${achievement.name}」设为目标！`, 'success');
        }
        closeModal();
    }
}

// 全局函数 - 分享当前成就
function shareCurrentAchievement() {
    const achievement = AchievementModule.getCurrentAchievement();
    if (achievement) {
        ShareModule.setCurrentAchievement(achievement);
        AchievementModule.closeModal();
        ShareModule.openShareModal();
    }
}

// 全局函数 - 分享到微信好友
function shareToWeChatFriend() {
    ShareModule.shareToWeChatFriend();
}

// 全局函数 - 分享到朋友圈
function shareToWeChatTimeline() {
    ShareModule.shareToWeChatTimeline();
}

// 全局函数 - 生成海报
function generateAchievementPoster() {
    ShareModule.generatePoster();
}

// 全局函数 - 复制链接
function copyAchievementLink() {
    ShareModule.copyLink();
}

// 全局函数 - 下载海报
function downloadPoster() {
    ShareModule.downloadPoster();
}
