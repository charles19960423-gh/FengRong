import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEventStore = defineStore('event', () => {
  const STORAGE_KEY = 'fr_event_data'

  const events = ref([])
  const registrations = ref([])

  const eventTypes = {
    competition: { icon: '⚔️', label: '竞赛' },
    party: { icon: '🎉', label: '聚会' },
    activity: { icon: '🌿', label: '活动' },
    workshop: { icon: '📚', label: '工作坊' },
    networking: { icon: '🤝', label: '社交' },
    sharing: { icon: '💬', label: '分享会' }
  }

  const eventStatuses = {
    upcoming: { icon: '🔮', label: '即将开始', color: '#8b5cf6' },
    registration: { icon: '📝', label: '报名中', color: '#10b981' },
    active: { icon: '🔥', label: '进行中', color: '#f59e0b' },
    completed: { icon: '✅', label: '已结束', color: '#6b7280' },
    cancelled: { icon: '❌', label: '已取消', color: '#ef4444' }
  }

  const mockEvents = [
    {
      id: 'event-001',
      title: '江湖比武大会',
      description: '一年一度的江湖盛会，各路豪杰齐聚一堂，切磋武艺，争夺武林盟主之位！',
      type: 'competition',
      banner: '🎯',
      eventDate: '2024-12-25',
      eventTime: '09:00',
      venue: '英雄广场',
      address: '武林圣地英雄广场',
      organizer: '凤荣酒馆',
      hostName: '馆主大人',
      hostId: '13800138001',
      capacity: 100,
      ticketPrice: 0,
      attendees: [],
      participants: 78,
      status: 'registration',
      featured: true,
      tags: ['竞赛', '武林', '切磋']
    },
    {
      id: 'event-002',
      title: '冬至团圆宴',
      description: '冬至佳节，酒馆备下丰盛宴席，诚邀各位侠客共度佳节！',
      type: 'party',
      banner: '🎄',
      eventDate: '2024-12-21',
      eventTime: '18:00',
      venue: '酒馆大厅',
      address: '枫榕酒馆一楼大厅',
      organizer: '凤荣酒馆',
      hostName: '馆主大人',
      hostId: '13800138001',
      capacity: 50,
      ticketPrice: 100,
      attendees: [],
      participants: 45,
      status: 'registration',
      featured: true,
      tags: ['聚会', '节日', '团圆']
    },
    {
      id: 'event-003',
      title: '草药采集之旅',
      description: '跟随药师阿琳前往草药谷，学习草药知识，采集珍稀药材。',
      type: 'activity',
      banner: '🌄',
      eventDate: '2024-12-20',
      eventTime: '08:00',
      venue: '草药谷',
      address: '城外草药谷',
      organizer: '药师阿琳',
      hostName: '药师阿琳',
      hostId: '13800138005',
      capacity: 20,
      ticketPrice: 50,
      attendees: [],
      participants: 15,
      status: 'registration',
      featured: false,
      tags: ['活动', '采药', '学习']
    },
    {
      id: 'event-004',
      title: '新媒体运营分享会',
      description: '行业大咖分享新媒体运营经验，探讨影视行业最新趋势。',
      type: 'sharing',
      banner: '📺',
      eventDate: '2024-12-28',
      eventTime: '14:00',
      venue: '枫榕创意园',
      address: '上海市静安区某某路123号',
      organizer: '枫榕圈',
      hostName: '运营总监',
      hostId: '13800138006',
      capacity: 80,
      ticketPrice: 0,
      attendees: [],
      participants: 56,
      status: 'upcoming',
      featured: true,
      tags: ['分享', '行业交流', '新媒体']
    },
    {
      id: 'event-005',
      title: '影视特效工作坊',
      description: '好莱坞特效师亲自指导，学习最新影视特效制作技术。',
      type: 'workshop',
      banner: '🎬',
      eventDate: '2025-01-05',
      eventTime: '10:00',
      venue: '数字创意中心',
      address: '北京市朝阳区某某大厦15层',
      organizer: '枫榕学院',
      hostName: '特效导师',
      hostId: '13800138007',
      capacity: 30,
      ticketPrice: 299,
      attendees: [],
      participants: 12,
      status: 'upcoming',
      featured: false,
      tags: ['工作坊', '特效', '技术']
    }
  ]

  const eventStats = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return {
      total: events.value.length,
      upcoming: events.value.filter(e => e.eventDate > today && e.status !== 'completed').length,
      registration: events.value.filter(e => e.status === 'registration').length,
      completed: events.value.filter(e => e.status === 'completed').length,
      active: events.value.filter(e => e.status === 'active' || e.status === 'registration').length
    }
  })

  function loadEvents() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        events.value = data.events || []
        registrations.value = data.registrations || []
      } else {
        events.value = [...mockEvents]
        registrations.value = []
        saveEvents()
      }
    } catch {
      events.value = [...mockEvents]
      registrations.value = []
    }
  }

  function saveEvents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      events: events.value,
      registrations: registrations.value
    }))
  }

  function getEvents() {
    return events.value
  }

  function getEventById(eventId) {
    return events.value.find(e => e.id === eventId) || null
  }

  function getFeaturedEvents() {
    return events.value.filter(e => e.featured && e.status !== 'completed')
  }

  function getUpcomingEvents() {
    const today = new Date().toISOString().split('T')[0]
    return events.value.filter(e => e.eventDate >= today && e.status !== 'completed')
  }

  function getEventsByType(type) {
    return events.value.filter(e => e.type === type)
  }

  function registerEvent(eventId, userId, userName) {
    const event = getEventById(eventId)
    if (!event) return { success: false, message: '活动不存在' }
    if (event.status === 'completed' || event.status === 'cancelled') return { success: false, message: '活动已结束' }
    if (event.capacity && event.participants >= event.capacity) return { success: false, message: '已满员' }

    const existingReg = registrations.value.find(
      r => r.eventId === eventId && r.userId === userId
    )
    if (existingReg) return { success: false, message: '已报名' }

    event.participants++
    registrations.value.push({
      id: 'reg-' + Date.now(),
      eventId,
      userId,
      userName,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'confirmed'
    })
    saveEvents()
    return { success: true, event }
  }

  function cancelRegistration(eventId, userId) {
    const event = getEventById(eventId)
    if (!event) return { success: false, message: '活动不存在' }

    const index = registrations.value.findIndex(
      r => r.eventId === eventId && r.userId === userId
    )
    if (index === -1) return { success: false, message: '未报名' }

    registrations.value.splice(index, 1)
    event.participants--
    saveEvents()
    return { success: true }
  }

  function getMyRegistrations(userId) {
    const myRegIds = registrations.value
      .filter(r => r.userId === userId)
      .map(r => r.eventId)
    return events.value.filter(e => myRegIds.includes(e.id))
  }

  function createEvent(data) {
    const newEvent = {
      id: 'event-' + Date.now(),
      title: data.title,
      description: data.description || '',
      type: data.type || 'activity',
      banner: eventTypes[data.type]?.icon || '📋',
      eventDate: data.eventDate || data.eventDate,
      eventTime: data.eventTime || '00:00',
      venue: data.venue || '',
      address: data.address || '',
      organizer: data.organizer || '未知',
      hostName: data.hostName || '',
      hostId: data.hostId || '',
      capacity: data.capacity || 0,
      ticketPrice: data.ticketPrice || 0,
      attendees: [],
      participants: 0,
      status: 'registration',
      featured: false,
      tags: data.tags || []
    }
    events.value.unshift(newEvent)
    saveEvents()
    return newEvent
  }

  function getFilteredEvents(statusFilter, typeFilter) {
    let filtered = events.value
    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter)
    }
    if (typeFilter !== 'all') {
      filtered = filtered.filter(e => e.type === typeFilter)
    }
    return filtered
  }

  return {
    events,
    registrations,
    eventTypes,
    eventStatuses,
    eventStats,
    loadEvents,
    saveEvents,
    getEvents,
    getEventById,
    getFeaturedEvents,
    getUpcomingEvents,
    getEventsByType,
    getFilteredEvents,
    registerEvent,
    cancelRegistration,
    getMyRegistrations,
    createEvent,
    applyForEvent: registerEvent,
    confirmAttendance: registerEvent,
    rejectApplication: (eventId, userId) => ({ success: true }),
    cancelAttendance: cancelRegistration
  }
})
