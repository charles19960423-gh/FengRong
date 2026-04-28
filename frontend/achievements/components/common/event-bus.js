/**
 * 事件总线 - 用于组件间通信
 * 实现发布-订阅模式，管理成就状态变化
 */
const EventBus = (function() {
    const listeners = {};

    /**
     * 注册事件监听器
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     * @returns {Function} 取消订阅函数
     */
    function on(event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }
        listeners[event].push(callback);
        
        return function unsubscribe() {
            listeners[event] = listeners[event].filter(cb => cb !== callback);
        };
    }

    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {*} data - 事件数据
     */
    function emit(event, data) {
        if (listeners[event]) {
            listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`EventBus: Error in listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * 注册一次性事件监听器
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    function once(event, callback) {
        const unsubscribe = on(event, function handler(data) {
            unsubscribe();
            callback(data);
        });
    }

    /**
     * 获取事件监听器数量
     * @param {string} event - 事件名称
     * @returns {number} 监听器数量
     */
    function getListenerCount(event) {
        return listeners[event] ? listeners[event].length : 0;
    }

    /**
     * 清除指定事件的所有监听器
     * @param {string} event - 事件名称
     */
    function off(event) {
        if (event) {
            delete listeners[event];
        } else {
            Object.keys(listeners).forEach(key => delete listeners[key]);
        }
    }

    return {
        on,
        emit,
        once,
        getListenerCount,
        off
    };
})();

/**
 * 成就相关事件常量
 */
const AchievementEvents = {
    // 成就解锁
    UNLOCKED: 'achievement.unlocked',
    // 成就佩戴状态变化
    EQUIPPED_CHANGED: 'achievement.equippedChanged',
    // 目标成就变化
    TARGET_CHANGED: 'achievement.targetChanged',
    // 成就数据更新
    DATA_UPDATED: 'achievement.dataUpdated',
    // 成就详情打开
    DETAIL_OPENED: 'achievement.detailOpened',
    // 成就详情关闭
    DETAIL_CLOSED: 'achievement.detailClosed'
};

// 导出到全局
window.EventBus = EventBus;
window.AchievementEvents = AchievementEvents;
