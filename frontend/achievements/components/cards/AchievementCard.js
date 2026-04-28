/**
 * 成就卡片组件
 * 负责渲染单个成就卡片，处理点击交互
 */
class AchievementCard {
    /**
     * 构造函数
     * @param {Object} achievement - 成就数据
     * @param {HTMLElement} container - 父容器
     */
    constructor(achievement, container) {
        this.achievement = achievement;
        this.container = container;
        this.element = null;
        this.init();
    }

    /**
     * 初始化组件
     */
    init() {
        this.render();
        this.bindEvents();
    }

    /**
     * 渲染卡片元素
     */
    render() {
        const { id, icon, name, rarity, category, progress, unlockedAt } = this.achievement;
        const isUnlocked = progress >= 100;
        const rarityColor = this.getRarityColor(rarity);
        const opacity = isUnlocked ? 1 : 0.5;

        this.element = document.createElement('div');
        this.element.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        this.element.dataset.id = id;
        this.element.style.opacity = opacity;

        this.element.innerHTML = `
            <div class="achievement-icon" style="background: linear-gradient(145deg, ${rarityColor}22, ${rarityColor}44);">
                <span>${isUnlocked ? icon : '❓'}</span>
            </div>
            <div class="achievement-info">
                <h4 class="achievement-name">${name}</h4>
                <span class="achievement-category">${category}</span>
                <span class="achievement-rarity" style="color: ${rarityColor}">${this.getRarityText(rarity)}</span>
            </div>
            ${isUnlocked ? `
                <div class="achievement-badge">✓</div>
                <div class="achievement-date">${unlockedAt}</div>
            ` : `
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span>${progress}%</span>
                </div>
            `}
        `;

        this.container.appendChild(this.element);
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        this.element.addEventListener('click', () => {
            EventBus.emit(AchievementEvents.DETAIL_OPENED, this.achievement);
        });
    }

    /**
     * 获取稀有度颜色
     * @param {string} rarity - 稀有度
     * @returns {string} 颜色值
     */
    getRarityColor(rarity) {
        const colors = {
            'common': '#9CA3AF',
            'uncommon': '#22C55E',
            'rare': '#3B82F6',
            'epic': '#A855F7',
            'legendary': '#F59E0B'
        };
        return colors[rarity] || '#9CA3AF';
    }

    /**
     * 获取稀有度文本
     * @param {string} rarity - 稀有度
     * @returns {string} 文本
     */
    getRarityText(rarity) {
        const texts = {
            'common': '普通',
            'uncommon': '优秀',
            'rare': '稀有',
            'epic': '史诗',
            'legendary': '传说'
        };
        return texts[rarity] || '普通';
    }

    /**
     * 更新成就数据
     * @param {Object} achievement - 更新后的成就数据
     */
    update(achievement) {
        this.achievement = achievement;
        this.destroy();
        this.init();
    }

    /**
     * 销毁组件
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

// 导出到全局
window.AchievementCard = AchievementCard;
