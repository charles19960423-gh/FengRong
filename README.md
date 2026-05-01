# 枫榕赏金酒馆 (FRJG-V1.3) - Vue3 重构版

## 一、项目概述

### 1.1 项目简介

枫榕赏金酒馆是一个基于 Vue3 + Vite 构建的现代化 Web 应用，专注于任务赏金平台的业务场景。该项目采用组件化架构设计，提供任务发布、接单、社交互动、资产管理等核心功能。

### 1.2 技术栈

| 分类 | 技术 | 版本 |
| :--- | :--- | :--- |
| 前端框架 | Vue | ^3.4.21 |
| 状态管理 | Pinia | ^2.1.7 |
| 路由管理 | Vue Router | ^4.3.0 |
| HTTP 客户端 | Axios | ^1.6.7 |
| 构建工具 | Vite | ^5.1.4 |
| 安全工具 | DOMPurify | ^3.0.8 |

### 1.3 功能模块

- **任务系统**：任务发布、接单、审核、交付
- **赏金系统**：赏金任务、报酬结算
- **社交系统**：用户互动、关注、消息
- **资产管理**：钱包、订单、优惠券
- **成就系统**：成就解锁、里程碑
- **装备系统**：装备管理、道具系统
- **团队系统**：团队协作、项目管理

---

## 二、项目组织架构

### 2.1 目录结构

```
FRJG-V1.3/
├── .github/                          # GitHub 配置
│   └── workflows/
│       └── deploy.yml                # CI/CD 部署配置
├── node_modules/                      # Node.js 依赖
├── dist/                             # 生产构建产物
├── temp-gh-pages/                    # GitHub Pages 构建产物
├── src/                              # 源代码
│   ├── components/                   # 组件
│   ├── router/                       # 路由
│   ├── services/                     # 服务层
│   ├── stores/                       # 状态管理
│   ├── utils/                        # 工具函数
│   ├── views/                        # 页面视图
│   ├── styles/                       # 样式
│   ├── App.vue                       # 根组件
│   └── main.js                       # 应用入口
├── .gitignore                        # Git 忽略配置
├── index.html                        # HTML 模板
├── jsconfig.json                     # JS 配置
├── package.json                      # 依赖配置
├── package-lock.json                 # 依赖锁定
└── vite.config.js                    # Vite 配置
```

### 2.2 模块职责

| 模块 | 职责说明 |
| :--- | :--- |
| `components/` | 可复用 UI 组件，分为通用组件和业务组件 |
| `router/` | 路由配置和导航守卫 |
| `services/` | API 接口封装和数据请求 |
| `stores/` | Pinia 状态管理，管理全局状态 |
| `utils/` | 工具函数、安全处理、存储操作 |
| `views/` | 页面级组件，对应路由视图 |
| `styles/` | 全局样式和主题配置 |

---

## 三、核心入口文件

### 3.1 main.js - 应用入口

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

import { useTaskStore } from './stores/task'
import { useAuthStore } from './stores/auth'

app.mount('#app')

// 初始化数据
const taskStore = useTaskStore()
const authStore = useAuthStore()
taskStore.loadTasks()
taskStore.loadDrafts()
authStore.autoLogin()
```

**功能说明**：
- 创建 Vue 应用实例
- 集成 Pinia 状态管理
- 配置 Vue Router
- 加载全局样式
- 初始化任务和认证状态

### 3.2 App.vue - 根组件

```vue
<template>
  <div class="app-container">
    <header-component />
    <nav-component />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer-component />
    <notification-container />
  </div>
