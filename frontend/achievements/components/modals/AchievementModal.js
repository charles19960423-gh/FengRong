/**
 * 成就详情弹窗组件
 * 复用原HTML弹窗，提供佩戴、设为目标、分享功能
 */
class AchievementModal {
    constructor() {
        this.currentAchievement = null;
        this.bindEvents();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 监听成就详情打开事件
        EventBus.on(AchievementEvents.DETAIL_OPENED, (achievement) => {
            this.open(achievement);
        });

        // 监听成就详情关闭事件
        EventBus.on(AchievementEvents.DETAIL_CLOSED, () => {
            this.close();
        });
    }

    /**
     * 打开弹窗
     * @param {Object} achievement - 成就数据
     */
    open(achievement) {
        this.currentAchievement = achievement;
        this.renderContent();

        const modal = document.getElementById('achievement-detail-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * 关闭弹窗
     */
    close() {
        const modal = document.getElementById('achievement-detail-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.body.style.overflow = '';
        this.currentAchievement = null;
        EventBus.emit(AchievementEvents.DETAIL_CLOSED);
    }

    /**
     * 渲染弹窗内容
     */
    renderContent() {
        if (!this.currentAchievement) return;

        const { icon, name, rarity, description, story, progress, rewards } = this.currentAchievement;
        const isUnlocked = progress >= 100;
        const rarityColor = this.getRarityColor(rarity);
        const rarityText = this.getRarityText(rarity);

        const iconEl = document.getElementById('modal-icon');
        const nameEl = document.getElementById('modal-name');
        const rarityEl = document.getElementById('modal-rarity');
        const descEl = document.getElementById('modal-description');
        const storyEl = document.getElementById('modal-story');
        const progressFillEl = document.getElementById('modal-progress-fill');
        const progressValueEl = document.getElementById('modal-progress-value');
        const rewardsContainer = document.getElementById('modal-rewards');

        if (iconEl) {
            iconEl.innerHTML = `<span>${isUnlocked ? icon : '❓'}</span>`;
            iconEl.style.background = `linear-gradient(145deg, ${rarityColor}22, ${rarityColor}44)`;
        }

        if (nameEl) nameEl.textContent = name;
        if (rarityEl) {
            rarityEl.textContent = rarityText;
            rarityEl.style.background = rarityColor;
        }
        if (descEl) descEl.textContent = description;
        if (storyEl) storyEl.textContent = `"${story}"`;

        if (progressFillEl) progressFillEl.style.width = `${progress}%`;
        if (progressValueEl) progressValueEl.textContent = isUnlocked ? '已完成' : `${progress}%`;

        // 渲染奖励
        if (rewardsContainer) {
            if (rewards && (rewards.prestige || rewards.title)) {
                rewardsContainer.innerHTML = `
                    <h4>🎁 解锁奖励</h4>
                    <div class="rewards-list">
                        ${rewards.prestige ? `<span>声望 +${rewards.prestige}</span>` : ''}
                        ${rewards.title ? `<span>称号: ${rewards.title}</span>` : ''}
                    </div>
                `;
            } else {
                rewardsContainer.innerHTML = '';
            }
        }

        // 更新按钮状态
        const btnEquip = document.getElementById('btn-equip');
        const btnTarget = document.getElementById('btn-target');
        const btnShare = document.getElementById('btn-share');

        if (btnEquip) {
            btnEquip.disabled = !isUnlocked;
            btnEquip.textContent = isUnlocked ? '佩戴' : '未解锁';
        }
    }

    /**
     * 处理佩戴点击
     */
    handleEquip() {
        if (!this.currentAchievement || this.currentAchievement.progress < 100) {
            return;
        }
        AchievementModule.showSlotModal(this.currentAchievement.id);
        this.close();
    }

    /**
     * 处理设为目标点击
     */
    handleTarget() {
        if (!this.currentAchievement) return;

        StateManager.setTargetAchievement(this.currentAchievement.id);
        alert(`已将「${this.currentAchievement.name}」设为目标！`);
        this.close();
    }

    /**
     * 处理分享点击
     */
    handleShare() {
        if (!this.currentAchievement) return;

        ShareModule.setCurrentAchievement(this.currentAchievement);
        ShareModule.openShareModal();
        this.close();
    }

    /**
     * 获取稀有度颜色
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
     */
    getRarityText(rarity) {
        const texts = {
            'common': '普通',
            'uncommon': '精良',
            'rare': '稀有',
            'epic': '史诗',
            'legendary': '传说'
        };
        return texts[rarity] || '普通';
    }

    /**
     * 获取当前成就
     */
    getCurrentAchievement() {
        return this.currentAchievement;
    }
}

// 创建单例实例
const AchievementModalInstance = new AchievementModal();
window.AchievementModalInstance = AchievementModalInstance;
