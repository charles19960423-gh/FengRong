// 成就数据模型
const achievementData = {
    // 基础成就
    "first-bounty": {
        id: "first-bounty",
        name: "首次揭榜",
        icon: "🪵",
        rarity: "common",
        rarityText: "普通",
        category: "基础",
        description: "完成第一个赏金任务",
        story: "江湖新人初入酒馆，在悬赏公告板前驻足良久，终于接下人生第一份委托。从此，传奇的序章正式展开...",
        unlockedAt: "2024-01-15",
        progress: 100,
        requirements: {
            type: "task",
            target: 1,
            current: 1
        },
        rewards: {
            prestige: 50,
            title: "江湖新秀"
        }
    },
    "regular": {
        id: "regular",
        name: "酒馆熟客",
        icon: "🔑",
        rarity: "common",
        rarityText: "普通",
        category: "活跃度",
        description: "连续7天登录",
        story: "每日必到酒馆报到，与掌柜相谈甚欢。这份坚持，让你成为了酒馆里最熟悉的面孔。",
        unlockedAt: "2024-01-22",
        progress: 100,
        requirements: {
            type: "login",
            target: 7,
            current: 7
        },
        rewards: {
            prestige: 100,
            title: "常客"
        }
    },
    "whiskey": {
        id: "whiskey",
        name: "威士忌收藏家",
        icon: "🥃",
        rarity: "uncommon",
        rarityText: "精良",
        category: "收集",
        description: "收集10种法器",
        story: "在江湖中闯荡，收集了各式各样的法器。每一件都是冒险的见证，每一件都藏着独特的故事。",
        unlockedAt: "2024-02-01",
        progress: 100,
        requirements: {
            type: "collect",
            target: 10,
            current: 10
        },
        rewards: {
            prestige: 200,
            title: "收藏家"
        }
    },
    "legend": {
        id: "legend",
        name: "江湖传说",
        icon: "⚔️",
        rarity: "legendary",
        rarityText: "传说",
        category: "声望",
        description: "声望达到1000",
        story: "你的名字在江湖中广为流传，无论是酒馆里的闲谈，还是茶楼中的议论，都离不开你的传奇故事。",
        unlockedAt: null,
        progress: 65,
        requirements: {
            type: "prestige",
            target: 1000,
            current: 650
        },
        rewards: {
            prestige: 500,
            title: "江湖传说"
        }
    },
    // 新增成就
    "task-master": {
        id: "task-master",
        name: "赏金猎人",
        icon: "🎯",
        rarity: "uncommon",
        rarityText: "精良",
        category: "任务",
        description: "完成10个赏金任务",
        story: "十次揭榜，十次凯旋。你的战绩在酒馆公告板上熠熠生辉，成为众多冒险者的榜样。",
        unlockedAt: null,
        progress: 70,
        requirements: {
            type: "task",
            target: 10,
            current: 7
        },
        rewards: {
            prestige: 300,
            title: "赏金猎人"
        }
    },
    "perfect-task": {
        id: "perfect-task",
        name: "完美执行",
        icon: "⭐",
        rarity: "rare",
        rarityText: "稀有",
        category: "任务",
        description: "以完美评价完成5个任务",
        story: "不仅完成任务，更追求极致。每一次交付都无可挑剔，你的专业精神令人叹服。",
        unlockedAt: null,
        progress: 40,
        requirements: {
            type: "perfect",
            target: 5,
            current: 2
        },
        rewards: {
            prestige: 400,
            title: "完美执行者"
        }
    },
    "social-star": {
        id: "social-star",
        name: "社交达人",
        icon: "🌟",
        rarity: "uncommon",
        rarityText: "精良",
        category: "社交",
        description: "邀请3位好友加入",
        story: "一人独行快，众人同行远。你将酒馆的故事分享给更多人，让江湖更加热闹。",
        unlockedAt: "2024-02-10",
        progress: 100,
        requirements: {
            type: "invite",
            target: 3,
            current: 3
        },
        rewards: {
            prestige: 150,
            title: "社交达人"
        }
    },
    "night-owl": {
        id: "night-owl",
        name: "夜猫子",
        icon: "🦉",
        rarity: "common",
        rarityText: "普通",
        category: "活跃度",
        description: "在深夜(23:00-02:00)登录5次",
        story: "夜深人静时，酒馆的灯火依然为你点亮。那些在深夜完成的任务，都成了难忘的回忆。",
        unlockedAt: null,
        progress: 60,
        requirements: {
            type: "night",
            target: 5,
            current: 3
        },
        rewards: {
            prestige: 80,
            title: "夜行者"
        }
    },
    "gear-master": {
        id: "gear-master",
        name: "法器大师",
        icon: "🔮",
        rarity: "epic",
        rarityText: "史诗",
        category: "收集",
        description: "收集30种法器",
        story: "从普通的铜剑到传说中的神器，你的藏品足以开设一座小型法器博物馆。",
        unlockedAt: null,
        progress: 20,
        requirements: {
            type: "collect",
            target: 30,
            current: 6
        },
        rewards: {
            prestige: 800,
            title: "法器大师"
        }
    },
    "season-1": {
        id: "season-1",
        name: "第一季参与者",
        icon: "🏅",
        rarity: "rare",
        rarityText: "稀有",
        category: "赛季",
        description: "参与第一赛季活动",
        story: "在酒馆开业之初便投身其中，见证了第一个赛季的风起云涌。这份经历，是你江湖资历的最好证明。",
        unlockedAt: "2024-01-31",
        progress: 100,
        requirements: {
            type: "season",
            target: 1,
            current: 1
        },
        rewards: {
            prestige: 250,
            title: "先驱者"
        }
    },
    "rich-man": {
        id: "rich-man",
        name: "金主",
        icon: "💰",
        rarity: "rare",
        rarityText: "稀有",
        category: "声望",
        description: "累计获得10000声望",
        story: "声望如流水般汇聚而来，你的名字已成为财富与实力的象征。",
        unlockedAt: null,
        progress: 28,
        requirements: {
            type: "total-prestige",
            target: 10000,
            current: 2800
        },
        rewards: {
            prestige: 500,
            title: "金主"
        }
    },
    "loyal": {
        id: "loyal",
        name: "忠诚卫士",
        icon: "🛡️",
        rarity: "epic",
        rarityText: "史诗",
        category: "活跃度",
        description: "连续登录30天",
        story: "一个月的坚守，见证了你的忠诚与执着。酒馆因你这样的守护者而更加温暖。",
        unlockedAt: null,
        progress: 45,
        requirements: {
            type: "login",
            target: 30,
            current: 13
        },
        rewards: {
            prestige: 600,
            title: "忠诚卫士"
        }
    }
};

