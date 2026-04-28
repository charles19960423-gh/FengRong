-- ==============================================
-- 枫榕赏金酒馆 - MySQL数据库架构
-- ==============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ==============================================
-- 1. 用户表 (user)
-- ==============================================
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '密码',
    `nickname` VARCHAR(100) COMMENT '昵称',
    `email` VARCHAR(100) COMMENT '邮箱',
    `phone` VARCHAR(20) COMMENT '电话',
    `status` INT DEFAULT 1 COMMENT '状态 1-正常 0-禁用',
    `prestige` INT DEFAULT 2850 COMMENT '声望值',
    `level` VARCHAR(50) DEFAULT '初级猎人' COMMENT '等级',
    `tier` VARCHAR(20) DEFAULT 'bronze' COMMENT '段位',
    `continuous_days` INT DEFAULT 0 COMMENT '连续登录天数',
    `last_login_date` DATETIME COMMENT '最后登录时间',
    `last_active_at` DATETIME COMMENT '最后活跃时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_user_username` (`username`),
    INDEX `idx_user_prestige` (`prestige` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ==============================================
-- 2. 任务表 (task)
-- ==============================================
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '任务ID',
    `title` VARCHAR(255) NOT NULL COMMENT '任务标题',
    `description` TEXT COMMENT '任务描述',
    `category` VARCHAR(50) COMMENT '任务分类',
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态 pending-待接取 in_progress-进行中 completed-已完成 cancelled-已取消',
    `priority` VARCHAR(20) COMMENT '优先级 low-normal-high-紧急',
    `reward` DECIMAL(10,2) COMMENT '奖励金额',
    `location` VARCHAR(255) COMMENT '任务地点',
    `deadline` DATETIME COMMENT '截止时间',
    `start_time` DATETIME COMMENT '开始时间',
    `end_time` DATETIME COMMENT '结束时间',
    `publisher_id` BIGINT COMMENT '发布者ID',
    `max_participants` INT DEFAULT 1 COMMENT '最大参与人数',
    `requirements` TEXT COMMENT '任务要求',
    `delivery_requirements` TEXT COMMENT '交付要求',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_task_status` (`status`),
    INDEX `idx_task_publisher` (`publisher_id`),
    INDEX `idx_task_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';

-- ==============================================
-- 3. 任务评论表 (task_comment)
-- ==============================================
DROP TABLE IF EXISTS `task_comment`;
CREATE TABLE `task_comment` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '评论ID',
    `task_id` BIGINT NOT NULL COMMENT '任务ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `content` TEXT NOT NULL COMMENT '评论内容',
    `parent_id` BIGINT COMMENT '父评论ID 用于回复',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_comment_task` (`task_id`),
    INDEX `idx_comment_user` (`user_id`),
    INDEX `idx_comment_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务评论表';

-- ==============================================
-- 4. 任务参与者表 (task_participant)
-- ==============================================
DROP TABLE IF EXISTS `task_participant`;
CREATE TABLE `task_participant` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '参与者ID',
    `task_id` BIGINT NOT NULL COMMENT '任务ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `role` VARCHAR(50) COMMENT '角色',
    `status` VARCHAR(20) DEFAULT 'applied' COMMENT '状态 applied-已申请 confirmed-已确认 rejected-已拒绝',
    `applied_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
    `confirmed_at` DATETIME COMMENT '确认时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY `uk_task_user` (`task_id`, `user_id`),
    INDEX `idx_participant_task` (`task_id`),
    INDEX `idx_participant_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务参与者表';

-- ==============================================
-- 5. 任务附件表 (task_attachment)
-- ==============================================
DROP TABLE IF EXISTS `task_attachment`;
CREATE TABLE `task_attachment` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '附件ID',
    `task_id` BIGINT NOT NULL COMMENT '任务ID',
    `user_id` BIGINT NOT NULL COMMENT '上传用户ID',
    `file_name` VARCHAR(255) NOT NULL COMMENT '文件名',
    `file_path` VARCHAR(500) NOT NULL COMMENT '文件路径',
    `file_type` VARCHAR(50) COMMENT '文件类型',
    `file_size` BIGINT COMMENT '文件大小',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_attachment_task` (`task_id`),
    INDEX `idx_attachment_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务附件表';

-- ==============================================
-- 初始数据
-- ==============================================
INSERT INTO `user` (`username`, `password`, `email`, `nickname`, `status`, `prestige`, `level`, `tier`) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFFdNJHvGCgTq/VEq', 'admin@example.com', '馆主大人', 1, 9999, '传奇猎人', 'legendary'),
('MAGE.Z.012', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'mage@example.com', '枫榕馆主', 1, 5800, '资深猎人', 'gold'),
('CAM.RED.001', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'cam@example.com', '红隼', 1, 3200, '中坚力量', 'silver'),
('EDIT.WK.002', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'edit@example.com', '剪辑术士', 1, 2100, '初级猎人', 'bronze'),
('DRONE.X.003', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'drone@example.com', '飞影', 1, 1500, '初级猎人', 'bronze');

SET FOREIGN_KEY_CHECKS = 1;