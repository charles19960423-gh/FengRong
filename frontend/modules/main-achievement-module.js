/**
 * 主页面成就模块 - MainAchievementModule
 * 负责主页面成就卡片渲染、佩戴管理、目标显示等功能
 * 依赖：AchievementModule (成就核心模块)
 */
const MainAchievementModule = (function() {
    
    /**
     * 佩戴成就
     */
    function handleEquipOnMain(achievementId) {
        const achievement = AchievementModule.getAchievementData(achievementId);
        if (!achievement || achievement.unlockedAt === null) {
            alert('该成就尚未解锁！');
            return;
        }
        
        const equipped = AchievementModule.getEquipped();
        const emptySlotIndex = equipped.findIndex(e => e === null);
        if (emptySlotIndex === -1) {
            alert('佩戴槽已满！请先取下一个成就。');
            return;
        }
        
        AchievementModule.equip(achievementId, emptySlotIndex);
        alert(`成就「${achievement.name}」佩戴成功！`);
        refreshEquippedDisplay();
    }

    /**
     * 从指定槽位取下成就
     */
    function unequipFromSlot(slotIndex) {
        const equipped = AchievementModule.getEquipped();
        if (equipped[slotIndex]) {
            const achievement = AchievementModule.getAchievementData(equipped[slotIndex].id);
            AchievementModule.unequip(slotIndex);
            alert(`成就「${achievement.name}」已取下！`);
            refreshEquippedDisplay();
        }
    }

    /**
     * 刷新佩戴槽位显示
     */
    function refreshEquippedDisplay() {
        const equipped = AchievementModule.getEquipped();
        const slotsContainer = document.getElementById('equipment-slots-container');
        
        if (!slotsContainer) {
            console.warn('equipment-slots-container not found');
            return;
        }
        
        slotsContainer.innerHTML = '';
        let filledCount = 0;
        
        for (let i = 0; i < AchievementModule.getMaxSlots(); i++) {
            const slotData = equipped[i];
            const slotDiv = document.createElement('div');
            
            if (slotData) {
                const achievement = AchievementModule.getAchievementData(slotData.id);
                slotDiv.className = 'equip-slot filled';
                slotDiv.innerHTML = `
                    <span class="slot-icon">${achievement ? achievement.icon : '📦'}</span>
                    <span class="slot-name">${achievement ? achievement.name : '未知'}</span>
                    <span class="slot-label">槽位${i + 1}</span>
                    <button class="remove-btn" onclick="MainAchievementModule.unequipFromSlot(${i})">×</button>
                `;
                filledCount++;
            } else {
                slotDiv.className = 'equip-slot empty';
                slotDiv.innerHTML = `
                    <span class="slot-icon">📭</span>
                    <span class="slot-label">槽位${i + 1}</span>
                `;
            }
            
            slotsContainer.appendChild(slotDiv);
        }
        
        updateAchievementCards();
    }

    /**
     * 渲染主页面成就卡片（只显示4个）
     */
    function renderMainAchievements() {
        const grid = document.getElementById('achievements-grid-main');
        if (!grid) {
            console.warn('MainAchievementModule: achievements-grid-main not found');
            return;
        }
        
        grid.innerHTML = '';
        
        // 检查 AchievementModule 是否可用
        if (typeof AchievementModule === 'undefined' || !AchievementModule.getAllAchievements) {
            console.error('MainAchievementModule: AchievementModule not available');
            return;
        }
        
        const targetAchievement = AchievementModule.getTarget();
        const allAchievements = Object.values(AchievementModule.getAllAchievements());
        
        console.log('MainAchievementModule: allAchievements count:', allAchievements.length);
        
        // 更新统计数字
        const unlockedCount = allAchievements.filter(a => a.unlockedAt !== null).length;
        const totalCount = allAchievements.length;
        const countElement = document.getElementById('achievement-count');
        if (countElement) {
            countElement.textContent = `${unlockedCount}/${totalCount}`;
            console.log('MainAchievementModule: Updated count to', `${unlockedCount}/${totalCount}`);
        } else {
            console.warn('MainAchievementModule: achievement-count element not found');
        }
        
        // 获取当前佩戴的成就
        const equipped = AchievementModule.getEquipped().filter(e => e !== null);
        
        let displayAchievements;
        
        if (equipped.length > 0) {
            // 有佩戴：优先展示已解锁成就
            const unlockedAchievements = allAchievements.filter(a => a.unlockedAt !== null);
            const lockedAchievements = allAchievements.filter(a => a.unlockedAt === null)
                .sort((a, b) => (b.progress || 0) - (a.progress || 0));
            
            // 组合：已解锁 + 未完成（不足时补充）
            displayAchievements = [...unlockedAchievements];
            if (displayAchievements.length < 4) {
                const needMore = 4 - displayAchievements.length;
                displayAchievements = [...displayAchievements, ...lockedAchievements.slice(0, needMore)];
            }
        } else {
            // 无佩戴：显示未解锁成就（按进度排序）
            displayAchievements = allAchievements.filter(a => a.unlockedAt === null)
                .sort((a, b) => (b.progress || 0) - (a.progress || 0));
        }
        
        // 限制最多显示4个
        displayAchievements = displayAchievements.slice(0, 4);
        
        displayAchievements.forEach(achievement => {
            const isEquipped = AchievementModule.isEquipped(achievement.id);
            const isTarget = targetAchievement && targetAchievement.id === achievement.id;
            const isUnlocked = achievement.unlockedAt !== null;
            const progress = achievement.progress || 0;
            
            const card = document.createElement('div');
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${isEquipped ? 'equipped' : ''} ${isTarget ? 'target' : ''}`;
            card.dataset.achievementId = achievement.id;
            card.style.borderColor = AchievementModule.getRarityColor(achievement.rarity);
            
            // 添加悬停事件
            card.onmouseenter = () => showAchievementTooltip(achievement, card);
            card.onmouseleave = () => hideAchievementTooltip();
            
            card.innerHTML = `
                ${isTarget ? '<div class="target-badge">🎯</div>' : ''}
                ${isEquipped ? '<div class="equip-badge">⚡</div>' : ''}
                <div class="achievement-icon">${isUnlocked ? achievement.icon : '❓'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${isUnlocked ? achievement.description : '???'}</div>
                    ${!isUnlocked && progress > 0 ? `
                        <div class="achievement-progress-mini">
                            <div class="progress-bar-mini">
                                <div class="progress-fill-mini" style="width: ${progress}%"></div>
                            </div>
                            <span class="progress-text-mini">${progress}%</span>
                        </div>
                    ` : ''}
                </div>
                <div class="achievement-status ${isUnlocked ? 'unlocked' : 'locked'}">
                    ${isUnlocked ? '✓' : '🔒'}
                </div>
                <button class="achievement-equip-btn ${!isUnlocked ? 'disabled' : ''}" onclick="MainAchievementModule.handleEquipOnMain('${achievement.id}')">
                    ${isEquipped ? '取下' : (isUnlocked ? '佩戴' : '未解锁')}
                </button>
            `;
            
            grid.appendChild(card);
        });
    }

    /**
     * 显示成就悬停tooltip
     */
    function showAchievementTooltip(achievement, card) {
        const tooltip = document.createElement('div');
        tooltip.className = 'achievement-tooltip';
        tooltip.id = 'achievement-tooltip';
        
        const isUnlocked = achievement.unlockedAt !== null;
        
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <span class="tooltip-icon">${isUnlocked ? achievement.icon : '❓'}</span>
                <div>
                    <div class="tooltip-name">${achievement.name}</div>
                    <div class="tooltip-rarity" style="color: ${AchievementModule.getRarityColor(achievement.rarity)}">
                        ${AchievementModule.getRarityText(achievement.rarity)}
                    </div>
                </div>
            </div>
            <div class="tooltip-body">
                <div class="tooltip-desc">${isUnlocked ? achievement.description : '尚未解锁此成就'}</div>
                ${isUnlocked ? `
                    <div class="tooltip-story">📖 ${achievement.story}</div>
                    <div class="tooltip-rewards">
                        <span>⭐ 声望 +${achievement.rewards.prestige}</span>
                        <span>🏷️ ${achievement.rewards.title}</span>
                    </div>
                ` : `
                    <div class="tooltip-progress">
                        <div class="progress-bar-mini">
                            <div class="progress-fill-mini" style="width: ${achievement.progress}%"></div>
                        </div>
                        <span>进度: ${achievement.progress}%</span>
                    </div>
                `}
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // 定位tooltip（添加边界检测）
        const cardRect = card.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let leftPos = cardRect.left + cardRect.width + 15;
        let topPos = cardRect.top;
        
        // 如果tooltip超出右侧边界，显示在卡片左侧
        if (leftPos + tooltipRect.width > windowWidth) {
            leftPos = cardRect.left - tooltipRect.width - 15;
        }
        
        // 如果tooltip超出底部边界，向上调整
        if (topPos + tooltipRect.height > windowHeight) {
            topPos = windowHeight - tooltipRect.height - 20;
        }
        
        // 确保不超出顶部边界
        if (topPos < 20) {
            topPos = 20;
        }
        
        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `${topPos}px`;
    }

    /**
     * 隐藏成就悬停tooltip
     */
    function hideAchievementTooltip() {
        const tooltip = document.getElementById('achievement-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /**
     * 更新成就卡片佩戴状态
     */
    function updateAchievementCards() {
        document.querySelectorAll('.achievement-card').forEach(card => {
            const cardId = card.getAttribute('data-achievement-id');
            const btn = card.querySelector('.achievement-equip-btn');
            const isEquipped = AchievementModule.isEquipped(cardId);
            
            if (isEquipped) {
                card.classList.add('equipped');
                btn.textContent = '取下';
            } else {
                card.classList.remove('equipped');
                const achievement = AchievementModule.getAchievementData(cardId);
                btn.textContent = achievement && achievement.unlockedAt ? '佩戴' : '未解锁';
            }
        });
    }

    /**
     * 清除目标成就
     */
    function clearTargetAchievementMain() {
        AchievementModule.clearTarget();
        refreshTargetDisplay();
        alert('目标成就已清除！');
    }

    /**
     * 刷新目标成就显示
     */
    function refreshTargetDisplay() {
        const target = AchievementModule.getTarget();
        const targetSection = document.getElementById('target-achievement');
        
        if (target) {
            const achievement = AchievementModule.getAchievementData(target.id);
            if (achievement) {
                document.getElementById('target-icon').textContent = achievement.icon;
                document.getElementById('target-name').textContent = achievement.name;
                document.getElementById('target-desc').textContent = achievement.description;
                
                const progress = achievement.progress || 0;
                document.getElementById('target-progress-text').textContent = `${progress}%`;
                document.getElementById('target-progress-fill').style.width = `${progress}%`;
                
                targetSection.style.display = 'block';
            } else {
                targetSection.style.display = 'none';
            }
        } else {
            targetSection.style.display = 'none';
        }
    }

    /**
     * 页面加载时显示佩戴和目标成就
     */
    function loadEquippedAchievement() {
        renderMainAchievements();
        refreshEquippedDisplay();
        refreshTargetDisplay();
    }

    /**
     * 初始化模块
     */
    function init() {
        console.log('MainAchievementModule 初始化');
        
        // 确保DOM完全加载后再执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function readyCallback() {
                document.removeEventListener('DOMContentLoaded', readyCallback);
                loadEquippedAchievement();
            });
        } else {
            loadEquippedAchievement();
        }
        
        // 监听localStorage变化（跨页面联动）
        window.addEventListener('storage', function(e) {
            if (e.key === 'equippedAchievements') {
                refreshEquippedDisplay();
                renderMainAchievements();
            } else if (e.key === 'targetAchievement') {
                refreshTargetDisplay();
                renderMainAchievements();
            }
        });
    }

    // 暴露公共方法
    return {
        init: init,
        handleEquipOnMain: handleEquipOnMain,
        unequipFromSlot: unequipFromSlot,
        refreshEquippedDisplay: refreshEquippedDisplay,
        renderMainAchievements: renderMainAchievements,
        clearTargetAchievementMain: clearTargetAchievementMain,
        refreshTargetDisplay: refreshTargetDisplay
    };
})();
