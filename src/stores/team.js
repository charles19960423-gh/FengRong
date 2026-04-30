import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTeamStore = defineStore('team', () => {
  const STORAGE_KEY = 'fr_team_projects'

  const teamProjects = ref([])

  const projectStatuses = {
    'recruiting': { label: '招募中', icon: '🔍', color: '#f59e0b' },
    'in-progress': { label: '进行中', icon: '🔄', color: '#3b82f6' },
    'completed': { label: '已完成', icon: '✅', color: '#10b981' },
    'cancelled': { label: '已取消', icon: '❌', color: '#6b7280' }
  }

  const roleCategories = {
    'director': { label: '导演', icon: '🎬' },
    'photographer': { label: '摄影', icon: '📷' },
    'editor': { label: '剪辑', icon: '✂️' },
    'planner': { label: '策划', icon: '📋' },
    'mediabuyer': { label: '媒介', icon: '📡' },
    'designer': { label: '设计', icon: '🎨' },
    'writer': { label: '文案', icon: '✍️' },
    'producer': { label: '制片', icon: '🎥' },
    'actor': { label: '演员', icon: '🎭' },
    'other': { label: '其他', icon: '📦' }
  }

  const mockTeamProjects = [
    {
      id: 'team-001',
      title: '品牌微电影项目',
      description: '为某知名消费品牌制作一支5分钟的品牌微电影，需要完整的拍摄制作团队。',
      creatorId: '13800138001',
      creatorName: '馆主大人',
      status: 'recruiting',
      deadline: '2024-06-30',
      budget: '¥50,000 - ¥80,000',
      location: '上海',
      requiredRoles: [
        { role: 'director', count: 1, filled: 0 },
        { role: 'photographer', count: 2, filled: 1 },
        { role: 'editor', count: 1, filled: 0 },
        { role: 'planner', count: 1, filled: 1 }
      ],
      members: [
        { userId: '13800138002', nickname: '江湖游侠', role: 'photographer', status: 'joined' }
      ],
      applications: [
        { userId: '13800138003', nickname: '赏金猎人', appliedRole: 'director', message: '有多年代导演经验', applyTime: '2024-03-10' }
      ],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-10'
    },
    {
      id: 'team-002',
      title: '抖音剧情账号项目',
      description: '打造一个抖音剧情类账号，需要长期合作的演员和剪辑师。',
      creatorId: '13800138002',
      creatorName: '江湖游侠',
      status: 'in-progress',
      deadline: '2024-12-31',
      budget: '¥3,000/月',
      location: '线上',
      requiredRoles: [
        { role: 'actor', count: 2, filled: 2 },
        { role: 'editor', count: 1, filled: 1 }
      ],
      members: [
        { userId: '13800138003', nickname: '赏金猎人', role: 'actor', status: 'joined' },
        { userId: '13800138004', nickname: '新来小兵', role: 'editor', status: 'joined' }
      ],
      applications: [],
      createdAt: '2024-02-15',
      updatedAt: '2024-03-01'
    },
    {
      id: 'team-003',
      title: '产品发布会活动执行',
      description: '3月20日产品发布会，需要活动执行团队，包含摄影、直播、后期等。',
      creatorId: '13800138001',
      creatorName: '馆主大人',
      status: 'recruiting',
      deadline: '2024-03-20',
      budget: '¥15,000',
      location: '北京',
      requiredRoles: [
        { role: 'photographer', count: 2, filled: 0 },
        { role: 'editor', count: 1, filled: 0 },
        { role: 'planner', count: 1, filled: 1 }
      ],
      members: [
        { userId: '13800138002', nickname: '江湖游侠', role: 'planner', status: 'joined' }
      ],
      applications: [],
      createdAt: '2024-03-05',
      updatedAt: '2024-03-05'
    }
  ]

  function loadTeamProjects() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        teamProjects.value = JSON.parse(stored)
      } else {
        teamProjects.value = [...mockTeamProjects]
        saveTeamProjects()
      }
    } catch {
      teamProjects.value = [...mockTeamProjects]
    }
  }

  function saveTeamProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teamProjects.value))
  }

  function createTeamProject(projectData) {
    const newProject = {
      id: 'team-' + Date.now(),
      ...projectData,
      status: 'recruiting',
      members: [],
      applications: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    teamProjects.value.unshift(newProject)
    saveTeamProjects()
    return newProject
  }

  function updateTeamProject(projectId, updates) {
    const index = teamProjects.value.findIndex(p => p.id === projectId)
    if (index !== -1) {
      teamProjects.value[index] = {
        ...teamProjects.value[index],
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      saveTeamProjects()
      return true
    }
    return false
  }

  function deleteTeamProject(projectId) {
    const index = teamProjects.value.findIndex(p => p.id === projectId)
    if (index !== -1) {
      teamProjects.value.splice(index, 1)
      saveTeamProjects()
      return true
    }
    return false
  }

  function getTeamProjectById(projectId) {
    return teamProjects.value.find(p => p.id === projectId) || null
  }

  function applyForProject(projectId, userId, nickname, role, message) {
    const project = getTeamProjectById(projectId)
    if (!project) return { success: false, message: '项目不存在' }

    if (project.applications.some(a => a.userId === userId)) {
      return { success: false, message: '已经申请过了' }
    }

    if (project.members.some(m => m.userId === userId)) {
      return { success: false, message: '已经是团队成员' }
    }

    project.applications.push({
      userId,
      nickname,
      appliedRole: role,
      message,
      applyTime: new Date().toISOString().split('T')[0]
    })
    saveTeamProjects()
    return { success: true, message: '申请已提交' }
  }

  function acceptApplication(projectId, applicationUserId) {
    const project = getTeamProjectById(projectId)
    if (!project) return { success: false, message: '项目不存在' }

    const applicationIndex = project.applications.findIndex(a => a.userId === applicationUserId)
    if (applicationIndex === -1) return { success: false, message: '申请不存在' }

    const application = project.applications[applicationIndex]

    const roleIndex = project.requiredRoles.findIndex(r => r.role === application.appliedRole)
    if (roleIndex !== -1) {
      if (project.requiredRoles[roleIndex].filled >= project.requiredRoles[roleIndex].count) {
        return { success: false, message: '该角色已招满' }
      }
      project.requiredRoles[roleIndex].filled++
    }

    project.members.push({
      userId: application.userId,
      nickname: application.nickname,
      role: application.appliedRole,
      status: 'joined'
    })

    project.applications.splice(applicationIndex, 1)
    saveTeamProjects()
    return { success: true, message: '已接受申请' }
  }

  function rejectApplication(projectId, applicationUserId) {
    const project = getTeamProjectById(projectId)
    if (!project) return { success: false, message: '项目不存在' }

    const index = project.applications.findIndex(a => a.userId === applicationUserId)
    if (index !== -1) {
      project.applications.splice(index, 1)
      saveTeamProjects()
      return { success: true, message: '已拒绝申请' }
    }
    return { success: false, message: '申请不存在' }
  }

  function leaveProject(projectId, userId) {
    const project = getTeamProjectById(projectId)
    if (!project) return { success: false, message: '项目不存在' }

    const memberIndex = project.members.findIndex(m => m.userId === userId)
    if (memberIndex === -1) return { success: false, message: '不是团队成员' }

    const member = project.members[memberIndex]
    const roleIndex = project.requiredRoles.findIndex(r => r.role === member.role)
    if (roleIndex !== -1 && project.requiredRoles[roleIndex].filled > 0) {
      project.requiredRoles[roleIndex].filled--
    }

    project.members.splice(memberIndex, 1)
    saveTeamProjects()
    return { success: true, message: '已离开项目' }
  }

  function completeProject(projectId) {
    return updateTeamProject(projectId, { status: 'completed' })
  }

  function cancelProject(projectId) {
    return updateTeamProject(projectId, { status: 'cancelled' })
  }

  function getProjectsByCreator(creatorId) {
    return teamProjects.value.filter(p => p.creatorId === creatorId)
  }

  function getProjectsByMember(userId) {
    return teamProjects.value.filter(p => p.members.some(m => m.userId === userId))
  }

  function getRecruitingProjects() {
    return teamProjects.value.filter(p => p.status === 'recruiting')
  }

  function getAvailableRoles(projectId) {
    const project = getTeamProjectById(projectId)
    if (!project) return []
    return project.requiredRoles.filter(r => r.filled < r.count)
  }

  const teamStats = computed(() => ({
    total: teamProjects.value.length,
    recruiting: teamProjects.value.filter(p => p.status === 'recruiting').length,
    inProgress: teamProjects.value.filter(p => p.status === 'in-progress').length,
    completed: teamProjects.value.filter(p => p.status === 'completed').length
  }))

  return {
    teamProjects,
    projectStatuses,
    roleCategories,
    loadTeamProjects,
    saveTeamProjects,
    createTeamProject,
    updateTeamProject,
    deleteTeamProject,
    getTeamProjectById,
    applyForProject,
    acceptApplication,
    rejectApplication,
    leaveProject,
    completeProject,
    cancelProject,
    getProjectsByCreator,
    getProjectsByMember,
    getRecruitingProjects,
    getAvailableRoles,
    teamStats
  }
})
