/**
 * 分享模块 - ShareModule
 * 提供成就分享相关功能：微信好友、朋友圈、生成海报、复制链接
 * 使用方式：ShareModule.shareToWeChatFriend(achievement), ShareModule.generatePoster(achievement), etc.
 */
const ShareModule = (function() {
    // 当前分享的成就数据
    let currentAchievement = null;

    /**
     * 设置当前要分享的成就
     * @param {Object} achievement - 成就数据对象
     */
    function setCurrentAchievement(achievement) {
        currentAchievement = achievement;
    }

    /**
     * 获取当前分享的成就
     * @returns {Object|null} 当前成就数据
     */
    function getCurrentAchievement() {
        return currentAchievement;
    }

    /**
     * 分享到微信好友
     * @param {Object} achievement - 可选，成就数据对象
     */
    function shareToWeChatFriend(achievement = currentAchievement) {
        if (!achievement) {
            console.error('ShareModule: 没有可分享的成就');
            return;
        }
        
        const text = formatShareText(achievement);
        copyToClipboard(text);
        showNotification('成就信息已复制到剪贴板！', 'success');
        closeShareModal();
    }

    /**
     * 分享到朋友圈
     * @param {Object} achievement - 可选，成就数据对象
     */
    function shareToWeChatTimeline(achievement = currentAchievement) {
        if (!achievement) {
            console.error('ShareModule: 没有可分享的成就');
            return;
        }
        
        const text = formatShareText(achievement);
        copyToClipboard(text);
        showNotification('成就信息已复制到剪贴板！', 'success');
        closeShareModal();
    }

    /**
     * 生成成就海报
     * @param {Object} achievement - 可选，成就数据对象
     */
    function generatePoster(achievement = currentAchievement) {
        if (!achievement) {
            console.error('ShareModule: 没有可分享的成就');
            return;
        }
        
        closeShareModal();
        openPosterModal();
        
        // 生成海报
        const canvas = document.getElementById('poster-canvas');
        if (canvas) {
            renderPoster(canvas, achievement);
        }
    }

    /**
     * 复制成就链接
     * @param {Object} achievement - 可选，成就数据对象
     */
    function copyLink(achievement = currentAchievement) {
        if (!achievement) {
            console.error('ShareModule: 没有可分享的成就');
            return;
        }
        
        const url = `${window.location.origin}/achievements/index.html?achievement=${achievement.id}`;
        copyToClipboard(url);
        showNotification('链接已复制到剪贴板！', 'success');
        closeShareModal();
    }

    /**
     * 格式化分享文本
     * @param {Object} achievement - 成就数据对象
     * @returns {string} 格式化后的分享文本
     */
    function formatShareText(achievement) {
        return `我在枫榕赏金酒馆获得了成就：${achievement.icon} ${achievement.name}！${achievement.description}`;
    }

    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     */
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // 降级方案：创建临时textarea
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }

    /**
     * 在Canvas上渲染海报
     * @param {HTMLCanvasElement} canvas - Canvas元素
     * @param {Object} achievement - 成就数据对象
     */
    function renderPoster(canvas, achievement) {
        
        canvas.width = 400;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        
        // 背景渐变
        const gradient = ctx.createLinearGradient(0, 0, 0, 500);
        gradient.addColorStop(0, '#2D1E17');
        gradient.addColorStop(1, '#1A120B');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 500);
        
        // 金色边框
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, 380, 480);
        
        // 成就图标
        ctx.font = '80px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(achievement.icon, 200, 120);
        
        // 成就名称（处理长文字换行）
        ctx.font = 'bold 24px Microsoft YaHei';
        ctx.fillStyle = '#D4AF37';
        ctx.textAlign = 'center';
        const nameLines = wrapText(ctx, achievement.name, 360);
        nameLines.forEach((line, index) => {
            ctx.fillText(line, 200, 200 + index * 30);
        });
        
        // 计算稀有度标签位置（根据名称行数调整）
        const rarityY = 200 + nameLines.length * 30 + 15;
        
        // 稀有度标签
        ctx.font = '16px Microsoft YaHei';
        ctx.fillStyle = getRarityColor(achievement.rarity);
        ctx.fillText(achievement.rarityText, 200, rarityY);
        
        // 描述（处理长文字换行）
        ctx.font = '14px Microsoft YaHei';
        ctx.fillStyle = '#E8DCC8';
        const descY = rarityY + 35;
        const descLines = wrapText(ctx, achievement.description, 360);
        descLines.forEach((line, index) => {
            ctx.fillText(line, 200, descY + index * 22);
        });
        
        // 故事（处理长文字换行）
        ctx.font = 'italic 12px Microsoft YaHei';
        ctx.fillStyle = '#8B7355';
        let storyY = descY + descLines.length * 22 + 20;
        const story = `"${achievement.story}"`;
        const truncatedStory = story.length > 80 ? story.substring(0, 80) + '...' : story;
        const storyLines = wrapText(ctx, truncatedStory, 340);
        storyLines.forEach((line, index) => {
            ctx.fillText(line, 200, storyY + index * 18);
        });
        
        // 奖励信息（处理长文字换行）
        if (achievement.rewards) {
            ctx.font = '14px Microsoft YaHei';
            ctx.fillStyle = '#D4AF37';
            let rewardsY = storyY + storyLines.length * 18 + 20;
            ctx.fillText('🎁 奖励：', 200, rewardsY);
            
            let rewardsText = '';
            if (achievement.rewards.prestige) {
                rewardsText += `声望 +${achievement.rewards.prestige} `;
            }
            if (achievement.rewards.title) {
                rewardsText += `称号: ${achievement.rewards.title}`;
            }
            
            ctx.font = '12px Microsoft YaHei';
            ctx.fillStyle = '#E8DCC8';
            const rewardsLines = wrapText(ctx, rewardsText, 340);
            rewardsLines.forEach((line, index) => {
                ctx.fillText(line, 200, rewardsY + 22 + index * 18);
            });
        }
        
        // 底部装饰文字（居中）
        ctx.font = '14px Microsoft YaHei';
        ctx.fillStyle = '#D4AF37';
        ctx.textAlign = 'center';
        ctx.fillText('🏮 枫榕赏金酒馆', 200, 475);
    }

    /**
     * 文字换行处理
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {string} text - 要换行的文字
     * @param {number} maxWidth - 最大宽度
     * @returns {string[]} 换行后的行数组
     */
    function wrapText(ctx, text, maxWidth) {
        const lines = [];
        let currentLine = '';
        const chars = text.split('');
        
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            const testLine = currentLine + char;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = char;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    /**
     * 获取稀有度颜色
     * @param {string} rarity - 稀有度标识
     * @returns {string} 颜色值
     */
    function getRarityColor(rarity) {
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
     * 打开分享弹窗
     */
    function openShareModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    /**
     * 关闭分享弹窗
     */
    function closeShareModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    /**
     * 打开海报弹窗
     */
    function openPosterModal() {
        const modal = document.getElementById('poster-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    /**
     * 关闭海报弹窗
     */
    function closePosterModal() {
        const modal = document.getElementById('poster-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    /**
     * 下载海报
     * @param {string} filename - 文件名（可选）
     */
    function downloadPoster(filename) {
        const canvas = document.getElementById('poster-canvas');
        if (!canvas) {
            console.error('ShareModule: 未找到海报Canvas');
            return;
        }
        
        const achievement = currentAchievement;
        const defaultFilename = achievement ? `achievement-${achievement.id}.png` : 'achievement-poster.png';
        
        const link = document.createElement('a');
        link.download = filename || defaultFilename;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        closePosterModal();
    }

    /**
     * 显示通知
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型：success, info, error
     */
    function showNotification(message, type = 'info') {
        // 如果页面有showNotification函数则调用，否则用alert
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    /**
     * 初始化分享模块
     */
    async function init() {
        console.log('ShareModule 初始化');
        // 预加载二维码图片，提升生成海报时的性能
        await preloadQRCode();
        console.log('ShareModule: 二维码图片预加载完成');
    }

    // 暴露公共API
    return {
        // 设置/获取当前成就
        setCurrentAchievement: setCurrentAchievement,
        getCurrentAchievement: getCurrentAchievement,
        
        // 分享功能
        shareToWeChatFriend: shareToWeChatFriend,
        shareToWeChatTimeline: shareToWeChatTimeline,
        generatePoster: generatePoster,
        copyLink: copyLink,
        
        // 弹窗控制
        openShareModal: openShareModal,
        closeShareModal: closeShareModal,
        closePosterModal: closePosterModal,
        
        // 海报下载
        downloadPoster: downloadPoster,
        
        // 初始化
        init: init
    };
})();

// 页面加载完成后初始化分享模块
document.addEventListener('DOMContentLoaded', function() {
    ShareModule.init();
});
