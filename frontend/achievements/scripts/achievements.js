// 当前选中的成就
let currentAchievement = null;

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
    const stats = getAchievementStats();
    
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-unlocked').textContent = stats.unlocked;
    document.getElementById('stat-progress').textContent = stats.progress + '%';
    document.getElementById('stat-legendary').textContent = stats.unlockedLegendary + '/' + stats.legendary;
}

// 渲染分类标签
function renderCategories() {
    const cloudContainer = document.getElementById('category-cloud');
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

// 渲染成就卡片
function renderAchievements(categoryId) {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';
    
    const achievements = filterAchievementsByCategory(categoryId);
    
    achievements.forEach(achievement => {
        const card = createAchievementCard(achievement);
        grid.appendChild(card);
    });
}

// 创建成就卡片
function createAchievementCard(achievement) {
    const status = getAchievementStatus(achievement);
    const isEquipped = isAchievementEquipped(achievement.id);
    
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

// 处理佩戴/取下点击
function handleEquipClick(achievementId, event) {
    event.stopPropagation();
    
    const isEquipped = isAchievementEquipped(achievementId);
    
    if (isEquipped) {
        // 卸下成就
        const equipped = getEquippedAchievements();
        const index = equipped.findIndex(e => e && e.id === achievementId);
        if (index !== -1) {
            unequipAchievement(index);
            alert('成就已取下！');
        }
    } else {
        // 显示佩戴槽选择弹窗
        showSlotSelectModal(achievementId);
    }
    
    // 重新渲染成就列表
    const activeCategory = document.querySelector('.category-tab.active').dataset.category;
    renderAchievements(activeCategory);
}

// 显示佩戴槽选择弹窗
function showSlotSelectModal(achievementId) {
    const equipped = getEquippedAchievements();
    const achievement = achievementData[achievementId];
    
    let slotsHtml = '';
    for (let i = 0; i < MAX_EQUIP_SLOTS; i++) {
        const slotData = equipped[i];
        const isEmpty = !slotData;
        const slotAchievement = slotData ? achievementData[slotData.id] : null;
        
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
            equipAchievement(achievementId, slotIndex);
            closeSlotModal();
            alert(`成就「${achievement.name}」已佩戴到槽位${slotIndex + 1}！`);
            
            // 重新渲染成就列表
            const activeCategory = document.querySelector('.category-tab.active').dataset.category;
            renderAchievements(activeCategory);
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
    const achievement = achievementData[achievementId];
    setTargetAchievement(achievementId);
    alert(`已将「${achievement.name}」设为目标成就！`);
    
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
    progressFill.className = `progress-fill ${getAchievementStatus(achievement)}`;
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
    closeModal();
    document.getElementById('share-modal').classList.add('show');
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
        alert(`即将分享到微信好友：\n\n${shareTitle}\n${shareUrl}`);
    } else {
        // 其他浏览器
        copyToClipboard(shareUrl);
        alert(`链接已复制！\n\n${shareTitle}\n\n请打开微信粘贴分享给好友`);
        
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
        alert(`即将分享到朋友圈：\n\n${shareTitle}\n${shareUrl}`);
    } else {
        copyToClipboard(shareUrl);
        alert(`链接已复制！\n\n${shareTitle}\n\n请打开微信分享到朋友圈`);
        window.location.href = 'weixin://';
    }
    
    closeShareModal();
}

// 复制成就链接
function copyAchievementLink() {
    if (!currentAchievement) return;
    
    const shareUrl = `${window.location.href}?achievement=${currentAchievement.id}`;
    copyToClipboard(shareUrl);
    alert(`链接已复制！\n\n${shareUrl}`);
    
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
