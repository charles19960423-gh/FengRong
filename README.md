# 枫榕赏金酒馆 - 传媒江湖补给站

## 项目简介

枫榕赏金酒馆是一个传媒江湖补给站管理系统，融合武侠风格的现代任务管理平台。项目代号 FR（FengRong），旨在为传媒从业者提供一个有趣的任务委托与接单平台。

## 项目结构

```
FR-GIT/
├── frontend/          # 前端文件
│   └── FR-index.html  # 单页应用主文件
├── backend/           # 后端服务 (Spring Boot)
│   ├── src/          # Java 源代码
│   └── pom.xml       # Maven 配置
├── database/         # 数据库脚本
│   └── FR SQL/       # SQL 脚本文件夹
├── .gitignore        # Git 忽略配置
└── README.md         # 项目说明文档
```

## 技术栈

### 前端
- HTML5 + CSS3 + JavaScript
- Supabase (后端即服务)
- 响应式设计

### 后端
- Spring Boot 2.7+
- MyBatis Plus
- MySQL
- JWT 认证

### 数据库
- MySQL 8.0+

## 功能模块

### 用户系统
- 用户注册与登录
- JWT Token 认证
- 权限管理

### 任务系统
- 发布赏金任务
- 接单与完成任务
- 任务评论与参与

### 装备系统
- 法器背包
- 装备槽位（武器、护甲、饰品）
- 装备/卸下功能

### 成就系统
- 任务成就解锁
- 声望等级

## 快速开始

### 前端运行
1. 直接在浏览器中打开 `frontend/FR-index.html`
2. 或使用本地服务器：`npx serve frontend`

### 后端运行
1. 确保已安装 Maven 和 JDK 11+
2. 进入 `backend` 目录
3. 执行 `mvn spring-boot:run`

### 数据库配置
1. 创建 MySQL 数据库
2. 执行 `database/FR SQL/tavern_database.sql` 初始化表结构
3. 修改 `backend/src/main/resources/application.yml` 中的数据库配置

## 开发团队

- 林峰系统论 V3.1
- 枫榕管理平台

## 版本历史

- V0.2 - 当前版本
  - 背包装备系统
  - JWT 认证
  - 任务管理功能

## 许可证

私有项目 - 仅供内部使用
