/**
 * 组件索引文件
 * 统一导出所有成就模块组件
 */
(function() {
    // 等待AchievementModule初始化完成
    function waitForAchievementModule(callback, maxAttempts = 50) {
        let attempts = 0;

        function check() {
            attempts++;
            if (typeof AchievementModule !== 'undefined' && AchievementModule.getAllAchievements) {
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(check, 100);
            } else {
                console.error('AchievementComponents: AchievementModule 未找到');
            }
        }

        check();
    }

    // 初始化组件
    function initComponents() {
        console.log('AchievementComponents: 开始初始化');

        // 初始化状态管理器（从AchievementModule获取数据）
        StateManager.init();

        // 初始化成就模态框实例
        const modalInstance = new AchievementModal();

        // 获取分类容器
        const categoryContainer = document.querySelector('.category-tag-container');
        if (categoryContainer) {
            initCategoryTabs(categoryContainer);
        }

        // 初始化成就卡片列表
        const gridContainer = document.getElementById('achievements-grid');
        if (gridContainer) {
            renderAchievements();
        }

        // 监听分类变化
        EventBus.on('category.changed', (categoryId) => {
            renderAchievements(categoryId);
        });

        // 监听数据更新
        EventBus.on(AchievementEvents.DATA_UPDATED, () => {
            renderAchievements();
        });

        console.log('AchievementComponents: 所有组件初始化完成');
    }

    // 初始化分类标签
    function initCategoryTabs(container) {
        const achievements = StateManager.getAchievements();

        // 统计各分类数量
        const categoryMap = {};
        achievements.forEach(a => {
            if (!categoryMap[a.category]) {
                categoryMap[a.category] = { id: a.category, name: a.category, count: 0 };
            }
            categoryMap[a.category].count++;
        });

        const categories = Object.values(categoryMap);
        const totalCount = achievements.length;

        // 构建HTML
        container.innerHTML = `
            <button class="category-tag active" data-category="all">
                全部 <span class="count">${totalCount}</span>
            </button>
            ${categories.map(cat => `
                <button class="category-tag" data-category="${cat.id}">
                    ${cat.name} <span class="count">${cat.count}</span>
                </button>
            `).join('')}
        `;

        // 绑定点击事件
        container.querySelectorAll('.category-tag').forEach(btn => {
            btn.addEventListener('click', function() {
                container.querySelectorAll('.category-tag').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const categoryId = this.dataset.category;
                StateManager.setActiveCategory(categoryId);
                EventBus.emit('category.changed', categoryId);
            });
        });
    }

    // 渲染成就列表
    function renderAchievements(categoryId) {
        const gridContainer = document.getElementById('achievements-grid');
        if (!gridContainer) return;

        const activeCategory = categoryId || StateManager.getActiveCategory() || 'all';
        const achievements = StateManager.getAchievements(activeCategory);

        // 清空容器
        gridContainer.innerHTML = '';

        // 创建卡片
        achievements.forEach(achievement => {
            const card = createAchievementCard(achievement);
            gridContainer.appendChild(card);
        });
    }

    // 创建成就卡片
    function createAchievementCard(achievement) {
        const isUnlocked = achievement.progress >= 100;
        const rarityColor = getRarityColor(achievement.rarity);

        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.dataset.id = achievement.id;

        card.innerHTML = `
            <div class="achievement-icon" style="background: linear-gradient(145deg, ${rarityColor}22, ${rarityColor}44);">
                <span>${isUnlocked ? achievement.icon : '❓'}</span>
            </div>
            <div class="achievement-info">
                <h4 class="achievement-name">${achievement.name}</h4>
                <span class="achievement-category">${achievement.category}</span>
                <span class="achievement-rarity" style="color: ${rarityColor}">${achievement.rarityText}</span>
            </div>
            ${isUnlocked ? `
                <div class="achievement-badge">✓</div>
                <div class="achievement-date">${achievement.unlockedAt || ''}</div>
            ` : `
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${achievement.progress}%"></div>
                    </div>
                    <span>${achievement.progress}%</span>
                </div>
            `}
        `;

        // 点击打开详情
        card.addEventListener('click', () => {
            EventBus.emit(AchievementEvents.DETAIL_OPENED, achievement);
        });

        return card;
    }

    // 获取稀有度颜色
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

    // 页面加载完成后等待AchievementModule就绪，然后初始化
    waitForAchievementModule(initComponents);

    // 导出到全局
    window.AchievementComponents = {
        renderAchievements,
        getRarityColor
    };
})();
