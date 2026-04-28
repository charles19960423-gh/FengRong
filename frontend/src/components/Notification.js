/**
 * 通知组件
 */
class Notification {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.init();
    }
    
    init() {
        // 创建通知容器
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
        
        // 添加动画样式
        this.addAnimationStyles();
    }
    
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * 显示通知
     */
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        const id = Date.now().toString();
        
        // 设置背景色
        const bgColors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#8C2B1B'
        };
        
        // 设置图标
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: '📢'
        };
        
        notification.id = `notification-${id}`;
        notification.style.cssText = `
            background: ${bgColors[type] || bgColors.info};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
            max-width: 350px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.innerHTML = `
            <span style="font-size: 1.2rem;">${icons[type] || icons.info}</span>
            <span style="flex: 1;">${message}</span>
            <button onclick="NotificationModule.remove('${id}')" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 5px 10px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 0.8rem;
            ">✕</button>
        `;
        
        this.container.appendChild(notification);
        this.notifications.push({ id, element: notification });
        
        // 自动移除
        setTimeout(() => {
            this.remove(id);
        }, duration);
    }
    
    /**
     * 移除通知
     */
    remove(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.element.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.element.remove();
                this.notifications = this.notifications.filter(n => n.id !== id);
            }, 300);
        }
    }
    
    /**
     * 成功通知
     */
    success(message, duration) {
        this.show(message, 'success', duration);
    }
    
    /**
     * 错误通知
     */
    error(message, duration) {
        this.show(message, 'error', duration);
    }
    
    /**
     * 警告通知
     */
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }
    
    /**
     * 信息通知
     */
    info(message, duration) {
        this.show(message, 'info', duration);
    }
    
    /**
     * 清除所有通知
     */
    clearAll() {
        this.notifications.forEach(n => {
            n.element.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => n.element.remove(), 300);
        });
        this.notifications = [];
    }
}

// 创建单例
const NotificationModule = new Notification();

// 全局方法
window.NotificationModule = NotificationModule;

export default NotificationModule;