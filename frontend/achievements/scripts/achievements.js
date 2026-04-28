// 当前选中的成就
let currentAchievement = null;

// Toast 通知函数
function showNotification(message, type = 'success') {
    const existingToast = document.querySelector('.notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    toast.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .notification-success {
            background: linear-gradient(135deg, #07c160, #06ad56);
        }
        .notification-error {
            background: linear-gradient(135deg, #ff4d4f, #ff7875);
        }
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    renderStats();
    renderCategories();
    renderAchievements('all');
});

// 监听localStorage变化（跨页面联动）
window.addEventListener('storage', function(e) {
    if (e.key === 'equippedAchievement') {
        const activeCategory = document.querySelector('.category-tab.active').dataset.category;
        renderAchievements(activeCategory);
    }
});

// 渲染统计数据
function renderStats() {
    const stats = AchievementModule.getStats();
    
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-unlocked').textContent = stats.unlocked;
    document.getElementById('stat-progress').textContent = stats.progress + '%';
    document.getElementById('stat-legendary').textContent = stats.unlockedLegendary + '/' + stats.legendary;
}

// 渲染分类标签
function renderCategories() {
    const cloudContainer = document.getElementById('category-cloud');
    cloudContainer.innerHTML = '';
    
    AchievementModule.getCategories().forEach(category => {
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

// 渲染成就卡片
function renderAchievements(categoryId = 'all') {
    const grid = document.getElementById('achievements-grid');
    const achievements = AchievementModule.filterByCategory(categoryId);
    
    // 使用文档片段减少DOM操作
    const fragment = document.createDocumentFragment();
    const existingCards = new Map();
    
    // 收集现有卡片
    grid.querySelectorAll('.achievement-card').forEach(card => {
        const id = card.dataset.achievementId;
        existingCards.set(id, card);
    });
    
    achievements.forEach(achievement => {
        const existingCard = existingCards.get(achievement.id);
        
        if (existingCard) {
            // 复用现有卡片，只更新状态
            updateCardStatus(existingCard, achievement);
            fragment.appendChild(existingCard);
            existingCards.delete(achievement.id);
        } else {
            // 创建新卡片
            const card = createAchievementCard(achievement);
            fragment.appendChild(card);
        }
    });
    
    // 移除不再需要的卡片
    existingCards.forEach(card => card.remove());
    
    // 一次性替换内容
    grid.innerHTML = '';
    grid.appendChild(fragment);
}

// 更新卡片状态（不重建DOM）
function updateCardStatus(card, achievement) {
    const status = AchievementModule.getStatus(achievement);
    const isEquipped = AchievementModule.isEquipped(achievement.id);
    
    // 更新状态类
    card.className = `achievement-card ${status} ${isEquipped ? 'equipped' : ''} rarity-${achievement.rarity}`;
    
    // 更新徽章
    const badge = card.querySelector('.equip-badge');
    if (isEquipped && !badge) {
        const newBadge = document.createElement('div');
        newBadge.className = 'equip-badge';
        newBadge.textContent = '⚡';
        card.appendChild(newBadge);
    } else if (!isEquipped && badge) {
        badge.remove();
    }
    
    // 更新按钮
    const btn = card.querySelector('.equip-btn');
    if (btn) {
        if (isEquipped) {
            btn.textContent = '取下';
            btn.classList.add('unequip');
            btn.classList.remove('equip');
        } else {
            btn.textContent = '佩戴';
            btn.classList.add('equip');
            btn.classList.remove('unequip');
        }
    }
    
    // 更新进度条
    const progressFill = card.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.className = `progress-fill ${status}`;
        progressFill.style.width = achievement.progress + '%';
    }
    
    // 更新进度文本
    const progressText = card.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = status === 'locked' ? '未解锁' : 
                                  status === 'unlocked' ? '已完成' : 
                                  `${achievement.requirements.current}/${achievement.requirements.target}`;
    }
    
    // 更新状态指示器
    const statusEl = card.querySelector('.card-status');
    if (statusEl) {
        statusEl.className = `card-status ${status}`;
        statusEl.textContent = status === 'locked' ? '🔒' : status === 'unlocked' ? '✓' : '...';
    }
}

// 创建成就卡片
function createAchievementCard(achievement) {
    const status = AchievementModule.getStatus(achievement);
    const isEquipped = AchievementModule.isEquipped(achievement.id);
    
    const card = document.createElement('div');
    card.className = `achievement-card ${status} ${isEquipped ? 'equipped' : ''} rarity-${achievement.rarity}`;
    card.dataset.achievementId = achievement.id;
    card.style.position = 'relative';
    
    card.innerHTML = `
        <div class="card-top-bar"></div>
        ${isEquipped ? '<div class="equip-badge">⚡</div>' : ''}
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
                <button class="equip-btn ${isEquipped ? 'unequip' : 'equip'}" onclick="handleEquipClick('${achievement.id}', event)">
                    ${isEquipped ? '取下' : '佩戴'}
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
    
    // 添加点击动画效果
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('equip-btn')) {
            card.classList.add('animate-scaleIn');
            setTimeout(() => {
                card.classList.remove('animate-scaleIn');
            }, 400);
            showAchievementDetail(achievement);
        }
    });
    
    return card;
}

// 渲染锁 - 避免重复渲染
let isRendering = false;
let pendingRender = false;

// 优化渲染函数
function scheduleRender() {
    if (isRendering) {
        pendingRender = true;
        return;
    }
    
    isRendering = true;
    
    requestAnimationFrame(() => {
        const activeCategory = document.querySelector('.category-tab.active').dataset.category;
        renderAchievements(activeCategory);
        
        isRendering = false;
        if (pendingRender) {
            pendingRender = false;
            scheduleRender();
        }
    });
}

// 处理佩戴/取下点击
function handleEquipClick(achievementId, event) {
    event.stopPropagation();
    
    const isEquipped = AchievementModule.isEquipped(achievementId);
    const achievement = AchievementModule.getAchievementData(achievementId);
    
    if (isEquipped) {
        // 卸下成就
        const equipped = AchievementModule.getEquipped();
        const index = equipped.findIndex(e => e && e.id === achievementId);
        if (index !== -1) {
            AchievementModule.unequip(index);
            showNotification(`「${achievement.name}」已取下！`, 'success');
            
            // 更新当前卡片状态（直接更新，不调用完整渲染）
            const card = document.querySelector(`[data-achievement-id="${achievementId}"]`);
            if (card) {
                updateCardStatus(card, achievement);
            }
            
            // 更新其他受影响的卡片（如果有的话）
            updateEquippedBadges();
        }
    } else {
        // 显示佩戴槽选择弹窗
        showSlotSelectModal(achievementId);
        return;
    }
}

// 更新佩戴徽章状态
function updateEquippedBadges() {
    const equippedIds = AchievementModule.getEquipped()
        .filter(e => e !== null)
        .map(e => e.id);
    
    document.querySelectorAll('.achievement-card').forEach(card => {
        const cardId = card.dataset.achievementId;
        const shouldHaveBadge = equippedIds.includes(cardId);
        const badge = card.querySelector('.equip-badge');
        
        if (shouldHaveBadge && !badge) {
            const newBadge = document.createElement('div');
            newBadge.className = 'equip-badge';
            newBadge.textContent = '⚡';
            card.appendChild(newBadge);
        } else if (!shouldHaveBadge && badge) {
            badge.remove();
        }
    });
}

// 显示佩戴槽选择弹窗
function showSlotSelectModal(achievementId) {
    const equipped = AchievementModule.getEquipped();
    const achievement = AchievementModule.getAchievementData(achievementId);
    
    let slotsHtml = '';
    for (let i = 0; i < AchievementModule.getMaxSlots(); i++) {
        const slotData = equipped[i];
        const isEmpty = !slotData;
        const slotAchievement = slotData ? AchievementModule.getAchievementData(slotData.id) : null;
        
        slotsHtml += `
            <div class="slot-option ${isEmpty ? 'empty' : 'filled'}" data-slot="${i}">
                <div class="slot-preview">
                    ${isEmpty ? '📭' : slotAchievement.icon}
                </div>
                <div class="slot-info">
                    <div class="slot-title">槽位${i + 1}</div>
                    <div class="slot-content">${isEmpty ? '空槽位' : slotAchievement.name}</div>
                </div>
                ${!isEmpty ? '<div class="slot-replace">点击替换</div>' : ''}
            </div>
        `;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h3>选择佩戴槽位</h3>
            <button class="modal-close" onclick="closeSlotModal()">×</button>
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
    
    // 绑定槽位点击事件
    modal.querySelectorAll('.slot-option').forEach(slot => {
        slot.addEventListener('click', function() {
            const slotIndex = parseInt(this.dataset.slot);
            AchievementModule.equip(achievementId, slotIndex);
            closeSlotModal();
            showNotification(`成就「${achievement.name}」已佩戴到槽位${slotIndex + 1}！`, 'success');
            
            // 更新当前卡片状态（直接更新，不调用完整渲染）
            const card = document.querySelector(`[data-achievement-id="${achievementId}"]`);
            if (card) {
                updateCardStatus(card, achievement);
            }
            
            // 更新佩戴徽章状态
            updateEquippedBadges();
        });
    });
}

// 关闭槽位选择弹窗
function closeSlotModal() {
    const modal = document.getElementById('slot-modal');
    if (modal) {
        modal.remove();
    }
}

// 设置目标成就
function setTargetAchievementClick(achievementId) {
    const achievement = AchievementModule.getAchievementData(achievementId);
    AchievementModule.setTarget(achievementId);
    showNotification(`已将「${achievement.name}」设为目标成就！`, 'success');
    
    // 更新详情弹窗中的按钮状态
    document.getElementById('set-target-btn').textContent = '已设为目标';
    document.getElementById('set-target-btn').disabled = true;
}

// 显示成就详情弹窗
function showAchievementDetail(achievement) {
    currentAchievement = achievement;
    const modal = document.getElementById('achievement-modal');
    
    document.getElementById('modal-icon').textContent = achievement.icon;
    document.getElementById('modal-name').textContent = achievement.name;
    
    const rarityEl = document.getElementById('modal-rarity');
    rarityEl.className = `modal-rarity rarity-${achievement.rarity}`;
    rarityEl.textContent = achievement.rarityText;
    
    document.getElementById('modal-description').textContent = achievement.description;
    document.getElementById('modal-story').textContent = achievement.story;
    
    const progressFill = document.getElementById('progress-fill');
    progressFill.className = `progress-fill ${AchievementModule.getStatus(achievement)}`;
    progressFill.style.width = achievement.progress + '%';
    
    document.getElementById('progress-text').textContent = 
        achievement.progress === 100 ? '已完成' : 
        `${achievement.requirements.current}/${achievement.requirements.target}`;
    
    // 渲染奖励
    const rewardsEl = document.getElementById('modal-rewards');
    rewardsEl.innerHTML = `
        <div class="reward-item">
            <span>⭐</span>
            <span>声望 +${achievement.rewards.prestige}</span>
        </div>
        <div class="reward-item">
            <span>🏷️</span>
            <span>称号: ${achievement.rewards.title}</span>
        </div>
    `;
    
    modal.classList.add('show');
}

// 关闭弹窗
function closeModal() {
    document.getElementById('achievement-modal').classList.remove('show');
    currentAchievement = null;
}

// 分享当前成就
function shareCurrentAchievement() {
    console.log('shareCurrentAchievement called');
    console.log('currentAchievement:', currentAchievement);
    
    closeModal();
    
    const shareModal = document.getElementById('share-modal');
    console.log('share-modal element:', shareModal);
    
    if (shareModal) {
        shareModal.classList.add('show');
        console.log('share-modal show class added');
    } else {
        console.error('share-modal element not found!');
    }
}

// 关闭分享弹窗
function closeShareModal() {
    document.getElementById('share-modal').classList.remove('show');
}

// 分享到微信好友
function shareToWeChatFriend() {
    if (!currentAchievement) return;
    
    const shareUrl = window.location.href;
    const shareTitle = `我在枫榕酒馆解锁了「${currentAchievement.name}」成就！`;
    
    if (isWeChatBrowser()) {
        // 微信内置浏览器
        showNotification('即将分享到微信好友...', 'success');
    } else {
        // 其他浏览器
        copyToClipboard(shareUrl);
        showNotification('链接已复制！请打开微信粘贴分享给好友', 'success');
        
        // 尝试唤起微信
        window.location.href = 'weixin://';
    }
    
    closeShareModal();
}

// 分享到朋友圈
function shareToWeChatTimeline() {
    if (!currentAchievement) return;
    
    const shareUrl = window.location.href;
    const shareTitle = `「${currentAchievement.name}」成就解锁！`;
    
    if (isWeChatBrowser()) {
        showNotification('即将分享到朋友圈...', 'success');
    } else {
        copyToClipboard(shareUrl);
        showNotification('链接已复制！请打开微信分享到朋友圈', 'success');
        window.location.href = 'weixin://';
    }
    
    closeShareModal();
}

// 复制成就链接
function copyAchievementLink() {
    if (!currentAchievement) return;
    
    const shareUrl = `${window.location.href}?achievement=${currentAchievement.id}`;
    copyToClipboard(shareUrl);
    showNotification('链接已复制到剪贴板！', 'success');
    
    closeShareModal();
}

// 生成成就海报
function generateAchievementPoster() {
    if (!currentAchievement) return;
    
    closeShareModal();
    
    const canvas = document.getElementById('poster-canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸（竖版海报）
    canvas.width = 400;
    canvas.height = 560;
    
    // 绘制背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#2d1810');
    gradient.addColorStop(1, '#1a0f0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制边框装饰
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // 绘制标题区域
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 24px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 枫榕酒馆 · 成就殿堂', canvas.width / 2, 60);
    
    // 绘制成就图标
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(currentAchievement.icon, canvas.width / 2, 180);
    
    // 绘制成就名称
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Microsoft YaHei';
    ctx.fillText(currentAchievement.name, canvas.width / 2, 250);
    
    // 绘制稀有度标签
    const rarityColor = rarityColors[currentAchievement.rarity] || '#9e9e9e';
    ctx.fillStyle = rarityColor;
    ctx.font = '16px Microsoft YaHei';
    ctx.fillText(`【${currentAchievement.rarityText}】`, canvas.width / 2, 280);
    
    // 绘制分隔线
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 310);
    ctx.lineTo(canvas.width - 60, 310);
    ctx.stroke();
    
    // 绘制成就描述
    ctx.fillStyle = '#a68b6d';
    ctx.font = '16px Microsoft YaHei';
    ctx.fillText(currentAchievement.description, canvas.width / 2, 340);
    
    // 绘制故事区域
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(40, 365, canvas.width - 80, 100);
    
    ctx.fillStyle = '#e8dcc8';
    ctx.font = '14px Microsoft YaHei';
    ctx.textAlign = 'left';
    
    // 多行文本处理
    const storyText = currentAchievement.story;
    const maxWidth = canvas.width - 100;
    const lines = wrapText(ctx, storyText, maxWidth);
    
    let y = 390;
    lines.forEach(line => {
        ctx.fillText(line, 50, y);
        y += 22;
    });
    
    // 绘制奖励区域
    ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
    ctx.fillRect(40, 480, canvas.width - 80, 60);
    
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 14px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.fillText(`🎁 奖励: 声望 +${currentAchievement.rewards.prestige} · 称号「${currentAchievement.rewards.title}」`, canvas.width / 2, 510);
    
    // 绘制底部装饰
    ctx.fillStyle = '#d4af37';
    ctx.font = '12px Microsoft YaHei';
    ctx.fillText('扫码查看详情', canvas.width / 2, 545);
    
    document.getElementById('poster-modal').classList.add('show');
}

// 文本换行
function wrapText(ctx, text, maxWidth) {
    const words = text.split('');
    const lines = [];
    let currentLine = '';
    
    words.forEach(char => {
        const testLine = currentLine + char;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = char;
        } else {
            currentLine = testLine;
        }
    });
    
    lines.push(currentLine);
    return lines;
}

// 下载海报
function downloadPoster() {
    const canvas = document.getElementById('poster-canvas');
    const link = document.createElement('a');
    link.download = `成就_${currentAchievement.name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// 关闭海报弹窗
function closePosterModal() {
    document.getElementById('poster-modal').classList.remove('show');
}

// 判断是否为微信浏览器
function isWeChatBrowser() {
    return /MicroMessenger/i.test(navigator.userAgent);
}

// 复制到剪贴板
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('复制失败:', err);
    }
    
    document.body.removeChild(textarea);
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    const modals = ['achievement-modal', 'share-modal', 'poster-modal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal.classList.contains('show') && e.target === modal) {
            modal.classList.remove('show');
        }
    });
});
