# 枫榕管理平台 v3.1

## 📋 版本说明

这是枫榕管理平台的基础架构优化版本，主要完成了以下工作：

## ✨ 核心改进

### 🔧 技术栈升级
- **数据库**: PostgreSQL → MySQL 8.0
- **容器化**: Docker + Docker Compose
- **Spring Boot**: 3.x → 2.7.18（兼容Java 11）
- **JWT认证**: 完整的认证体系
- **CORS配置**: 跨域访问支持

### 📦 新增功能

#### 后端
- ✅ 统一响应封装（ApiResponse）
- ✅ 全局异常处理
- ✅ 多环境配置（dev/prod）
- ✅ 环境变量支持（.env）
- ✅ Docker容器化
- ✅ JWT认证优化
- ✅ MyBatis-Plus优化

#### 前端
- ✅ 组件化重构
- ✅ API服务封装
- ✅ 工具函数提取
- ✅ Docker容器化
- ✅ Nginx配置

#### 数据库
- ✅ MySQL完整表结构
- ✅ 初始数据脚本
- ✅ 索引优化

## 🚀 快速开始

### 前置要求
- Docker & Docker Compose
- Java 11+
- Maven
- Node.js 16+

### 启动方式

#### 方式1：Docker Compose（推荐）
```bash
docker-compose up -d
```

#### 方式2：本地开发
```bash
# 后端
cd backend
mvn spring-boot:run

# 前端
cd frontend
npm install
npm run dev
```

## 📊 服务地址

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:5173 |
| 后端API | http://localhost:8080 |
| MySQL | localhost:3306 |

## 🔐 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | test123 | 馆主 |

## 📁 项目结构

```
FR-GIT/
├── backend/              # 后端项目
├── frontend/             # 前端项目
├── database/             # 数据库脚本
│   └── mysql/
├── docker-compose.yml    # Docker编排
├── manage-mysql.ps1      # MySQL管理脚本
└── README.md
```

## 📈 版本历史

### v3.1 (2026-04-29)
- ✅ 基础架构优化完成
- ✅ MySQL数据库迁移
- ✅ Docker容器化部署
- ✅ 多环境配置支持
- ✅ 前端模块化重构

## 🔧 技术支持

- MySQL Workbench: 图形化数据库管理
- manage-mysql.ps1: PowerShell管理脚本

## 📝 Git提交

```bash
# 本地已提交，如需推送到远程
git push
```
