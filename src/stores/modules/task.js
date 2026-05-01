import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const STORAGE_KEY = 'fr_task_history'
  const DRAFT_STORAGE_KEY = 'fr_task_drafts'
  const MILESTONE_STORAGE_KEY = 'fr_milestones'
  const FAVORITE_STORAGE_KEY = 'fr_task_favorites'

  const tasks = ref([])
  const drafts = ref([])
  const milestones = ref([])
  const favorites = ref([])

  const taskCycles = {
    'annual': { label: '年度', icon: '📅', color: '#f59e0b' },
    'quarterly': { label: '季度', icon: '🗓️', color: '#3b82f6' },
    'monthly': { label: '月度', icon: '📆', color: '#10b981' },
    'one-time': { label: '一次性', icon: '⚡', color: '#8b5cf6' }
  }

  const taskCategories = {
    'combat': { label: '战斗', icon: '⚔️', color: '#ef4444' },
    'exploration': { label: '探索', icon: '🗺️', color: '#3b82f6' },
    'gathering': { label: '采集', icon: '🌿', color: '#10b981' },
    'delivery': { label: '护送', icon: '🚚', color: '#f59e0b' },
    'crafting': { label: '制作', icon: '🔧', color: '#8b5cf6' },
    'quest': { label: '剧情', icon: '📜', color: '#ec4899' },
    'daily': { label: '日常', icon: '☀️', color: '#06b6d4' },
    'event': { label: '活动', icon: '🎉', color: '#f97316' }
  }

  const difficultyLevels = {
    'easy': { label: '简单', color: '#10b981', stars: 1 },
    'medium': { label: '中等', color: '#f59e0b', stars: 2 },
    'hard': { label: '困难', color: '#ef4444', stars: 3 },
    'epic': { label: '史诗', color: '#8b5cf6', stars: 4 }
  }

  const mockTasks = [
    {
      id: 'task-001',
      title: '收集神秘符文',
      status: 'in-progress',
      statusText: '进行中',
      reward: '💰 3,500',
      deadline: '2024-12-20',
      progress: 65,
      description: '前往古老遗迹收集散落的神秘符文碎片，共需收集7枚。',
      location: '迷雾森林',
      createdAt: '2024-12-01',
      requiredIdentity: 'mage',
      difficulty: 'medium',
      successRate: 0.8,
      publisherId: '13800138001',
      publisherName: '馆主大人',
      cycle: 'one-time',
      parentId: null
    },
    {
      id: 'task-002',
      title: '护送商人',
      status: 'completed',
      statusText: '已完成',
      reward: '+200 声望',
      completedAt: '2024-12-15',
      progress: 100,
      description: '成功将商人安全护送到边境城市。',
      location: '晨曦镇 → 边境要塞',
      createdAt: '2024-12-10',
      requiredIdentity: 'warrior',
      difficulty: 'easy',
      successRate: 0.9,
      publisherId: '13800138001',
      publisherName: '馆主大人',
      cycle: 'one-time',
      parentId: null
    },
    {
      id: 'task-003',
      title: '帮助村民收割',
      status: 'completed',
      statusText: '已完成',
      reward: '淡水珍珠',
      completedAt: '2024-12-10',
      progress: 100,
      description: '帮助丰收村村民完成秋季收割。',
      location: '丰收村',
      createdAt: '2024-12-05',
      requiredIdentity: null,
      difficulty: 'easy',
      successRate: 0.95,
      publisherId: '13800138002',
      publisherName: '江湖少侠',
      cycle: 'monthly',
      parentId: 'milestone-2024-annual'
    },
    {
      id: 'task-004',
      title: '护送珍贵货物',
      status: 'cancelled',
      statusText: '已取消',
      reward: '-',
      cancelledAt: '2024-12-08',
      reason: '天气原因取消',
      description: '原定护送一批珍贵货物前往雪山驿站。',
      location: '雪山山脉',
      createdAt: '2024-12-06',
      requiredIdentity: 'merchant',
      difficulty: 'hard',
      successRate: 0.7,
      publisherId: '13800138002',
      publisherName: '江湖少侠',
      cycle: 'one-time',
      parentId: null
    },
    {
      id: 'task-005',
      title: '清除山贼据点',
      status: 'in-progress',
      statusText: '进行中',
      reward: '⚔️ 精良武器',
      deadline: '2024-12-25',
      progress: 40,
      description: '协助城镇守卫清除盘踞在山道的山贼据点。',
      location: '黑石山道',
      createdAt: '2024-12-12',
      requiredIdentity: 'warrior',
      difficulty: 'hard',
      successRate: 0.75,
      publisherId: '13800138003',
      publisherName: '神秘刺客',
      cycle: 'quarterly',
      parentId: null
    },
    {
      id: 'task-006',
      title: '草药采集',
      status: 'pending',
      statusText: '待接取',
      reward: '💰 5,000',
      deadline: '2024-12-30',
      progress: 0,
      description: '前往草药谷采集10株珍稀草药。',
      location: '草药谷',
      createdAt: '2024-12-18',
      requiredIdentity: 'healer',
      difficulty: 'easy',
      successRate: 0.9,
      publisherId: '13800138001',
      publisherName: '馆主大人',
      cycle: 'one-time',
      parentId: null
    }
  ]

  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        tasks.value = JSON.parse(stored)
      } else {
        tasks.value = [...mockTasks]
        saveTasks()
      }
      loadMilestones()
    } catch {
      tasks.value = [...mockTasks]
      loadMilestones()
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value))
  }

  function loadFavorites() {
    try {
      const stored = localStorage.getItem(FAVORITE_STORAGE_KEY)
      if (stored) {
        favorites.value = JSON.parse(stored)
      } else {
        favorites.value = []
      }
    } catch {
      favorites.value = []
    }
  }

  function saveFavorites() {
    localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(favorites.value))
  }

  function toggleFavorite(taskId, userId) {
    const index = favorites.value.findIndex(f => f.taskId === taskId && f.userId === userId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
      return { success: true, isFavorite: false }
    } else {
      favorites.value.push({
        taskId,
        userId,
        createdAt: new Date().toISOString()
      })
      saveFavorites()
      return { success: true, isFavorite: true }
    }
  }

  function isFavorite(taskId, userId) {
    return favorites.value.some(f => f.taskId === taskId && f.userId === userId)
  }

  function getFavoriteTasks(userId) {
    const userFavorites = favorites.value.filter(f => f.userId === userId)
    return tasks.value.filter(t => userFavorites.some(f => f.taskId === t.id))
  }

  function loadDrafts() {
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (stored) {
        drafts.value = JSON.parse(stored)
      } else {
        drafts.value = []
      }
    } catch {
      drafts.value = []
    }
  }

  function saveDrafts() {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts.value))
  }

  function saveDraft(draftData) {
    const existingIndex = drafts.value.findIndex(d => d.id === draftData.id)
    const draft = {
      ...draftData,
      updatedAt: new Date().toISOString()
    }
    
    if (existingIndex !== -1) {
      drafts.value[existingIndex] = draft
    } else {
      drafts.value.unshift(draft)
    }
    
    saveDrafts()
    return draft
  }

  function getDraftsByPublisher(publisherId) {
    return drafts.value.filter(d => d.publisherId === publisherId)
  }

  function getDraftById(draftId) {
    return drafts.value.find(d => d.id === draftId) || null
  }

  function deleteDraft(draftId) {
    const index = drafts.value.findIndex(d => d.id === draftId)
    if (index !== -1) {
      drafts.value.splice(index, 1)
      saveDrafts()
      return true
    }
    return false
  }

  function publishDraft(draftId) {
    const draft = getDraftById(draftId)
    if (!draft) return null
    
    const newTask = addTask({
      title: draft.title,
      description: draft.description,
      location: draft.location,
      deadline: draft.deadline,
      reward: draft.reward,
      rewardType: draft.rewardType,
      rewardAmount: draft.rewardAmount,
      difficulty: draft.difficulty,
      difficultyText: draft.difficultyText,
      cooperationType: draft.cooperationType,
      isUrgent: draft.isUrgent,
      allowShare: draft.allowShare,
      publisherId: draft.publisherId,
      publisherName: draft.publisherName,
      requiredIdentity: draft.requiredIdentity,
      successRate: draft.successRate || 0.8
    })
    
    deleteDraft(draftId)
    return newTask
  }

  const taskStats = computed(() => ({
    total: tasks.value.length,
    inProgress: tasks.value.filter(t => t.status === 'in-progress').length,
    completed: tasks.value.filter(t => t.status === 'completed').length,
    cancelled: tasks.value.filter(t => t.status === 'cancelled').length
  }))

  function getAllTasks() {
    return tasks.value
  }

  function getTaskById(taskId) {
    return tasks.value.find(t => t.id === taskId) || null
  }

  function completeTask(taskId) {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        progress: 100,
        status: 'completed',
        statusText: '已完成',
        completedAt: new Date().toISOString().split('T')[0]
      }
      saveTasks()
      return true
    }
    return false
  }

  function getDaysRemaining(deadline) {
    const today = new Date()
    const endDate = new Date(deadline)
    const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
    return diff > 0 ? `${diff}天` : '已过期'
  }

  function formatDate(date) {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function getStreakDays() {
    const completedTasks = tasks.value
      .filter(t => t.status === 'completed' && t.completedAt)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    
    if (completedTasks.length === 0) return 0
    
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = formatDate(today)
    
    let checkDate = new Date(today)
    
    for (const task of completedTasks) {
      const taskDateStr = task.completedAt
      if (taskDateStr === formatDate(checkDate)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (streak === 0) {
        checkDate.setDate(checkDate.getDate() - 1)
        if (taskDateStr === formatDate(checkDate)) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        }
      } else {
        break
      }
    }
    
    return streak
  }

  function getCompletedTasksByDate(dateStr) {
    return tasks.value.filter(t => t.status === 'completed' && t.completedAt === dateStr)
  }

  function getTodayCompletedCount() {
    return getCompletedTasksByDate(formatDate(new Date())).length
  }

  function getWeekCompletedCount() {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)
    startOfWeek.setHours(0, 0, 0, 0)
    
    let count = 0
    for (let i = 0; i <= dayOfWeek; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      count += getCompletedTasksByDate(formatDate(d)).length
    }
    return count
  }

  function getMonthCompletedCount() {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0)
    
    return tasks.value.filter(t => {
      if (t.status !== 'completed' || !t.completedAt) return false
      const taskDate = new Date(t.completedAt)
      return taskDate >= startOfMonth && taskDate <= endOfMonth
    }).length
  }

  function addTask(taskData) {
    const newTask = {
      id: 'task-' + Date.now(),
      ...taskData,
      status: 'pending',
      statusText: '待接取',
      progress: 0,
      applicants: [],
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    tasks.value.unshift(newTask)
    saveTasks()
    
    return newTask
  }

  function getPendingTasks() {
    return tasks.value.filter(t => t.status === 'pending')
  }

  function getMyPublishedTasks(publisherId) {
    return tasks.value.filter(t => t.publisherId === publisherId)
  }

  function acceptTask(taskId, userId) {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      const task = tasks.value[index]
      if (task.status === 'pending' && !task.applicants.includes(userId)) {
        tasks.value[index].applicants.push(userId)
        tasks.value[index].status = 'in-progress'
        tasks.value[index].statusText = '进行中'
        tasks.value[index].acceptedAt = new Date().toISOString().split('T')[0]
        tasks.value[index].assignee = userId
        saveTasks()
        return { success: true, message: '任务接取成功' }
      }
    }
    return { success: false, message: '任务接取失败' }
  }

  function cancelAccept(taskId, userId) {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      const task = tasks.value[index]
      if (task.status === 'in-progress' && task.assignee === userId) {
        const applicantIndex = task.applicants.indexOf(userId)
        if (applicantIndex !== -1) {
          task.applicants.splice(applicantIndex, 1)
        }
        tasks.value[index].status = 'pending'
        tasks.value[index].statusText = '待接取'
        tasks.value[index].assignee = null
        tasks.value[index].acceptedAt = null
        saveTasks()
        return { success: true, message: '任务已取消接取' }
      }
    }
    return { success: false, message: '取消接取失败' }
  }

  function cancelTask(taskId, userId) {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      const task = tasks.value[index]
      if (task.publisherId === userId) {
        if (task.status === 'in-progress' && task.applicants.length > 0) {
          return { success: false, message: '任务已有申请人，无法取消' }
        }
        tasks.value[index].status = 'cancelled'
        tasks.value[index].statusText = '已取消'
        tasks.value[index].cancelledAt = new Date().toISOString().split('T')[0]
        saveTasks()
        return { success: true, message: '任务已取消' }
      }
    }
    return { success: false, message: '取消失败，你不是任务发布者' }
  }

  function getAcceptedTasks(userId) {
    return tasks.value.filter(t => t.status === 'in-progress' && t.assignee === userId)
  }

  function getTasksByAssignee(userId) {
    return tasks.value.filter(t => t.assignee === userId)
  }

  function rollDice(successRate) {
    return Math.random() < successRate
  }

  function canEditTask(task, user) {
    if (!user) return { canEdit: false, reason: '请先登录' }
    if (task.publisherId !== user.phone) return { canEdit: false, reason: '只能编辑自己发布的任务' }
    
    if (task.status === 'completed' || task.status === 'cancelled') {
      return { canEdit: false, reason: '任务已结束，无法编辑' }
    }
    
    const hasApplicants = task.applicants && task.applicants.length > 0
    const userVipLevel = user.vipLevel || 1
    
    if (!hasApplicants) {
      return { canEdit: true, editableFields: ['all'] }
    }
    
    if (userVipLevel >= 3) {
      return { canEdit: true, editableFields: ['all'] }
    }
    
    const editableFields = ['isUrgent', 'description']
    return { canEdit: true, editableFields, reason: '有人报名后，普通用户只能修改紧急状态和描述' }
  }

  function updateTask(taskId, updates, user) {
    const task = getTaskById(taskId)
    if (!task) return { success: false, message: '任务不存在' }
    
    const editCheck = canEditTask(task, user)
    if (!editCheck.canEdit) {
      return { success: false, message: editCheck.reason }
    }
    
    const canEditAll = editCheck.editableFields.includes('all')
    const filteredUpdates = {}
    
    Object.keys(updates).forEach(key => {
      if (canEditAll || editCheck.editableFields.includes(key)) {
        filteredUpdates[key] = updates[key]
      }
    })
    
    if (Object.keys(filteredUpdates).length === 0) {
      return { success: false, message: '没有可编辑的字段' }
    }
    
    if (!task.editHistory) {
      task.editHistory = []
    }
    
    task.editHistory.push({
      timestamp: new Date().toISOString(),
      editor: user.phone,
      changes: { ...filteredUpdates },
      previousVersion: {
        title: task.title,
        description: task.description,
        reward: task.reward,
        deadline: task.deadline,
        difficulty: task.difficulty,
        requiredIdentity: task.requiredIdentity
      }
    })
    
    Object.assign(task, filteredUpdates)
    saveTasks()
    
    return { success: true, message: '任务更新成功' }
  }

  function getTaskEditHistory(taskId) {
    const task = getTaskById(taskId)
    return task ? (task.editHistory || []) : []
  }

  function loadMilestones() {
    try {
      const stored = localStorage.getItem(MILESTONE_STORAGE_KEY)
      if (stored) {
        milestones.value = JSON.parse(stored)
      } else {
        milestones.value = []
      }
    } catch {
      milestones.value = []
    }
  }

  function saveMilestones() {
    localStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify(milestones.value))
  }

  function getMilestones() {
    return milestones.value
  }

  function getMilestoneById(milestoneId) {
    return milestones.value.find(m => m.id === milestoneId) || null
  }

  function createMilestone(data) {
    const newMilestone = {
      id: 'milestone-' + Date.now(),
      title: data.title,
      description: data.description || '',
      year: data.year || new Date().getFullYear(),
      cycle: data.cycle || 'annual',
      parentMilestoneId: data.parentMilestoneId || null,
      status: 'active',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: data.createdBy
    }
    milestones.value.unshift(newMilestone)
    saveMilestones()
    return newMilestone
  }

  function updateMilestone(milestoneId, updates) {
    const index = milestones.value.findIndex(m => m.id === milestoneId)
    if (index !== -1) {
      milestones.value[index] = { ...milestones.value[index], ...updates }
      saveMilestones()
      return true
    }
    return false
  }

  function getTasksByCycle(cycle) {
    return tasks.value.filter(t => t.cycle === cycle)
  }

  function getSubTasks(parentId) {
    return tasks.value.filter(t => t.parentId === parentId)
  }

  function getAnnualMilestones(year) {
    return milestones.value.filter(m => m.year === year && m.cycle === 'annual')
  }

  function getQuarterlyMilestones(year, quarter) {
    return milestones.value.filter(m => 
      m.year === year && 
      m.cycle === 'quarterly' && 
      m.quarter === quarter
    )
  }

  function getMonthlyMilestones(year, month) {
    return milestones.value.filter(m => 
      m.year === year && 
      m.cycle === 'monthly' && 
      m.month === month
    )
  }

  function calculateMilestoneProgress(milestoneId) {
    const subTasks = getSubTasks(milestoneId)
    if (subTasks.length === 0) return 0
    const completed = subTasks.filter(t => t.status === 'completed').length
    return Math.round((completed / subTasks.length) * 100)
  }

  function createSubTasksFromMilestone(milestoneId, cycle = 'monthly') {
    const milestone = getMilestoneById(milestoneId)
    if (!milestone) return []

    const currentYear = new Date().getFullYear()
    let subTasks = []

    if (cycle === 'monthly') {
      for (let month = 1; month <= 12; month++) {
        const subTask = addTask({
          title: `${milestone.title} - ${month}月`,
          description: `月度子任务: ${milestone.description}`,
          deadline: `${currentYear}-${String(month).padStart(2, '0')}-28`,
          reward: milestone.reward || '💰 1,000',
          difficulty: milestone.difficulty || 'normal',
          cycle: 'monthly',
          parentId: milestoneId,
          publisherId: milestone.createdBy,
          publisherName: milestone.publisherName || '系统',
          requiredIdentity: null,
          successRate: 0.8
        })
        subTasks.push(subTask)
      }
    } else if (cycle === 'quarterly') {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const endMonth = quarter * 3
        const subTask = addTask({
          title: `${milestone.title} - Q${quarter}`,
          description: `季度子任务: ${milestone.description}`,
          deadline: `${currentYear}-${String(endMonth).padStart(2, '0')}-28`,
          reward: milestone.reward || '💰 3,000',
          difficulty: milestone.difficulty || 'good',
          cycle: 'quarterly',
          parentId: milestoneId,
          publisherId: milestone.createdBy,
          publisherName: milestone.publisherName || '系统',
          requiredIdentity: null,
          successRate: 0.8
        })
        subTasks.push(subTask)
      }
    }

    updateMilestone(milestoneId, { progress: calculateMilestoneProgress(milestoneId) })
    return subTasks
  }

  function getCurrentYear() {
    return new Date().getFullYear()
  }

  function getCurrentQuarter() {
    return Math.floor((new Date().getMonth() + 3) / 3)
  }

  function getCurrentMonth() {
    return new Date().getMonth() + 1
  }

  const cycleTaskStats = computed(() => {
    return {
      annual: tasks.value.filter(t => t.cycle === 'annual').length,
      quarterly: tasks.value.filter(t => t.cycle === 'quarterly').length,
      monthly: tasks.value.filter(t => t.cycle === 'monthly').length,
      oneTime: tasks.value.filter(t => t.cycle === 'one-time').length
    }
  })

  const annualProgress = computed(() => {
    const year = getCurrentYear()
    const yearMilestones = milestones.value.filter(m => m.year === year && m.cycle === 'annual')
    if (yearMilestones.length === 0) return 0
    const total = yearMilestones.reduce((sum, m) => sum + (m.progress || 0), 0)
    return Math.round(total / yearMilestones.length)
  })

  const quarterlyProgress = computed(() => {
    const year = getCurrentYear()
    const quarter = getCurrentQuarter()
    const quarterMilestones = milestones.value.filter(m => 
      m.year === year && m.cycle === 'quarterly' && m.quarter === quarter
    )
    if (quarterMilestones.length === 0) return 0
    const total = quarterMilestones.reduce((sum, m) => sum + (m.progress || 0), 0)
    return Math.round(total / quarterMilestones.length)
  })

  const monthlyProgress = computed(() => {
    const year = getCurrentYear()
    const month = getCurrentMonth()
    const monthMilestones = milestones.value.filter(m => 
      m.year === year && m.cycle === 'monthly' && m.month === month
    )
    if (monthMilestones.length === 0) return 0
    const total = monthMilestones.reduce((sum, m) => sum + (m.progress || 0), 0)
    return Math.round(total / monthMilestones.length)
  })

  return {
    tasks,
    drafts,
    milestones,
    favorites,
    taskCycles,
    taskCategories,
    difficultyLevels,
    taskStats,
    cycleTaskStats,
    annualProgress,
    quarterlyProgress,
    monthlyProgress,
    loadTasks,
    saveTasks,
    loadDrafts,
    saveDrafts,
    loadMilestones,
    saveMilestones,
    loadFavorites,
    saveFavorites,
    getAllTasks,
    getTaskById,
    updateTask,
    completeTask,
    getDaysRemaining,
    formatDate,
    getStreakDays,
    getTodayCompletedCount,
    getWeekCompletedCount,
    getMonthCompletedCount,
    addTask,
    getPendingTasks,
    getMyPublishedTasks,
    acceptTask,
    cancelAccept,
    cancelTask,
    getAcceptedTasks,
    getTasksByAssignee,
    rollDice,
    saveDraft,
    getDraftsByPublisher,
    getDraftById,
    deleteDraft,
    publishDraft,
    canEditTask,
    getTaskEditHistory,
    getMilestones,
    getMilestoneById,
    createMilestone,
    updateMilestone,
    getTasksByCycle,
    getSubTasks,
    getAnnualMilestones,
    getQuarterlyMilestones,
    getMonthlyMilestones,
    calculateMilestoneProgress,
    createSubTasksFromMilestone,
    getCurrentYear,
    getCurrentQuarter,
    getCurrentMonth,
    toggleFavorite,
    isFavorite,
    getFavoriteTasks
  }
})
