/**
 * API服务模块 - 统一API调用封装
 * 使用方式：ApiService.get('/api/tasks'), ApiService.post('/api/login', data)
 */
const ApiService = (function() {
    // 基础URL配置
    const BASE_URL = 'http://localhost:8080/api';
    
    // 获取认证Token
    function getAuthToken() {
        return localStorage.getItem('tavern_token');
    }
    
    // 创建请求配置
    function createRequestConfig(method, data = null) {
        const config = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        };
        
        // 添加Token
        const token = getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // 添加请求体
        if (data) {
            config.body = JSON.stringify(data);
        }
        
        return config;
    }
    
    // 处理响应
    async function handleResponse(response) {
        const result = await response.json();
        
        if (!response.ok) {
            // 处理Token过期
            if (result.code === 401 || response.status === 401) {
                localStorage.removeItem('tavern_token');
                window.dispatchEvent(new CustomEvent('authChange', { detail: { type: 'logout' } }));
            }
            throw new Error(result.message || '请求失败');
        }
        
        return result;
    }
    
    /**
     * GET请求
     */
    async function get(url, params = {}) {
        // 构建查询参数
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${BASE_URL}${url}?${queryString}` : `${BASE_URL}${url}`;
        
        const config = createRequestConfig('GET');
        const response = await fetch(fullUrl, config);
        return handleResponse(response);
    }
    
    /**
     * POST请求
     */
    async function post(url, data = {}) {
        const config = createRequestConfig('POST', data);
        const response = await fetch(`${BASE_URL}${url}`, config);
        return handleResponse(response);
    }
    
    /**
     * PUT请求
     */
    async function put(url, data = {}) {
        const config = createRequestConfig('PUT', data);
        const response = await fetch(`${BASE_URL}${url}`, config);
        return handleResponse(response);
    }
    
    /**
     * DELETE请求
     */
    async function del(url) {
        const config = createRequestConfig('DELETE');
        const response = await fetch(`${BASE_URL}${url}`, config);
        return handleResponse(response);
    }
    
    // ==================== 认证相关API ====================
    
    /**
     * 用户登录
     */
    async function login(username, password) {
        return post('/auth/login', { username, password });
    }
    
    /**
     * 用户注册
     */
    async function register(username, password, nickname, email) {
        return post('/auth/register', { username, password, nickname, email });
    }
    
    /**
     * 获取当前用户信息
     */
    async function getCurrentUser() {
        return get('/users/me');
    }
    
    /**
     * 更新用户信息
     */
    async function updateUser(data) {
        return put('/users/me', data);
    }
    
    // ==================== 任务相关API ====================
    
    /**
     * 获取任务列表
     */
    async function getTasks(params = {}) {
        return get('/tasks', params);
    }
    
    /**
     * 获取任务详情
     */
    async function getTask(id) {
        return get(`/tasks/${id}`);
    }
    
    /**
     * 创建任务
     */
    async function createTask(data) {
        return post('/tasks', data);
    }
    
    /**
     * 更新任务
     */
    async function updateTask(id, data) {
        return put(`/tasks/${id}`, data);
    }
    
    /**
     * 删除任务
     */
    async function deleteTask(id) {
        return del(`/tasks/${id}`);
    }
    
    /**
     * 领取任务
     */
    async function claimTask(id) {
        return post(`/tasks/${id}/claim`);
    }
    
    /**
     * 完成任务
     */
    async function completeTask(id, data = {}) {
        return post(`/tasks/${id}/complete`, data);
    }
    
    // ==================== 法器相关API ====================
    
    /**
     * 获取法器列表
     */
    async function getGears(params = {}) {
        return get('/gears', params);
    }
    
    /**
     * 获取法器详情
     */
    async function getGear(id) {
        return get(`/gears/${id}`);
    }
    
    /**
     * 创建法器
     */
    async function createGear(data) {
        return post('/gears', data);
    }
    
    /**
     * 更新法器
     */
    async function updateGear(id, data) {
        return put(`/gears/${id}`, data);
    }
    
    /**
     * 删除法器
     */
    async function deleteGear(id) {
        return del(`/gears/${id}`);
    }
    
    // ==================== 成就相关API ====================
    
    /**
     * 获取成就列表
     */
    async function getAchievements(params = {}) {
        return get('/achievements', params);
    }
    
    /**
     * 获取成就详情
     */
    async function getAchievement(id) {
        return get(`/achievements/${id}`);
    }
    
    /**
     * 获取用户成就
     */
    async function getUserAchievements(userId) {
        return get(`/users/${userId}/achievements`);
    }
    
    // ==================== 声望相关API ====================
    
    /**
     * 获取声望信息
     */
    async function getPrestige(userId) {
        return get(`/users/${userId}/prestige`);
    }
    
    /**
     * 增加声望
     */
    async function addPrestige(userId, amount) {
        return post(`/users/${userId}/prestige`, { amount });
    }
    
    // ==================== 消息通知API ====================
    
    /**
     * 获取通知列表
     */
    async function getNotifications(params = {}) {
        return get('/notifications', params);
    }
    
    /**
     * 标记通知为已读
     */
    async function markNotificationAsRead(id) {
        return put(`/notifications/${id}/read`);
    }
    
    /**
     * 删除通知
     */
    async function deleteNotification(id) {
        return del(`/notifications/${id}`);
    }
    
    // 暴露公共API
    return {
        // 通用方法
        get,
        post,
        put,
        delete: del,
        
        // 认证
        login,
        register,
        getCurrentUser,
        updateUser,
        
        // 任务
        getTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        claimTask,
        completeTask,
        
        // 法器
        getGears,
        getGear,
        createGear,
        updateGear,
        deleteGear,
        
        // 成就
        getAchievements,
        getAchievement,
        getUserAchievements,
        
        // 声望
        getPrestige,
        addPrestige,
        
        // 通知
        getNotifications,
        markNotificationAsRead,
        deleteNotification,
        
        // 配置
        BASE_URL,
        getAuthToken
    };
})();

export default ApiService;