
INSERT INTO user (username, password, nickname, email, phone, status) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '管理员', 'admin@example.com', '13800138000', 1),
('user1', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '用户1', 'user1@example.com', '13800138001', 1),
('user2', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '用户2', 'user2@example.com', '13800138002', 1);

INSERT INTO task (title, description, category, status, priority, reward, location, deadline, publisher_id, max_participants, requirements, delivery_requirements) VALUES
('品牌发布会筹备', '下周末活动，需执行3场以上发布会。', '活动', 'pending', 'high', 1800.00, '上海市浦东新区', '2024-12-20 23:59:59', 1, 5, '有活动策划经验优先', '提交活动策划方案'),
('活动花絮剪辑', '3小时活动素材，需出10分钟精华版。', '视频', 'pending', 'medium', 800.00, '线上', '2024-12-18 23:59:59', 1, 2, '熟练使用PR/AE', '提交剪辑好的视频文件'),
('纪录片导演外采', '拍摄选题收集、脚本撰写、3组镜头画面。', '拍摄', 'in_progress', 'high', 3500.00, '杭州市西湖区', '2024-12-25 23:59:59', 2, 3, '有纪录片拍摄经验', '提交拍摄素材和粗剪'),
('剧本审阅服务', '审阅30分钟短片剧本，提出修改意见。', '文案', 'completed', 'low', 500.00, '线上', '2024-12-15 23:59:59', 2, 1, '有剧本创作经验', '提交详细修改意见');

INSERT INTO task_participant (task_id, user_id, role, status, applied_at, confirmed_at) VALUES
(1, 2, '策划', 'confirmed', '2024-12-10 10:00:00', '2024-12-10 11:00:00'),
(1, 3, '执行', 'applied', '2024-12-10 12:00:00', NULL),
(3, 3, '摄像', 'confirmed', '2024-12-11 09:00:00', '2024-12-11 10:00:00');

INSERT INTO task_comment (task_id, user_id, content, parent_id) VALUES
(1, 2, '这个活动很感兴趣，期待参与！', NULL),
(1, 3, '请问需要准备什么材料？', 1),
(1, 1, '准备个人简历和相关作品集即可', 2),
(2, 3, '视频格式有要求吗？', NULL);
