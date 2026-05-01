import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTeamStore = defineStore('team', () => {
  const STORAGE_KEY = 'fr_team_data'

  const projects = ref([])
  const teamMembers = ref([])
  const applications = ref([])

  const roleCategories = {
    producer: { icon: '🎬', label: '制片' },
    director: { icon: '🎥', label: '导演' },
    writer: { icon: '✍️', label: '编剧' },
    camera: { icon: '📷', label: '摄影' },
    actor: { icon: '🎭', label: '演员' },
    editor: { icon: '✂️', label: '剪辑' },
    sound: { icon: '🔊', label: '音效' },
    art: { icon: '🎨', label: '美术' },
    makeup: { icon: '💄', label: '化妆' },
    lighting: { icon: '💡', label: '灯光' },
    assistant: { icon: '👩‍💼', label: '助理' },
    other: { icon: '📋', label: '其他' }
  }

  const projectStatuses = {
    recruiting: { icon: '🔍', label: '招募中', color: '#10b981' },
    'in-progress': { icon: '🚀', label: '进行中', color: '#3b82f6' },
    completed: { icon: '✅', label: '已完成', color: '#6b7280' },
    cancelled: { icon: '❌', label: '已取消', color: '#ef4444' }
  }

  const mockProjects = [
    {
      id: 'proj-001',
      title: '武侠微电影《剑心》',
      description: '一部讲述江湖剑客追寻剑道真谛的微电影作品，诚邀各路高手共同创作！',
      budget: '💰 5万',
      location: '横店影视城',
      deadline: '2024-12-31',
      status: 'recruiting',
      creatorId: '13800138001',
      creatorName: '馆主大人',
      requiredRoles: [
        { role: 'director', count: 1, filled: 0 },
        { role: 'writer', count: 1, filled: 1 },
        { role: 'camera', count: 2, filled: 1 },
        { role: 'actor', count: 3, filled: 1 },
        { role: 'editor', count: 1, filled: 0 },
        { role: 'sound', count: 1, filled: 0 }
      ],
      members: [
        { userId: '13800138001', nickname: '馆主大人', role: 'producer' },
        { userId: '13800138002', nickname: '江湖少侠', role: 'writer' },
        { userId: '13800138003', nickname: '光影大师', role: 'camera' },
        { userId: '13800138004', nickname: '戏如人生', role: 'actor' }
      ],
      createdAt: '2024-12-01',
      tags: ['武侠', '微电影', '剧情']
    },
    {
      id: 'proj-002',
      title: '新媒体短视频系列',
      description: '打造垂直领域优质短视频内容，涵盖影视行业幕后故事、技术分享等。',
      budget: '💰 2万',
      location: '线上',
      deadline: '2025-01-15',
      status: 'recruiting',
      creatorId: '13800138002',
      creatorName: '江湖少侠',
      requiredRoles: [
        { role: 'camera', count: 1, filled: 1 },
        { role: 'editor', count: 2, filled: 1 },
        { role: 'writer', count: 2, filled: 0 },
        { role: 'actor', count: 2, filled: 1 }
      ],
      members: [
        { userId: '13800138002', nickname: '江湖少侠', role: 'producer' },
        { userId: '13800138005', nickname: '快手小王', role: 'camera' },
        { userId: '13800138006', nickname: '剪辑狂人', role: 'editor' },
        { userId: '13800138007', nickname: '网红小李', role: 'actor' }
      ],
      createdAt: '2024-12-10',
      tags: ['短视频', '新媒体', '内容创作']
    },
    {
      id: 'proj-003',
      title: '纪录片《光影背后》',
      description: '记录影视从业者的真实工作状态，展现电影制作的艰辛与魅力。',
      budget: '💰 10万',
      location: '北京/上海',
      deadline: '2025-03-01',
      status: 'in-progress',
      creatorId: '13800138003',
      creatorName: '光影大师',
      requiredRoles: [
        { role: 'director', count: 1, filled: 1 },
        { role: 'camera', count: 3, filled: 3 },
        { role: 'sound', count: 2, filled: 2 },
        { role: 'editor', count: 2, filled: 1 },
        { role: 'lighting', count: 2, filled: 2 }
      ],
      members: [
        { userId: '13800138003', nickname: '光影大师', role: 'director' },
        { userId: '13800138008', nickname: '镜头老王', role: 'camera' },
        { userId: '13800138009', nickname: '摄影小张', role: 'camera' },
        { userId: '13800138010', nickname: '录音师阿强', role: 'sound' }
      ],
      createdAt: '2024-11-01',
      tags: ['纪录片', '影视幕后', '人文']
    },
    {
      id: 'proj-004',
      title: '网剧《客栈夜话》',
      description: '古风悬疑网剧，讲述一家神秘客栈中发生的离奇故事。',
      budget: '💰 50万',
      location: '象山影视城',
      deadline: '2025-06-01',
      status: 'recruiting',
      creatorId: '13800138004',
      creatorName: '戏如人生',
      requiredRoles: [
        { role: 'director', count: 1, filled: 0 },
        { role: 'writer', count: 2, filled: 1 },
        { role: 'actor', count: 5, filled: 2 },
        { role: 'art', count: 2, filled: 1 },
        { role: 'makeup', count: 3, filled: 1 },
        { role: 'lighting', count: 2, filled: 0 },
        { role: 'camera', count: 3, filled: 1 }
      ],
      members: [
        { userId: '13800138004', nickname: '戏如人生', role: 'producer' },
        { userId: '13800138011', nickname: '编剧老陈', role: 'writer' },
        { userId: '13800138012', nickname: '古装小花', role: 'actor' },
        { userId: '13800138013', nickname: '实力派阿杰', role: 'actor' }
      ],
      createdAt: '2024-12-15',
      tags: ['网剧', '悬疑', '古装']
    },
    {
      id: 'proj-005',
      title: '广告宣传片制作',
      description: '为知名品牌打造年度品牌宣传片，展现品牌理念与产品特色。',
      budget: '💰 20万',
      location: '上海',
      deadline: '2024-12-25',
      status: 'completed',
      creatorId: '13800138005',
      creatorName: '快手小王',
      requiredRoles: [
        { role: 'director', count: 1, filled: 1 },
        { role: 'camera', count: 2, filled: 2 },
        { role: 'editor', count: 1, filled: 1 },
        { role: 'sound', count: 1, filled: 1 },
        { role: 'lighting', count: 2, filled: 2 }
      ],
      members: [
        { userId: '13800138005', nickname: '快手小王', role: 'producer' },
        { userId: '13800138014', nickname: '广告导演', role: 'director' },
        { userId: '13800138015', nickname: '商业摄影师', role: 'camera' }
      ],
      createdAt: '2024-11-20',
      tags: ['广告', '商业片', '品牌']
    }
  ]

  const teamStats = computed(() => ({
    total: projects.value.length,
    recruiting: projects.value.filter(p => p.status === 'recruiting').length,
    inProgress: projects.value.filter(p => p.status === 'in-progress').length,
    completed: projects.value.filter(p => p.status === 'completed').length
  }))

  function calculateProjectProgress(projectId) {
    const project = getProjectById(projectId)
    if (!project || !project.requiredRoles || project.requiredRoles.length === 0) return 0
    
    const totalRoles = project.requiredRoles.reduce((sum, r) => sum + r.count, 0)
    const filledRoles = project.requiredRoles.reduce((sum, r) => sum + r.filled, 0)
    
    return Math.round((filledRoles / totalRoles) * 100)
  }

  function calculateRoleMatch(project, userSkills) {
    if (!project || !project.requiredRoles || !userSkills || userSkills.length === 0) {
      return { score: 0, matchedRoles: [], unmatchedRoles: [] }
    }
    
    const unmatchedRoles = []
    const matchedRoles = []
    let totalScore = 0
    let maxScore = 0
    
    project.requiredRoles.forEach(role => {
      maxScore += role.count * 100
      const matched = userSkills.some(skill => skill === role.role)
      if (matched) {
        matchedRoles.push(role)
        totalScore += role.count * 100
      } else {
        unmatchedRoles.push(role)
      }
    })
    
    return {
      score: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
      matchedRoles,
      unmatchedRoles
    }
  }

  function getMemberRole(projectId, userId) {
    const project = getProjectById(projectId)
    if (!project) return null
    const member = project.members.find(m => m.userId === userId)
    return member ? member.role : null
  }

  function isProjectMember(projectId, userId) {
    const project = getProjectById(projectId)
    if (!project) return false
    return project.members.some(m => m.userId === userId)
  }

  function getMembersByRole(projectId, role) {
    const project = getProjectById(projectId)
    if (!project) return []
    return project.members.filter(m => m.role === role)
  }

  function loadTeams() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        projects.value = data.projects || []
        teamMembers.value = data.teamMembers || []
        applications.value = data.applications || []
      } else {
        projects.value = [...mockProjects]
        teamMembers.value = []
        applications.value = []
        saveTeams()
      }
    } catch {
      projects.value = [...mockProjects]
      teamMembers.value = []
      applications.value = []
    }
  }

  function saveTeams() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      projects: projects.value,
      teamMembers: teamMembers.value,
      applications: applications.value
    }))
  }

  function getProjects() {
    return projects.value
  }

  function getProjectById(projectId) {
    return projects.value.find(p => p.id === projectId) || null
  }

  function getMyProjects(userId) {
    return projects.value.filter(p =>
      p.creatorId === userId || p.members.some(m => m.userId === userId)
    )
  }

  function createProject(data) {
    const newProject = {
      id: 'proj-' + Date.now(),
      title: data.title,
      description: data.description || '',
      budget: data.budget || '💰 面议',
      location: data.location || '线上',
      deadline: data.deadline || '',
      status: 'recruiting',
      creatorId: data.creatorId,
      creatorName: data.creatorName,
      requiredRoles: data.requiredRoles || [],
      members: [{ userId: data.creatorId, nickname: data.creatorName, role: 'producer' }],
      createdAt: new Date().toISOString().split('T')[0],
      tags: data.tags || []
    }
    projects.value.unshift(newProject)
    saveTeams()
    return newProject
  }

  function applyForRole(projectId, userId, userName, role) {
    const project = getProjectById(projectId)
    if (!project) return { success: false, message: '项目不存在' }
    if (project.status !== 'recruiting') return { success: false, message: '项目不在招募中' }

    const roleReq = project.requiredRoles.find(r => r.role === role)
    if (!roleReq) return { success: false, message: '该角色不存在' }
    if (roleReq.filled >= roleReq.count) return { success: false, message: '该角色已满' }

    const existingMember = project.members.find(m => m.userId === userId)
    if (existingMember) return { success: false, message: '你已加入该项目' }

    project.members.push({ userId, nickname: userName, role })
    roleReq.filled++

    applications.value.push({
      id: 'app-' + Date.now(),
      projectId,
      userId,
      userName,
      role,
      status: 'confirmed',
      appliedAt: new Date().toISOString().split('T')[0]
    })

    saveTeams()
    return { success: true, project }
  }

  function leaveProject(projectId, userId) {
    const project = getProjectById(projectId)
    if (!project) return { success: false, message: '项目不存在' }

    const memberIndex = project.members.findIndex(m => m.userId === userId)
    if (memberIndex === -1) return { success: false, message: '你不在该项目中' }

    const member = project.members[memberIndex]
    project.members.splice(memberIndex, 1)

    const roleReq = project.requiredRoles.find(r => r.role === member.role)
    if (roleReq && roleReq.filled > 0) {
      roleReq.filled--
    }

    saveTeams()
    return { success: true }
  }

  function updateProject(projectId, updates) {
    const project = getProjectById(projectId)
    if (!project) return { success: false, message: '项目不存在' }

    Object.assign(project, updates)
    saveTeams()
    return { success: true, project }
  }

  function getAvailableRoles(projectId) {
    const project = getProjectById(projectId)
    if (!project) return []
    return project.requiredRoles.filter(r => r.filled < r.count)
  }

  function acceptApplication(projectId, userId) {
    return { success: true }
  }

  function rejectApplication(projectId, userId) {
    return { success: true }
  }

  return {
    projects,
    teamProjects: projects,
    teamMembers,
    applications,
    roleCategories,
    projectStatuses,
    teamStats,
    loadTeams,
    saveTeams,
    getProjects,
    getProjectById,
    getTeamProjectById: getProjectById,
    getMyProjects,
    createProject,
    createTeamProject: createProject,
    applyForRole,
    applyForProject: applyForRole,
    leaveProject,
    updateProject,
    getAvailableRoles,
    acceptApplication,
    rejectApplication,
    calculateProjectProgress,
    calculateRoleMatch,
    getMemberRole,
    isProjectMember,
    getMembersByRole
  }
})
