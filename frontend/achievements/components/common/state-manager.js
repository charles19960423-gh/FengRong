/**
 * 状态管理器 - 管理成就系统的全局状态
 * 提供统一的状态访问和修改接口
 */
const StateManager = (function() {
    // 状态存储
    const state = {
        // 成就列表（从AchievementModule获取）
        achievements: [],
        // 已佩戴的成就（最多3个）
        equipped: [null, null, null],
        // 目标成就
        target: null,
        // 当前选中的分类
        activeCategory: 'all',
        // 统计数据
        stats: {
            total: 0,
            unlocked: 0,
            locked: 0
        }
    };

    // 状态变更监听器
    const stateListeners = [];

    /**
     * 初始化状态 - 从AchievementModule获取数据
     */
    function init() {
        // 从AchievementModule获取成就数据
        if (typeof AchievementModule !== 'undefined') {
            const allAchievements = AchievementModule.getAllAchievements();
            state.achievements = Object.values(allAchievements);
        }
        updateStats();
        notifyChange();
    }

    /**
     * 设置成就列表
     * @param {Array} achievements - 成就列表
     */
    function setAchievements(achievements) {
        state.achievements = achievements;
        updateStats();
        notifyChange();
        EventBus.emit(AchievementEvents.DATA_UPDATED, achievements);
    }

    /**
     * 获取成就列表
     * @param {string} category - 分类筛选（可选）
     * @returns {Array} 成就列表
     */
    function getAchievements(category = 'all') {
        if (category === 'all') {
            return state.achievements;
        }
        return state.achievements.filter(a => a.category === category);
    }

    /**
     * 根据ID获取成就
     * @param {string} id - 成就ID
     * @returns {Object|null} 成就对象
     */
    function getAchievementById(id) {
        return state.achievements.find(a => a.id === id) || null;
    }

    /**
     * 佩戴成就
     * @param {string} achievementId - 成就ID
     * @param {number} slotIndex - 佩戴槽位索引（0-2）
     * @returns {boolean} 是否佩戴成功
     */
    function equipAchievement(achievementId, slotIndex) {
        if (slotIndex < 0 || slotIndex > 2) {
            return false;
        }

        const achievement = getAchievementById(achievementId);
        if (!achievement || achievement.progress < 100) {
            return false;
        }

        // 检查是否已在其他槽位佩戴
        const existingIndex = state.equipped.findIndex(e => e === achievementId);
        if (existingIndex !== -1 && existingIndex !== slotIndex) {
            state.equipped[existingIndex] = null;
        }

        state.equipped[slotIndex] = achievementId;
        notifyChange();
        EventBus.emit(AchievementEvents.EQUIPPED_CHANGED, {
            achievementId,
            slotIndex,
            equipped: [...state.equipped]
        });

        // 同步到AchievementModule
        if (typeof AchievementModule !== 'undefined') {
            AchievementModule.equip(achievementId, slotIndex);
        }

        // 保存到localStorage
        saveToStorage();
        return true;
    }

    /**
     * 取下成就
     * @param {number} slotIndex - 槽位索引
     */
    function unequipAchievement(slotIndex) {
        if (slotIndex >= 0 && slotIndex < state.equipped.length) {
            const removedId = state.equipped[slotIndex];
            state.equipped[slotIndex] = null;
            notifyChange();
            EventBus.emit(AchievementEvents.EQUIPPED_CHANGED, {
                achievementId: null,
                slotIndex,
                equipped: [...state.equipped]
            });

            // 同步到AchievementModule
            if (typeof AchievementModule !== 'undefined') {
                AchievementModule.unequip(slotIndex);
            }

            saveToStorage();
            return removedId;
        }
        return null;
    }

    /**
     * 获取已佩戴的成就列表
     * @returns {Array} 已佩戴成就ID列表
     */
    function getEquippedAchievements() {
        return state.equipped.filter(id => id !== null);
    }

    /**
     * 设置目标成就
     * @param {string} achievementId - 成就ID
     */
    function setTargetAchievement(achievementId) {
        state.target = achievementId;
        notifyChange();
        EventBus.emit(AchievementEvents.TARGET_CHANGED, achievementId);

        // 同步到AchievementModule
        if (typeof AchievementModule !== 'undefined') {
            AchievementModule.setTarget(achievementId);
        }

        saveToStorage();
    }

    /**
     * 获取目标成就
     * @returns {string|null} 目标成就ID
     */
    function getTargetAchievement() {
        return state.target;
    }

    /**
     * 清除目标成就
     */
    function clearTargetAchievement() {
        state.target = null;
        notifyChange();
        EventBus.emit(AchievementEvents.TARGET_CHANGED, null);

        // 同步到AchievementModule
        if (typeof AchievementModule !== 'undefined') {
            AchievementModule.clearTarget();
        }

        saveToStorage();
    }

    /**
     * 设置当前分类
     * @param {string} category - 分类名称
     */
    function setActiveCategory(category) {
        state.activeCategory = category;
        notifyChange();
    }

    /**
     * 获取当前分类
     * @returns {string} 当前分类
     */
    function getActiveCategory() {
        return state.activeCategory;
    }

    /**
     * 更新统计数据
     */
    function updateStats() {
        const total = state.achievements.length;
        const unlocked = state.achievements.filter(a => a.progress >= 100).length;
        state.stats = {
            total,
            unlocked,
            locked: total - unlocked
        };
    }

    /**
     * 获取统计数据
     * @returns {Object} 统计数据
     */
    function getStats() {
        return { ...state.stats };
    }

    /**
     * 解锁成就
     * @param {string} achievementId - 成就ID
     * @returns {boolean} 是否解锁成功
     */
    function unlockAchievement(achievementId) {
        const achievement = getAchievementById(achievementId);
        if (achievement && achievement.progress < 100) {
            achievement.progress = 100;
            achievement.unlockedAt = new Date().toISOString().split('T')[0];
            updateStats();
            notifyChange();
            EventBus.emit(AchievementEvents.UNLOCKED, achievement);
            saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * 通知状态变更
     */
    function notifyChange() {
        stateListeners.forEach(listener => {
            try {
                listener({ ...state });
            } catch (error) {
                console.error('StateManager: Error in listener:', error);
            }
        });
    }

    /**
     * 添加状态变更监听器
     * @param {Function} listener - 监听器函数
     * @returns {Function} 取消监听函数
     */
    function subscribe(listener) {
        stateListeners.push(listener);
        return function unsubscribe() {
            const index = stateListeners.indexOf(listener);
            if (index !== -1) {
                stateListeners.splice(index, 1);
            }
        };
    }

    /**
     * 保存状态到localStorage
     */
    function saveToStorage() {
        try {
            localStorage.setItem('achievementState', JSON.stringify({
                equipped: state.equipped,
                target: state.target
            }));
        } catch (error) {
            console.error('StateManager: Failed to save to storage:', error);
        }
    }

    /**
     * 从localStorage加载状态
     */
    function loadFromStorage() {
        try {
            const saved = localStorage.getItem('achievementState');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.equipped) {
                    // 确保有3个槽位
                    state.equipped = [null, null, null];
                    data.equipped.forEach((id, index) => {
                        if (index < 3) state.equipped[index] = id;
                    });
                }
                if (data.target) {
                    state.target = data.target;
                }
            }
        } catch (error) {
            console.error('StateManager: Failed to load from storage:', error);
        }
    }

    /**
     * 获取完整状态
     * @returns {Object} 当前状态副本
     */
    function getState() {
        return JSON.parse(JSON.stringify(state));
    }

    return {
        init,
        setAchievements,
        getAchievements,
        getAchievementById,
        equipAchievement,
        unequipAchievement,
        getEquippedAchievements,
        setTargetAchievement,
        getTargetAchievement,
        clearTargetAchievement,
        setActiveCategory,
        getActiveCategory,
        getStats,
        unlockAchievement,
        subscribe,
        loadFromStorage,
        getState
    };
})();

// 导出到全局
window.StateManager = StateManager;
