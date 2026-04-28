/**
 * 分类标签组件
 * 展示成就分类，支持切换筛选
 */
class CategoryTabs {
    constructor(container) {
        this.container = container;
        this.categories = [];
        this.activeCategory = 'all';
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
     * 设置分类数据
     * @param {Array} categories - 分类列表
     */
    setCategories(categories) {
        this.categories = categories;
        this.render();
    }

    /**
     * 渲染分类标签
     */
    render() {
        // 添加"全部"分类
        const allCategory = {
            id: 'all',
            name: '全部',
            count: this.getTotalCount()
        };

        const allCategories = [allCategory, ...this.categories];

        this.container.innerHTML = allCategories.map(cat => `
            <button 
                class="category-tab ${cat.id === this.activeCategory ? 'active' : ''}"
                data-category="${cat.id}"
            >
                ${cat.name}
                <span class="category-count">${cat.count}</span>
            </button>
        `).join('');
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        this.container.addEventListener('click', (e) => {
            const tab = e.target.closest('.category-tab');
            if (tab) {
                const categoryId = tab.dataset.category;
                this.setActiveCategory(categoryId);
            }
        });
    }

    /**
     * 设置活动分类
     * @param {string} categoryId - 分类ID
     */
    setActiveCategory(categoryId) {
        this.activeCategory = categoryId;
        StateManager.setActiveCategory(categoryId);
        this.render();
        EventBus.emit('category.changed', categoryId);
    }

    /**
     * 获取活动分类
     * @returns {string} 当前活动分类
     */
    getActiveCategory() {
        return this.activeCategory;
    }

    /**
     * 获取总数
     * @returns {number} 总数
     */
    getTotalCount() {
        return this.categories.reduce((sum, cat) => sum + cat.count, 0);
    }

    /**
     * 更新分类统计
     * @param {Object} stats - 统计数据
     */
    updateStats(stats) {
        // 这里可以更新分类的解锁数量等信息
        this.render();
    }
}

// 导出到全局
window.CategoryTabs = CategoryTabs;
