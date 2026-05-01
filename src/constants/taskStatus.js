export const TASK_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  REVIEWING: 'reviewing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: { label: '待接单', color: '#f59e0b', icon: '⏳' },
  [TASK_STATUS.ACCEPTED]: { label: '已接单', color: '#3b82f6', icon: '✅' },
  [TASK_STATUS.IN_PROGRESS]: { label: '进行中', color: '#10b981', icon: '🔄' },
  [TASK_STATUS.SUBMITTED]: { label: '已提交', color: '#8b5cf6', icon: '📤' },
  [TASK_STATUS.REVIEWING]: { label: '审核中', color: '#06b6d4', icon: '🔍' },
  [TASK_STATUS.COMPLETED]: { label: '已完成', color: '#10b981', icon: '🎉' },
  [TASK_STATUS.CANCELLED]: { label: '已取消', color: '#6b7280', icon: '❌' },
  [TASK_STATUS.REJECTED]: { label: '已拒绝', color: '#ef4444', icon: '🚫' }
}

export const TASK_CATEGORIES = [
  { id: 'all', name: '全部', icon: '📋' },
  { id: 'video', name: '短视频', icon: '🎬' },
  { id: 'image', name: '摄影', icon: '📸' },
  { id: 'writing', name: '文案', icon: '✍️' },
  { id: 'design', name: '设计', icon: '🎨' },
  { id: 'translation', name: '翻译', icon: '🌍' },
  { id: 'programming', name: '技术开发', icon: '💻' },
  { id: 'marketing', name: '营销推广', icon: '📣' },
  { id: 'consulting', name: '咨询服务', icon: '💡' },
  { id: 'other', name: '其他', icon: '📦' }
]

export const TASK_DIFFICULTY = {
  EASY: { label: '简单', color: '#10b981', value: 1 },
  MEDIUM: { label: '中等', color: '#f59e0b', value: 2 },
  HARD: { label: '困难', color: '#ef4444', value: 3 },
  EXPERT: { label: '专家', color: '#8b5cf6', value: 4 }
}

export const TASK_PRIORITY = {
  LOW: { label: '低', color: '#9ca3af', value: 1 },
  MEDIUM: { label: '中', color: '#f59e0b', value: 2 },
  HIGH: { label: '高', color: '#ef4444', value: 3 },
  URGENT: { label: '紧急', color: '#dc2626', value: 4 }
}
