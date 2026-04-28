/**
 * 成就卡片组件
 */
class AchievementCard {
    constructor(achievement) {
        this.achievement = achievement;
        this.element = null;
    }
    
    /**
     * 创建成就卡片元素
     */
    render() {
        this.element = document.createElement('div');
        this.element.className = `achievement-card ${this.achievement.unlocked ? 'unlocked' : 'locked'} ${this.achievement.target ? 'target' : ''}`;
        this.element.dataset.id = this.achievement.id;
        
        // 获取稀有度配置
        const rarityConfig = this.getRarityConfig(this.achievement.rarity);
        
        this.element.innerHTML = `
            <div class="achievement-icon" style="${this.achievement.unlocked ? `color: ${rarityConfig.color};` : 'color: #666;'}">
                ${this.achievement.icon || '🏆'}
            </div>
            <div class="achievement-info">
                <div class="achievement-name">${this.achievement.name}</div>
                <div class="achievement-desc">${this.achievement.description}</div>
                ${this.achievement.progress !== undefined ? this.renderProgress() : ''}
            </div>
            <div class="achievement-status ${this.achievement.unlocked ? 'unlocked' : 'locked'}">
                ${this.achievement.unlocked ? '✓' : '?'}
            </div>
            ${this.achievement.target ? '<div class="target-badge">🎯</div>' : ''}
            ${this.achievement.equipped ? '<div class="equip-badge">✓</div>' : ''}
        `;
        
        // 添加悬停效果
        this.element.addEventListener('mouseenter', () => {
            this.showTooltip();
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
        
        this.element.addEventListener('click', () => {
            this.handleClick();
        });
        
        return this.element;
    }
    
    /**
     * 获取稀有度配置
     */
    getRarityConfig(rarity) {
        const configs = {
            common: { label: '普通', color: '#95a5a6' },
            rare: { label: '稀有', color: '#3498db' },
            epic: { label: '史诗', color: '#9b59b6' },
            legendary: { label: '传说', color: '#f39c12' }
        };
        return configs[rarity] || configs.common;
    }
    
    /**
     * 渲染进度条
     */
    renderProgress() {
        const progress = Math.min(this.achievement.progress, 100);
        return `
            <div class="achievement-progress-mini">
                <div class="progress-bar-mini">
                    <div class="progress-fill-mini" style="width: ${progress}%;"></div>
                </div>
                <span class="progress-text-mini">${progress}%</span>
            </div>
        `;
    }
    
    /**
     * 显示提示框
     */
    showTooltip() {
        if (this.tooltip) return;
        
        const rarityConfig = this.getRarityConfig(this.achievement.rarity);
        
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'achievement-tooltip';
        this.tooltip.innerHTML = `
            <div class="tooltip-header">
                <div class="tooltip-icon" style="color: ${this.achievement.unlocked ? rarityConfig.color : '#666'};">
                    ${this.achievement.icon || '🏆'}
                </div>
                <div>
                    <div class="tooltip-name">${this.achievement.name}</div>
                    <div class="tooltip-rarity" style="color: ${rarityConfig.color};">${rarityConfig.label}</div>
                </div>
            </div>
            <div class="tooltip-body">
                <div class="tooltip-desc">${this.achievement.description}</div>
                ${this.achievement.story ? `<div class="tooltip-story">${this.achievement.story}</div>` : ''}
                <div class="tooltip-rewards">
                    ${this.achievement.rewards ? this.achievement.rewards.map(r => `• ${r}`).join('<br>') : ''}
                </div>
                ${this.achievement.unlocked ? this.renderEquipButton() : ''}
            </div>
        `;
        
        // 定位提示框
        const rect = this.element.getBoundingClientRect();
        this.tooltip.style.left = `${rect.right + 15}px`;
        this.tooltip.style.top = `${rect.top}px`;
        
        document.body.appendChild(this.tooltip);
    }
    
    /**
     * 渲染装备按钮
     */
    renderEquipButton() {
        return `
            <button class="achievement-equip-btn ${this.achievement.equipped ? '' : ''}" 
                    onclick="AchievementCardModule.toggleEquip('${this.achievement.id}')">
                ${this.achievement.equipped ? '卸下' : '装备'}
            </button>
        `;
    }
    
    /**
     * 隐藏提示框
     */
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }
    
    /**
     * 点击处理
     */
    handleClick() {
        const event = new CustomEvent('achievementClick', {
            detail: { achievement: this.achievement }
        });
        this.element.dispatchEvent(event);
    }
    
    /**
     * 更新成就信息
     */
    update(achievement) {
        this.achievement = achievement;
        const parent = this.element.parentElement;
        const newElement = this.render();
        parent.replaceChild(newElement, this.element);
        this.element = newElement;
    }
    
    /**
     * 获取元素
     */
    getElement() {
        if (!this.element) {
            this.render();
        }
        return this.element;
    }
}

// 模块方法
const AchievementCardModule = {
    /**
     * 创建成就卡片
     */
    create(achievement) {
        return new AchievementCard(achievement);
    },
    
    /**
     * 渲染成就列表
     */
    renderList(achievements, container) {
        container.innerHTML = '';
        achievements.forEach(achievement => {
            const card = new AchievementCard(achievement);
            container.appendChild(card.render());
        });
    },
    
    /**
     * 切换装备状态
     */
    toggleEquip(id) {
        // 触发事件通知父组件
        const event = new CustomEvent('achievementEquip', {
            detail: { id }
        });
        document.dispatchEvent(event);
    }
};

// 全局方法
window.AchievementCardModule = AchievementCardModule;

export default AchievementCardModule;