// 成就分类
const achievementCategories = [
    { id: "all", name: "全部", icon: "📋" },
    { id: "基础", name: "基础", icon: "📌" },
    { id: "活跃度", name: "活跃度", icon: "🔥" },
    { id: "任务", name: "任务", icon: "📜" },
    { id: "收集", name: "收集", icon: "🎒" },
    { id: "声望", name: "声望", icon: "⭐" },
    { id: "社交", name: "社交", icon: "👥" },
    { id: "赛季", name: "赛季", icon: "🏆" }
];

// 稀有度颜色映射
const rarityColors = {
    "common": "#9e9e9e",
    "uncommon": "#2ecc71",
    "rare": "#3498db",
    "epic": "#9b59b6",
    "legendary": "#ffd700"
};

// 获取成就统计
function getAchievementStats() {
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

// 按分类筛选成就
function filterAchievementsByCategory(categoryId) {
    if (categoryId === "all") {
        return Object.values(achievementData);
    }
    return Object.values(achievementData).filter(a => a.category === categoryId);
}

// 获取成就状态
function getAchievementStatus(achievement) {
    if (achievement.unlockedAt !== null) {
        return "unlocked";
    }
    if (achievement.progress > 0 && achievement.progress < 100) {
        return "in-progress";
    }
    return "locked";
}

// ===== 佩戴状态管理（多槽位版本）=====

const MAX_EQUIP_SLOTS = 3;

// 获取所有已佩戴的成就
function getEquippedAchievements() {
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

// 佩戴成就到指定槽位
function equipAchievement(achievementId, slotIndex = 0) {
    const achievement = achievementData[achievementId];
    if (!achievement || achievement.unlockedAt === null) {
        return false;
    }
    
    const equipped = getEquippedAchievements();
    
    // 确保数组长度正确
    while (equipped.length < MAX_EQUIP_SLOTS) {
        equipped.push(null);
    }
    
    // 检查是否已佩戴在其他槽位
    const existingIndex = equipped.findIndex(e => e && e.id === achievementId);
    if (existingIndex !== -1 && existingIndex !== slotIndex) {
        // 如果已佩戴在其他槽位，先取下
        equipped[existingIndex] = null;
    }
    
    // 佩戴到指定槽位
    equipped[slotIndex] = {
        id: achievementId,
        equippedAt: new Date().toISOString().split('T')[0]
    };
    
    localStorage.setItem('equippedAchievements', JSON.stringify(equipped));
    return true;
}

// 从指定槽位卸下成就
function unequipAchievement(slotIndex) {
    const equipped = getEquippedAchievements();
    if (equipped[slotIndex]) {
        equipped[slotIndex] = null;
        localStorage.setItem('equippedAchievements', JSON.stringify(equipped));
        return true;
    }
    return false;
}

// 检查成就是否已佩戴
function isAchievementEquipped(achievementId) {
    const equipped = getEquippedAchievements();
    return equipped.some(e => e && e.id === achievementId);
}

// 获取已佩戴的成就数据列表
function getEquippedAchievementsData() {
    const equipped = getEquippedAchievements();
    return equipped.map(e => e ? achievementData[e.id] : null);
}

// 获取佩戴槽数量
function getEquippedCount() {
    const equipped = getEquippedAchievements();
    return equipped.filter(e => e !== null).length;
}

// ===== 目标成就管理 =====

// 获取目标成就
function getTargetAchievement() {
    const stored = localStorage.getItem('targetAchievement');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            return data;
        } catch (e) {
            console.error('解析目标成就数据失败:', e);
            return null;
        }
    }
    return null;
}

// 设置目标成就
function setTargetAchievement(achievementId) {
    const achievement = achievementData[achievementId];
    if (!achievement) return false;
    
    const data = {
        id: achievementId,
        setAt: new Date().toISOString().split('T')[0]
    };
    
    localStorage.setItem('targetAchievement', JSON.stringify(data));
    return true;
}

// 清除目标成就
function clearTargetAchievement() {
    localStorage.removeItem('targetAchievement');
}

// 获取目标成就数据
function getTargetAchievementData() {
    const target = getTargetAchievement();
    if (target) {
        return achievementData[target.id];
    }
    return null;
}
