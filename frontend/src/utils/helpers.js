/**
 * 工具函数模块
 * 提供通用的工具方法
 */
const Helpers = {
    /**
     * 格式化日期
     */
    formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    /**
     * 格式化相对时间
     */
    formatRelativeTime(date) {
        const now = new Date();
        const past = new Date(date);
        const diff = now - past;
        
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;
        const week = 7 * day;
        const month = 30 * day;
        
        if (diff < minute) return '刚刚';
        if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
        if (diff < day) return `${Math.floor(diff / hour)}小时前`;
        if (diff < week) return `${Math.floor(diff / day)}天前`;
        if (diff < month) return `${Math.floor(diff / week)}周前`;
        return this.formatDate(date, 'YYYY-MM-DD');
    },
    
    /**
     * 生成UUID
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    /**
     * 获取URL参数
     */
    getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },
    
    /**
     * 设置URL参数
     */
    setUrlParam(name, value) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set(name, value);
        window.history.pushState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    },
    
    /**
     * 防抖函数
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * 节流函数
     */
    throttle(func, limit = 200) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },
    
    /**
     * 深拷贝对象
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(item => this.deepClone(item));
        const clone = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = this.deepClone(obj[key]);
            }
        }
        return clone;
    },
    
    /**
     * 安全获取对象属性
     */
    get(obj, path, defaultValue = null) {
        const keys = path.split('.');
        let result = obj;
        for (const key of keys) {
            if (result === null || result === undefined) return defaultValue;
            result = result[key];
        }
        return result !== undefined ? result : defaultValue;
    },
    
    /**
     * 随机数组元素
     */
    randomArrayItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
    
    /**
     * 数组去重
     */
    uniqueArray(arr, key) {
        if (key) {
            const seen = new Set();
            return arr.filter(item => {
                const value = item[key];
                if (seen.has(value)) return false;
                seen.add(value);
                return true;
            });
        }
        return [...new Set(arr)];
    },
    
    /**
     * 数字千分位格式化
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    /**
     * 截断文本
     */
    truncateText(text, maxLength = 100, suffix = '...') {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + suffix : text;
    },
    
    /**
     * 生成随机颜色
     */
    randomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    },
    
    /**
     * 滚动到页面顶部
     */
    scrollToTop(smooth = true) {
        window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    },
    
    /**
     * 滚动到指定元素
     */
    scrollToElement(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({ top: elementPosition, behavior: 'smooth' });
        }
    },
    
    /**
     * 显示Toast提示
     */
    toast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        const bgColors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${bgColors[type] || bgColors.info};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        toast.innerHTML = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    /**
     * 显示确认对话框
     */
    confirm(message, title = '确认') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            `;
            
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: linear-gradient(145deg, #2D1E17, #1A120B);
                border: 2px solid #d4af37;
                border-radius: 12px;
                padding: 30px;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            `;
            
            dialog.innerHTML = `
                <h3 style="color: #d4af37; margin-bottom: 15px; text-align: center;">${title}</h3>
                <p style="color: #D4C39E; margin-bottom: 20px; text-align: center;">${message}</p>
                <div style="display: flex; gap: 15px;">
                    <button style="flex: 1; padding: 10px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="resolve(false); overlay.remove();">取消</button>
                    <button style="flex: 1; padding: 10px; background: #8C2B1B; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="resolve(true); overlay.remove();">确认</button>
                </div>
            `;
            
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
        });
    },
    
    /**
     * 加载CSS文件
     */
    loadCSS(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    },
    
    /**
     * 加载JS文件
     */
    loadJS(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
};

export default Helpers;