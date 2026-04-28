/**
 * 任务卡片组件
 */
class TaskCard {
    constructor(task) {
        this.task = task;
        this.element = null;
    }
    
    /**
     * 创建任务卡片元素
     */
    render() {
        this.element = document.createElement('div');
        this.element.className = `bounty-card ${this.task.status === 'completed' ? 'completed' : ''}`;
        this.element.dataset.id = this.task.id;
        
        // 获取难度样式
        const difficultyConfig = this.getDifficultyConfig(this.task.difficulty);
        
        // 获取状态样式
        const statusConfig = this.getStatusConfig(this.task.status);
        
        this.element.innerHTML = `
            <div class="bounty-level ${difficultyConfig.class}">${difficultyConfig.label}</div>
            <h4 style="margin-bottom: 10px; font-size: 1.1rem;">${this.task.title}</h4>
            <p style="color: #5d4037; font-size: 0.85rem; margin-bottom: 15px; line-height: 1.5;">
                ${this.truncateDescription(this.task.description)}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="task-status ${statusConfig.class}" style="padding: 3px 10px; border-radius: 10px; font-size: 0.75rem;">
                    ${statusConfig.label}
                </span>
                <span class="bounty-reward">💰 ${this.task.reward_prestige}</span>
            </div>
            <div class="candle">🕯️</div>
        `;
        
        // 添加悬停效果
        this.element.addEventListener('click', () => {
            this.handleClick();
        });
        
        return this.element;
    }
    
    /**
     * 获取难度配置
     */
    getDifficultyConfig(difficulty) {
        const configs = {
            easy: { label: '普通', class: 'level-bronze' },
            normal: { label: '困难', class: 'level-silver' },
            hard: { label: '艰巨', class: 'level-gold' },
            legendary: { label: '传说', class: 'level-legendary' }
        };
        return configs[difficulty] || configs.normal;
    }
    
    /**
     * 获取状态配置
     */
    getStatusConfig(status) {
        const configs = {
            active: { label: '可接取', class: 'in-progress' },
            claimed: { label: '进行中', class: 'in-progress' },
            completed: { label: '已完成', class: 'completed' },
            expired: { label: '已过期', class: 'cancelled' }
        };
        return configs[status] || { label: status, class: '' };
    }
    
    /**
     * 截断描述
     */
    truncateDescription(description) {
        if (!description) return '暂无描述';
        return description.length > 80 ? description.slice(0, 80) + '...' : description;
    }
    
    /**
     * 点击处理
     */
    handleClick() {
        // 触发自定义事件，通知父组件
        const event = new CustomEvent('taskClick', {
            detail: { task: this.task }
        });
        this.element.dispatchEvent(event);
    }
    
    /**
     * 更新任务信息
     */
    update(task) {
        this.task = task;
        // 重新渲染
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

export default TaskCard;