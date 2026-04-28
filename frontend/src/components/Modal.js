/**
 * 模态框组件
 */
class Modal {
    constructor() {
        this.overlay = null;
        this.content = null;
        this.isOpen = false;
    }
    
    /**
     * 创建模态框
     */
    create(options = {}) {
        // 创建遮罩层
        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        
        // 创建内容容器
        this.content = document.createElement('div');
        this.content.style.cssText = `
            background: linear-gradient(145deg, #2D1E17, #1A120B);
            border: 2px solid #d4af37;
            border-radius: 12px;
            padding: 30px;
            min-width: 300px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            transform: scale(0.9);
            transition: all 0.3s ease;
        `;
        
        // 添加关闭按钮
        if (options.closable !== false) {
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255,255,255,0.1);
                border: none;
                color: #d4af37;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.2s;
            `;
            closeBtn.onclick = () => this.close();
            closeBtn.onmouseenter = () => {
                closeBtn.style.background = 'rgba(231, 76, 60, 0.8)';
                closeBtn.style.color = 'white';
            };
            closeBtn.onmouseleave = () => {
                closeBtn.style.background = 'rgba(255,255,255,0.1)';
                closeBtn.style.color = '#d4af37';
            };
            this.content.style.position = 'relative';
            this.content.appendChild(closeBtn);
        }
        
        this.overlay.appendChild(this.content);
        document.body.appendChild(this.overlay);
        
        // ESC键关闭
        this.handleEscape = (e) => {
            if (e.key === 'Escape' && this.isOpen && options.closable !== false) {
                this.close();
            }
        };
        document.addEventListener('keydown', this.handleEscape);
        
        // 点击遮罩关闭
        this.overlay.onclick = (e) => {
            if (e.target === this.overlay && options.closable !== false) {
                this.close();
            }
        };
    }
    
    /**
     * 打开模态框
     */
    open(content) {
        if (!this.overlay) {
            this.create();
        }
        
        // 设置内容
        if (typeof content === 'string') {
            this.content.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.content.innerHTML = '';
            this.content.appendChild(content);
        }
        
        // 显示
        this.isOpen = true;
        this.overlay.style.opacity = '1';
        this.overlay.style.visibility = 'visible';
        this.content.style.transform = 'scale(1)';
        
        // 触发事件
        this.overlay.dispatchEvent(new CustomEvent('modalOpen'));
    }
    
    /**
     * 关闭模态框
     */
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.overlay.style.opacity = '0';
        this.overlay.style.visibility = 'hidden';
        this.content.style.transform = 'scale(0.9)';
        
        // 触发事件
        this.overlay.dispatchEvent(new CustomEvent('modalClose'));
    }
    
    /**
     * 更新内容
     */
    updateContent(content) {
        if (typeof content === 'string') {
            this.content.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.content.innerHTML = '';
            this.content.appendChild(content);
        }
    }
    
    /**
     * 销毁模态框
     */
    destroy() {
        this.close();
        setTimeout(() => {
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
                this.content = null;
            }
            document.removeEventListener('keydown', this.handleEscape);
        }, 300);
    }
    
    /**
     * 设置标题
     */
    setTitle(title) {
        const titleElement = document.createElement('h3');
        titleElement.style.cssText = `
            color: #d4af37;
            margin-bottom: 20px;
            text-align: center;
            font-size: 1.3rem;
        `;
        titleElement.textContent = title;
        this.content.insertBefore(titleElement, this.content.firstChild);
    }
    
    /**
     * 设置大小
     */
    setSize(width, height) {
        if (width) this.content.style.width = width;
        if (height) this.content.style.height = height;
    }
}

// 创建单例
const ModalModule = new Modal();

// 全局方法
window.ModalModule = ModalModule;

export default ModalModule;