import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useResourceStore = defineStore('resource', () => {
  const STORAGE_KEY = 'fr_resources'

  const resources = ref([])

  const resourceCategories = {
    'director': { label: '导演', icon: '🎬' },
    'photographer': { label: '摄影', icon: '📷' },
    'editor': { label: '剪辑', icon: '✂️' },
    'planner': { label: '策划', icon: '📋' },
    'mediabuyer': { label: '媒介', icon: '📡' },
    'designer': { label: '设计', icon: '🎨' },
    'writer': { label: '文案', icon: '✍️' },
    'producer': { label: '制片', icon: '🎥' },
    'other': { label: '其他', icon: '📦' }
  }

  const mockResources = [
    {
      id: 'res-001',
      title: '2024年短视频营销趋势报告',
      description: '全面分析2024年短视频平台的发展趋势、用户行为变化以及营销策略调整。',
      type: 'pdf',
      url: 'https://example.com/report.pdf',
      category: 'planner',
      uploaderId: '13800138001',
      uploaderName: '馆主大人',
      uploadTime: '2024-03-01',
      downloads: 128,
      likes: 45,
      tags: ['短视频', '营销', '趋势'],
      isPublic: true
    },
    {
      id: 'res-002',
      title: '专业摄影团队联系方式',
      description: '合作过的靠谱摄影团队，包含报价参考和作品集链接。',
      type: 'contact',
      contactName: '张老师',
      contactPhone: '13800138002',
      contactWechat: 'zhangphotography',
      category: 'photographer',
      uploaderId: '13800138002',
      uploaderName: '江湖游侠',
      uploadTime: '2024-02-15',
      downloads: 89,
      likes: 32,
      tags: ['摄影', '团队', '合作'],
      isPublic: true
    },
    {
      id: 'res-003',
      title: 'MCN机构合作资源汇总',
      description: '整理了10+优质MCN机构的合作方式、报价和对接人联系方式。',
      type: 'link',
      url: 'https://example.com/mcn-list',
      category: 'mediabuyer',
      uploaderId: '13800138003',
      uploaderName: '赏金猎人',
      uploadTime: '2024-02-20',
      downloads: 156,
      likes: 67,
      tags: ['MCN', '资源', '媒介'],
      isPublic: true
    },
    {
      id: 'res-004',
      title: '剪辑师作品集 - 小王',
      description: '个人剪辑作品集，包含宣传片、纪录片、短视频等多种类型。',
      type: 'portfolio',
      url: 'https://xiaowang.portfolio.com',
      category: 'editor',
      uploaderId: '13800138002',
      uploaderName: '江湖游侠',
      uploadTime: '2024-01-10',
      downloads: 234,
      likes: 89,
      tags: ['剪辑', '作品集', '视频'],
      isPublic: true
    },
    {
      id: 'res-005',
      title: '品牌宣传片策划模板',
      description: '可直接使用的品牌宣传片策划模板，包含创意框架、分镜头脚本模板等。',
      type: 'pdf',
      url: 'https://example.com/planning-template.pdf',
      category: 'planner',
      uploaderId: '13800138001',
      uploaderName: '馆主大人',
      uploadTime: '2024-03-05',
      downloads: 312,
      likes: 134,
      tags: ['策划', '模板', '品牌'],
      isPublic: true
    }
  ]

  function loadResources() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        resources.value = JSON.parse(stored)
      } else {
        resources.value = [...mockResources]
        saveResources()
      }
    } catch {
      resources.value = [...mockResources]
    }
  }

  function saveResources() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources.value))
  }

  function addResource(resourceData) {
    const newResource = {
      id: 'res-' + Date.now(),
      ...resourceData,
      uploadTime: new Date().toISOString().split('T')[0],
      downloads: 0,
      likes: 0,
      isPublic: true
    }
    resources.value.unshift(newResource)
    saveResources()
    return newResource
  }

  function updateResource(resourceId, updates) {
    const index = resources.value.findIndex(r => r.id === resourceId)
    if (index !== -1) {
      resources.value[index] = { ...resources.value[index], ...updates }
      saveResources()
      return true
    }
    return false
  }

  function deleteResource(resourceId) {
    const index = resources.value.findIndex(r => r.id === resourceId)
    if (index !== -1) {
      resources.value.splice(index, 1)
      saveResources()
      return true
    }
    return false
  }

  function getResourceById(resourceId) {
    return resources.value.find(r => r.id === resourceId) || null
  }

  function getResourcesByCategory(category) {
    if (!category || category === 'all') return resources.value
    return resources.value.filter(r => r.category === category)
  }

  function getResourcesByUploader(uploaderId) {
    return resources.value.filter(r => r.uploaderId === uploaderId)
  }

  function searchResources(keyword) {
    if (!keyword) return resources.value
    const lowerKeyword = keyword.toLowerCase()
    return resources.value.filter(r =>
      r.title.toLowerCase().includes(lowerKeyword) ||
      r.description.toLowerCase().includes(lowerKeyword) ||
      r.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    )
  }

  function incrementDownloads(resourceId) {
    const resource = getResourceById(resourceId)
    if (resource) {
      resource.downloads++
      saveResources()
    }
  }

  function toggleLike(resourceId) {
    const resource = getResourceById(resourceId)
    if (resource) {
      resource.likes++
      saveResources()
    }
  }

  const resourceStats = computed(() => {
    const publicResources = resources.value.filter(r => r.isPublic)
    return {
      total: publicResources.length,
      byCategory: Object.keys(resourceCategories).reduce((acc, cat) => {
        acc[cat] = publicResources.filter(r => r.category === cat).length
        return acc
      }, {}),
      totalDownloads: publicResources.reduce((sum, r) => sum + (r.downloads || 0), 0),
      totalLikes: publicResources.reduce((sum, r) => sum + (r.likes || 0), 0)
    }
  })

  const recentResources = computed(() => {
    return [...resources.value]
      .filter(r => r.isPublic)
      .sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime))
      .slice(0, 10)
  })

  const popularResources = computed(() => {
    return [...resources.value]
      .filter(r => r.isPublic)
      .sort((a, b) => (b.downloads + b.likes * 2) - (a.downloads + a.likes * 2))
      .slice(0, 10)
  })

  function getCategoryLabel(category) {
    return resourceCategories[category]?.label || category
  }

  function getCategoryIcon(category) {
    return resourceCategories[category]?.icon || '📦'
  }

  return {
    resources,
    resourceCategories,
    loadResources,
    saveResources,
    addResource,
    updateResource,
    deleteResource,
    getResourceById,
    getResourcesByCategory,
    getResourcesByUploader,
    searchResources,
    incrementDownloads,
    toggleLike,
    resourceStats,
    recentResources,
    popularResources,
    getCategoryLabel,
    getCategoryIcon
  }
})