</template>
```

**功能说明**：
- 应用整体布局框架
- 包含页头、导航、主内容区、页脚
- 路由视图切换动画
- 通知容器集成

### 3.3 index.html - HTML 模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>枫榕赏金酒馆</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

---

## 四、路由系统

### 4.1 router/index.js

**路由配置说明**：

| 路径 | 名称 | 组件 | 功能描述 |
| :--- | :--- | :--- | :--- |
| `/` | Home | HomeView.vue | 首页 |
| `/achievements` | Achievements | AchievementsView.vue | 成就系统 |
| `/tasks` | Tasks | TasksView.vue | 任务列表 |
| `/workbench` | Workbench | TaskWorkbench.vue | 任务工作台 |
| `/profile` | Profile | ProfileView.vue | 用户档案 |
| `/bounty` | Bounty | BountyView.vue | 赏金任务 |
| `/publish` | Publish | PublishView.vue | 发布任务 |
| `/social` | Social | SocialView.vue | 社交系统 |
| `/wallet` | Wallet | WalletView.vue | 钱包管理 |
| `/equipment` | Equipment | EquipmentView.vue | 装备系统 |
| `/milestone` | Milestone | MilestoneView.vue | 里程碑 |
| `/client-console` | ClientConsole | ClientConsole.vue | 客户控制台 |
| `/resources` | Resources | ResourceView.vue | 资源中心 |
| `/team` | Team | TeamProjectView.vue | 团队项目 |
| `/events` | Events | EventView.vue | 活动中心 |
| `/coupons` | Coupons | CouponView.vue | 优惠券管理 |
| `/notifications` | Notifications | NotificationView.vue | 通知中心 |
| `/orders` | Orders | OrderView.vue | 订单管理 |
| `/favorites` | Favorites | FavoriteView.vue | 收藏管理 |
| `/settings` | Settings | SettingsView.vue | 设置中心 |
| `/support` | Support | SupportView.vue | 帮助支持 |

---

## 五、视图页面

### 5.1 首页模块

| 文件 | 功能描述 |
| :--- | :--- |
| `HomeView.vue` | 首页展示，包含轮播图、热门任务、快速入口 |

### 5.2 任务模块

| 文件 | 功能描述 |
| :--- | :--- |
| `TasksView.vue` | 任务列表页，任务筛选、搜索、分类展示 |
| `TaskWorkbench.vue` | 任务工作台，任务详情、提交、审核流程 |
| `BountyView.vue` | 赏金任务页，高报酬任务展示 |
| `PublishView.vue` | 发布任务页，任务创建表单 |

### 5.3 用户模块

| 文件 | 功能描述 |
| :--- | :--- |
| `ProfileView.vue` | 用户档案页，个人信息、成就展示 |
| `SocialView.vue` | 社交系统，关注、粉丝、互动 |

### 5.4 资产管理模块

| 文件 | 功能描述 |
| :--- | :--- |
| `WalletView.vue` | 钱包管理，余额、交易记录 |
| `OrderView.vue` | 订单管理，订单列表、状态追踪 |
| `CouponView.vue` | 优惠券管理，领取、使用记录 |

### 5.5 游戏化模块

| 文件 | 功能描述 |
| :--- | :--- |
| `EquipmentView.vue` | 装备系统，装备列表、穿戴管理 |
| `AchievementsView.vue` | 成就系统，成就展示、解锁进度 |
| `MilestoneView.vue` | 里程碑，阶段性目标 |

### 5.6 团队模块

| 文件 | 功能描述 |
| :--- | :--- |
| `TeamProjectView.vue` | 团队项目，团队管理、项目协作 |
| `ClientConsole.vue` | 客户控制台，客户管理 |

### 5.7 其他模块

| 文件 | 功能描述 |
| :--- | :--- |
| `ResourceView.vue` | 资源中心，文档、教程 |
| `EventView.vue` | 活动中心，活动列表、报名 |
| `NotificationView.vue` | 通知中心，消息通知 |
| `FavoriteView.vue` | 收藏管理，收藏任务、资源 |
| `SettingsView.vue` | 设置中心，账户设置、偏好 |
| `SupportView.vue` | 帮助支持，FAQ、反馈 |

---

## 六、组件系统

### 6.1 通用组件

| 文件 | 功能描述 |
| :--- | :--- |
| `HeaderComponent.vue` | 页头组件，Logo、搜索、通知入口、用户头像 |
| `NavComponent.vue` | 导航栏组件，主导航菜单 |
| `FooterComponent.vue` | 页脚组件，版权信息、链接 |
| `NotificationContainer.vue` | 通知容器，全局通知展示 |

### 6.2 业务组件

| 文件 | 功能描述 |
| :--- | :--- |
| `AuthModal.vue` | 认证弹窗，登录/注册表单 |

---

## 七、状态管理 (Pinia)

### 7.1 状态模块列表

| 文件 | 管理状态 |
| :--- | :--- |
| `auth.js` | 用户认证状态、登录信息、Token |
| `task.js` | 任务列表、草稿、任务状态 |
| `order.js` | 订单列表、订单状态 |
| `transaction.js` | 交易记录、钱包余额 |
| `equipment.js` | 装备列表、穿戴状态 |
| `achievement.js` | 成就列表、解锁状态 |
| `coupon.js` | 优惠券列表、使用状态 |
| `favorite.js` | 收藏列表 |
| `notification.js` | 通知列表、未读计数 |
| `social.js` | 关注、粉丝、社交关系 |
| `team.js` | 团队信息、成员列表 |
| `event.js` | 活动列表、参与状态 |
| `resource.js` | 资源列表、下载记录 |
| `client.js` | 客户信息、客户管理 |
| `inventory.js` | 库存管理、物品数量 |

### 7.2 状态管理模式

每个 store 遵循统一模式：
- **state**：定义状态数据
- **getters**：计算属性，派生状态
- **actions**：异步操作和状态修改
- **persist**：本地持久化（通过 storage.js）

---

## 八、服务层

### 8.1 services/api.js

**功能说明**：
- Axios 实例封装
- 请求拦截器（Token 注入）
- 响应拦截器（统一错误处理）
- API 接口统一管理

**核心方法**：
- `request(config)` - 通用请求
- `get(url, params)` - GET 请求
- `post(url, data)` - POST 请求
- `put(url, data)` - PUT 请求
- `delete(url)` - DELETE 请求

---

## 九、工具函数

### 9.1 utils/helpers.js

**功能说明**：
- 通用辅助函数
- 格式化工具（日期、金额、文本）
- 验证工具（表单验证）

### 9.2 utils/security.js

**功能说明**：
- 数据加密/解密
- XSS 防护（DOMPurify）
- Token 处理

### 9.3 utils/storage.js

**功能说明**：
- localStorage 封装
- sessionStorage 封装
- 数据序列化/反序列化
- 过期时间管理

---

## 十、样式系统

### 10.1 styles/main.css

**功能说明**：
- 全局样式重置
- CSS 变量定义（主题色、字体、间距）
- 通用类名（布局、间距、颜色）
- 响应式基础样式

---

## 十一、配置文件

### 11.1 vite.config.js

**功能说明**：
- Vite 构建配置
- 开发服务器配置
- 路径别名配置
- 插件配置（Vue、压缩等）

### 11.2 jsconfig.json

**功能说明**：
- JavaScript 配置
- 路径别名映射
- 编译选项

### 11.3 package.json

**脚本命令**：

| 命令 | 功能 |
| :--- | :--- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建产物 |

---

## 十二、开发与部署

### 12.1 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问地址
http://localhost:5173/FengRong/
```

### 12.2 构建部署

```bash
# 生产构建
npm run build

# 产物输出到 dist/ 目录
```

### 12.3 CI/CD

- 通过 GitHub Actions 自动部署
- 配置文件：`.github/workflows/deploy.yml`
- 自动构建并部署到 GitHub Pages

---

## 十三、代码规范

- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Vue 3 风格指南**：组件开发规范
- **Commit 规范**：统一提交信息格式

---

## 十四、项目统计

| 分类 | 数量 |
| :--- | :--- |
| 源代码文件 | 48 个 |
| 页面视图 | 21 个 |
| 状态管理 | 15 个 |
| 组件 | 5 个 |
| 工具函数 | 3 个 |
| 依赖包 | 161 个 |

---

**项目版本**：v1.4  
**最后更新**：2026年5月1日  
**技术栈**：Vue3 + Vite + Pinia + Vue Router