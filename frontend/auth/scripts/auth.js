/**
 * 认证模块 - AuthModule
 * 提供登录、注册、登出等认证功能
 * 使用方式：AuthModule.openModal(), AuthModule.handleLogin(), AuthModule.handleLogout()
 */
const AuthModule = (function() {
    // 模块内部状态
    let authToken = localStorage.getItem('tavern_token');
    let currentUser = null;
    
    // DOM元素
    let modal = null;
    let loginForm = null;
    let registerForm = null;
    
    // 模拟用户数据（用于本地测试）
    const mockUsers = {
        'admin': { 
            username: 'admin', 
            nickname: '馆主大人', 
            email: 'admin@example.com', 
            role: 'admin' 
        },
        'user1': { 
            username: 'user1', 
            nickname: '江湖游侠', 
            email: 'user1@example.com', 
            role: 'user' 
        },
        'user2': { 
            username: 'user2', 
            nickname: '赏金猎人', 
            email: 'user2@example.com', 
            role: 'user' 
        }
    };
    
    /**
     * 初始化模块
     */
    function init() {
        console.log('AuthModule init 开始');
        
        // 加载HTML模板
        loadAuthTemplate();
        console.log('AuthModule HTML模板加载完成');
        
        // 初始化DOM引用
        initDOMReferences();
        console.log('AuthModule DOM引用初始化完成, modal:', !!modal);
        
        // 尝试自动登录
        autoLogin();
        console.log('AuthModule 自动登录完成');
        
        // 初始化导航栏
        updateUserNav(null);
        console.log('AuthModule 导航栏更新完成');
    }
    
    /**
     * 加载认证模态框HTML模板
     */
    function loadAuthTemplate() {
        console.log('AuthModule.loadAuthTemplate: 开始加载模板');
        
        // 直接内嵌HTML模板，避免异步加载问题
        const html = `
<div class="auth-modal-overlay" id="authModal">
    <div class="auth-modal-content" style="background: linear-gradient(145deg, #2D1E17 0%, #1A120B 100%);">
        <span class="auth-modal-close" onclick="AuthModule.closeModal()">✕</span>
        <h3 style="color: #d4af37; margin-bottom: 20px; text-align: center;">🔐 冒险者登录</h3>
        
        <div id="authLoginForm" class="auth-form" style="padding: 20px;">
            <div class="auth-form-group">
                <label style="color: #8C2B1B;">【账号 / Username】</label>
                <input type="text" id="authLoginUsername" placeholder="输入你的冒险者ID">
            </div>
            <div class="auth-form-group">
                <label style="color: #8C2B1B;">【秘钥 / Password】</label>
                <input type="password" id="authLoginPassword" placeholder="输入你的秘钥">
            </div>
            <button class="auth-btn-main" id="authLoginBtn" onclick="AuthModule.handleLogin()" style="margin-bottom: 15px;">
                🗡️ 进入江湖
            </button>
            <p style="text-align: center; color: #a68b6d; font-size: 0.85rem;">
                还没有身份？ <a href="javascript:void(0)" onclick="AuthModule.showRegisterForm()" style="color: #d4af37;">前往注册</a>
            </p>
        </div>

        <div id="authRegisterForm" class="auth-form" style="padding: 20px; display: none;">
            <div class="auth-form-group">
                <label style="color: #8C2B1B;">【冒险者ID / Username】</label>
                <input type="text" id="authRegUsername" placeholder="创建你的冒险者ID">
            </div>
            <div class="auth-form-group">
                <label style="color: #8C2B1B;">【秘钥 / Password】</label>
                <input type="password" id="authRegPassword" placeholder="设置你的秘钥">
            </div>
            <div class="auth-form-group">
                <label style="color: #8C2B1B;">【江湖名号 / Nickname】</label>
                <input type="text" id="authRegNickname" placeholder="你的江湖称号">
            </div>
            <div class="auth-form-group">
                <label style="color: #8C2B1B;">【联络方式 / Email】</label>
                <input type="email" id="authRegEmail" placeholder="你的邮箱">
            </div>
            <button class="auth-btn-main" id="authRegisterBtn" onclick="AuthModule.handleRegister()" style="margin-bottom: 15px;">
                📜 注册成为冒险者
            </button>
            <p style="text-align: center; color: #a68b6d; font-size: 0.85rem;">
                已有身份？ <a href="javascript:void(0)" onclick="AuthModule.showLoginForm()" style="color: #d4af37;">返回登录</a>
            </p>
        </div>
    </div>
</div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        console.log('AuthModule.loadAuthTemplate: 模板已插入DOM');
    }
    
    /**
     * 初始化DOM引用
     */
    function initDOMReferences() {
        modal = document.getElementById('authModal');
        loginForm = document.getElementById('authLoginForm');
        registerForm = document.getElementById('authRegisterForm');
    }
    
    /**
     * 尝试自动登录
     */
    async function autoLogin() {
        if (!authToken) return;
        
        try {
            // 尝试从后端获取用户信息
            const user = await getCurrentUserFromBackend();
            if (user) {
                currentUser = user;
                updateUserNav(user);
                showNotification(`欢迎回来，${user.nickname}！`, 'success');
            }
        } catch (error) {
            console.error('自动登录失败:', error);
            // 清除无效token
            authToken = null;
            localStorage.removeItem('tavern_token');
        }
    }
    
    /**
     * 从后端获取当前用户
     */
    async function getCurrentUserFromBackend() {
        // 这里可以替换为真实的API调用
        // 目前返回mock数据
        const tokenParts = authToken ? authToken.split('_') : [];
        if (tokenParts.length >= 3) {
            const username = tokenParts[2];
            if (mockUsers[username]) {
                return mockUsers[username];
            }
        }
        return null;
    }
    
    /**
     * 打开登录模态框
     */
    function openModal() {
        console.log('AuthModule.openModal 被调用, modal:', !!modal);
        if (!modal) {
            console.log('AuthModule.openModal: modal为空，尝试重新初始化DOM引用');
            initDOMReferences();
            console.log('AuthModule.openModal: 重新初始化后 modal:', !!modal);
        }
        if (modal) {
            modal.style.display = 'flex';
            showLoginForm();
            console.log('AuthModule.openModal: 模态框已显示');
        } else {
            console.error('AuthModule.openModal: modal仍然为空！');
        }
    }
    
    /**
     * 关闭登录模态框
     */
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    /**
     * 显示登录表单
     */
    function showLoginForm() {
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
    }
    
    /**
     * 显示注册表单
     */
    function showRegisterForm() {
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
    }
    
    /**
     * 处理登录
     */
    async function handleLogin() {
        const username = document.getElementById('authLoginUsername').value;
        const password = document.getElementById('authLoginPassword').value;
        
        if (!username || !password) {
            alert('请填写完整的账号和秘钥');
            return;
        }
        
        try {
            // 尝试后端登录
            const result = await loginWithBackend(username, password);
            if (result) {
                handleLoginSuccess(result);
                return;
            }
        } catch (error) {
            console.error('后端登录失败:', error);
        }
        
        // 尝试本地模拟登录
        const mockUser = mockLogin(username, password);
        if (mockUser) {
            handleLoginSuccess(mockUser);
        } else {
            alert('登录失败：账号或密码错误');
        }
    }
    
    /**
     * 后端登录
     */
    async function loginWithBackend(username, password) {
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || '登录失败');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('后端登录失败:', error);
            return null;
        }
    }
    
    /**
     * 本地模拟登录
     */
    function mockLogin(username, password) {
        // 所有mock用户的默认密码都是 password
        if (mockUsers[username] && password === 'password') {
            authToken = 'mock_token_' + username;
            localStorage.setItem('tavern_token', authToken);
            return mockUsers[username];
        }
        
        // 检查已注册用户
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '{}');
        if (registeredUsers[username] && registeredUsers[username].password === password) {
            authToken = 'mock_token_' + username;
            localStorage.setItem('tavern_token', authToken);
            return registeredUsers[username];
        }
        
        return null;
    }
    
    /**
     * 处理登录成功
     */
    function handleLoginSuccess(result) {
        // 解析登录结果
        const user = result.data ? result.data.user : result;
        const prestige = result.data ? result.data.prestige : null;
        
        // 设置token
        if (result.data && result.data.token) {
            authToken = result.data.token;
            localStorage.setItem('tavern_token', authToken);
        }
        
        currentUser = user;
        
        // 更新导航栏
        updateUserNav(user);
        
        // 关闭模态框
        closeModal();
        
        // 跳转到用户中心
        window.location.hash = '#profile';
        
        // 显示登录奖励通知
        if (prestige && prestige.dailyBonusReceived) {
            const bonusMsg = prestige.continuousDays >= 30 
                ? `🎁 登录奖励 +50，连续登录30天额外奖励 +500！共计 +550 声望！`
                : prestige.continuousDays >= 7
                ? `🎁 登录奖励 +50，连续登录7天额外奖励 +200！共计 +250 声望！`
                : `🎁 登录奖励 +50 声望！连续登录 ${prestige.continuousDays} 天`;
            showNotification(bonusMsg, 'success');
        } else if (prestige) {
            showNotification(`今日登录奖励已领取`, 'info');
        }
        
        // 显示欢迎通知
        showNotification(`🎉 ${user.nickname}，欢迎进入江湖！`, 'success');
        
        // 更新声望系统
        if (prestige && typeof PrestigeSystemV1 !== 'undefined') {
            PrestigeSystemV1.init({ 
                prestige: prestige.prestige || 2850, 
                level: prestige.level || '初级猎人', 
                continuousDays: prestige.continuousDays || 0 
            });
        }
        
        // 触发自定义事件通知其他模块
        dispatchAuthEvent('login', { ...user, prestige });
    }
    
    /**
     * 处理注册
     */
    async function handleRegister() {
        const username = document.getElementById('authRegUsername').value;
        const password = document.getElementById('authRegPassword').value;
        const nickname = document.getElementById('authRegNickname').value;
        const email = document.getElementById('authRegEmail').value;
        
        if (!username || !password || !nickname) {
            alert('请填写完整的注册信息（账号、密码、江湖名号）');
            return;
        }
        
        // 验证用户名格式
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            alert('冒险者ID只能包含字母、数字和下划线');
            return;
        }
        
        try {
            // 尝试后端注册
            const result = await registerWithBackend(username, password, nickname, email);
            if (result) {
                handleRegisterSuccess();
                return;
            }
        } catch (error) {
            console.error('后端注册失败:', error);
        }
        
        // 本地模拟注册
        mockRegister(username, password, nickname, email);
        handleRegisterSuccess();
    }
    
    /**
     * 后端注册
     */
    async function registerWithBackend(username, password, nickname, email) {
        // 这里可以替换为真实的API调用
        // 目前返回null，表示使用本地模拟
        return null;
    }
    
    /**
     * 本地模拟注册
     */
    function mockRegister(username, password, nickname, email) {
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '{}');
        
        if (registeredUsers[username]) {
            alert('该冒险者ID已被注册');
            throw new Error('用户名已存在');
        }
        
        registeredUsers[username] = {
            username: username,
            password: password,
            nickname: nickname,
            email: email,
            role: 'user'
        };
        
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
    }
    
    /**
     * 处理注册成功
     */
    function handleRegisterSuccess() {
        alert('注册成功！请登录');
        showLoginForm();
    }
    
    /**
     * 处理登出
     */
    async function handleLogout() {
        try {
            // 尝试后端登出
            await logoutWithBackend();
        } catch (error) {
            console.error('后端登出失败:', error);
        }
        
        // 清除本地状态
        authToken = null;
        currentUser = null;
        localStorage.removeItem('tavern_token');
        
        // 更新导航栏
        updateUserNav(null);
        
        // 显示通知
        showNotification('已安全退出江湖', 'info');
        
        // 触发自定义事件通知其他模块
        dispatchAuthEvent('logout');
    }
    
    /**
     * 后端登出
     */
    async function logoutWithBackend() {
        // 这里可以替换为真实的API调用
    }
    
    /**
     * 更新用户导航栏
     */
    function updateUserNav(user) {
        const authNav = document.getElementById('authNav');
        if (!authNav) return;
        
        if (user) {
            authNav.innerHTML = `
                <a href="#profile" style="background: #8C2B1B; color: white;">
                    👤 ${user.nickname}
                </a>
                <a href="javascript:void(0)" id="authLogoutLink" style="background: #666; color: white;">
                    登出
                </a>
            `;
            
            // 绑定登出事件
            const logoutLink = document.getElementById('authLogoutLink');
            if (logoutLink) {
                logoutLink.addEventListener('click', handleLogout);
            }
        } else {
            authNav.innerHTML = `
                <a href="javascript:void(0)" id="authLoginLink" style="background: #d4af37; color: #1A120B;">
                    👤 登录/注册
                </a>
            `;
            
            // 绑定登录事件
            const loginLink = document.getElementById('authLoginLink');
            if (loginLink) {
                loginLink.addEventListener('click', openModal);
            }
        }
    }
    
    /**
     * 显示通知
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#8C2B1B';
        
        notification.style.cssText = `
            position: fixed; 
            top: 100px; 
            right: 20px; 
            background: ${bgColor}; 
            color: white; 
            padding: 15px 25px; 
            border-radius: 8px; 
            z-index: 3000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3); 
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }
    
    /**
     * 触发认证事件
     */
    function dispatchAuthEvent(eventType, user = null) {
        const event = new CustomEvent('authChange', {
            detail: {
                type: eventType,
                user: user
            }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * 获取当前用户
     */
    function getCurrentUser() {
        return currentUser;
    }
    
    /**
     * 获取认证令牌
     */
    function getAuthToken() {
        return authToken;
    }
    
    /**
     * 检查是否已登录
     */
    function isLoggedIn() {
        return !!authToken && !!currentUser;
    }
    
    // 暴露公共API
    return {
        init: init,
        openModal: openModal,
        closeModal: closeModal,
        showLoginForm: showLoginForm,
        showRegisterForm: showRegisterForm,
        handleLogin: handleLogin,
        handleRegister: handleRegister,
        handleLogout: handleLogout,
        getCurrentUser: getCurrentUser,
        getAuthToken: getAuthToken,
        isLoggedIn: isLoggedIn,
        updateUserNav: updateUserNav
    };
})();

// 页面加载完成后初始化认证模块
document.addEventListener('DOMContentLoaded', () => {
    AuthModule.init();
});