import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useResourceStore = defineStore('resource', () => {
  const STORAGE_KEY = 'fr_resource_data'

  const resources = ref([])
  const downloads = ref([])

  const resourceCategories = {
    wuxue: { icon: '⚔️', label: '武学' },
    yishu: { icon: '🌿', label: '医术' },
    bingqi: { icon: '🗡️', label: '兵器' },
    jiyao: { icon: '📜', label: '技法' },
    liaoyi: { icon: '💊', label: '疗效' },
    gequan: { icon: '🔮', label: '炼器' },
    other: { icon: '📋', label: '其他' }
  }

  const mockResources = [
    {
      id: 'res-001',
      title: '江湖武学秘籍',
      category: 'wuxue',
      type: 'document',
      tags: ['内功', '心法', '武学'],
      description: '收录了江湖各派的武学秘籍，适合修炼内功的武者。',
      content: '# 江湖武学秘籍\n\n## 内功心法\n\n### 基础内功\n\n1. **吐纳法**\n   - 每日清晨练习，吸入清气，呼出浊气\n   - 每次练习不少于半个时辰\n\n2. **静心诀**\n   - 心静如水，方能感悟天地\n   - 摒弃杂念，专注于内\n\n## 进阶武学\n\n需达到一定内力修为后方可修炼...',
      uploaderId: '13800138001',
      uploaderName: '馆主大人',
      coverImage: '📖',
      views: 1256,
      downloads: 328,
      likes: 256,
      rating: 4.8,
      status: 'published',
      uploadTime: '2024-11-20'
    },
    {
      id: 'res-002',
      title: '草药图鉴',
      category: 'yishu',
      type: 'document',
      tags: ['草药', '药方', '医术'],
      description: '详细记录了各种草药的特性和用途，是医者必备之书。',
      content: '# 草药图鉴\n\n## 常见草药\n\n### 金银花\n- **性味**: 甘，寒\n- **功效**: 清热解毒，疏散风热\n- **分布**: 山野、溪边\n\n### 当归\n- **性味**: 甘、辛，温\n- **功效**: 补血活血，调经止痛\n- **分布**: 高原地区',
      uploaderId: '13800138005',
      uploaderName: '药师阿琳',
      coverImage: '🌿',
      views: 892,
      downloads: 185,
      likes: 167,
      rating: 4.6,
      status: 'published',
      uploadTime: '2024-12-05'
    },
    {
      id: 'res-003',
      title: '兵器图谱',
      category: 'bingqi',
      type: 'document',
      tags: ['武器', '锻造', '兵器'],
      description: '介绍各种兵器的特点和使用方法。',
      content: '# 兵器图谱\n\n## 短兵器\n\n### 匕首\n- 轻便灵活，适合近身搏斗\n- 常用招式：刺、割、挑\n\n## 长兵器\n\n### 长枪\n- 攻击距离远，威力强大\n- 需要较高的力量和技巧',
      uploaderId: '13800138003',
      uploaderName: '神秘刺客',
      coverImage: '⚔️',
      views: 654,
      downloads: 124,
      likes: 98,
      rating: 4.4,
      status: 'published',
      uploadTime: '2024-12-10'
    },
    {
      id: 'res-004',
      title: '经脉疗法详解',
      category: 'liaoyi',
      type: 'document',
      tags: ['经络', '针灸', '疗效'],
      description: '详解人体经脉走向与针灸疗法。',
      content: '# 经脉疗法详解\n\n## 十二正经\n\n人体有十二正经，分别对应不同的脏腑...',
      uploaderId: '13800138006',
      uploaderName: '神医华佗',
      coverImage: '💉',
      views: 1567,
      downloads: 456,
      likes: 389,
      rating: 4.9,
      status: 'published',
      uploadTime: '2024-12-15'
    },
    {
      id: 'res-005',
      title: '炼器入门指南',
      category: 'gequan',
      type: 'document',
      tags: ['炼器', '锻造', '法宝'],
      description: '从零开始学习炼器之术，打造属于自己的法宝。',
      content: '# 炼器入门指南\n\n## 基础材料\n\n1. 玄铁\n2. 精金\n3. 灵石\n\n## 炼器步骤\n\n第一步：熔炼材料...',
      uploaderId: '13800138007',
      uploaderName: '锻造师老张',
      coverImage: '🔨',
      views: 2341,
      downloads: 567,
      likes: 445,
      rating: 4.7,
      status: 'published',
      uploadTime: '2024-12-18'
    }
  ]

  const resourceStats = computed(() => ({
    total: resources.value.length,
    totalDownloads: resources.value.reduce((sum, r) => sum + r.downloads, 0),
    totalLikes: resources.value.reduce((sum, r) => sum + r.likes, 0)
  }))

  function loadResources() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        resources.value = data.resources || []
        downloads.value = data.downloads || []
      } else {
        resources.value = [...mockResources]
        downloads.value = []
        saveResources()
      }
    } catch {
      resources.value = [...mockResources]
      downloads.value = []
    }
  }

  function saveResources() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      resources: resources.value,
      downloads: downloads.value
    }))
  }

  function getResources() {
    return resources.value
  }

  function getResourceById(resourceId) {
    return resources.value.find(r => r.id === resourceId) || null
  }

  function getResourcesByCategory(category) {
    return resources.value.filter(r => r.category === category)
  }

  function getCategoryIcon(category) {
    return resourceCategories[category]?.icon || '📋'
  }

  function getCategoryLabel(category) {
    return resourceCategories[category]?.label || '其他'
  }

  function searchResources(query) {
    if (!query) return resources.value
    const lowerQuery = query.toLowerCase()
    return resources.value.filter(r =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  function createResource(data) {
    const newResource = {
      id: 'res-' + Date.now(),
      ...data,
      views: 0,
      downloads: 0,
      likes: 0,
      rating: 0,
      status: 'published',
      uploadTime: new Date().toISOString().split('T')[0]
    }
    resources.value.unshift(newResource)
    saveResources()
    return newResource
  }

  function updateResource(resourceId, updates) {
    const resource = getResourceById(resourceId)
    if (!resource) return { success: false, message: '资源不存在' }

    Object.assign(resource, updates)
    saveResources()
    return { success: true, resource }
  }

  function incrementViews(resourceId) {
    const resource = getResourceById(resourceId)
    if (resource) {
      resource.views++
      saveResources()
    }
  }

  function downloadResource(resourceId, userId) {
    const resource = getResourceById(resourceId)
    if (!resource) return { success: false, message: '资源不存在' }

    const existingDownload = downloads.value.find(
      d => d.resourceId === resourceId && d.userId === userId
    )
    if (!existingDownload) {
      downloads.value.push({
        id: 'dl-' + Date.now(),
        resourceId,
        userId,
        downloadedAt: new Date().toISOString().split('T')[0]
      })
    }

    resource.downloads++
    saveResources()
    return { success: true }
  }

  function likeResource(resourceId, userId) {
    const resource = getResourceById(resourceId)
    if (!resource) return { success: false, message: '资源不存在' }

    const existingLike = downloads.value.find(
      d => d.resourceId === resourceId && d.userId === userId && d.liked
    )
    if (!existingLike) {
      resource.likes++
    }

    saveResources()
    return { success: true }
  }

  function getMyDownloads(userId) {
    const myDownloadIds = downloads.value
      .filter(d => d.userId === userId)
      .map(d => d.resourceId)
    return resources.value.filter(r => myDownloadIds.includes(r.id))
  }

  return {
    resources,
    downloads,
    resourceCategories,
    resourceStats,
    loadResources,
    saveResources,
    getResources,
    getResourceById,
    getResourcesByCategory,
    getCategoryIcon,
    getCategoryLabel,
    searchResources,
    createResource,
    updateResource,
    incrementViews,
    downloadResource,
    likeResource,
    getMyDownloads
  }
})
