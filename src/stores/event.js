import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEventStore = defineStore('event', () => {
  const STORAGE_KEY = 'fr_events'

  const events = ref([])

  const eventStatuses = {
    'upcoming': { label: '即将开始', icon: '🔜', color: '#f59e0b' },
    'registration': { label: '报名中', icon: '📝', color: '#3b82f6' },
    'ongoing': { label: '进行中', icon: '🔥', color: '#ef4444' },
    'completed': { label: '已结束', icon: '✅', color: '#6b7280' },
    'cancelled': { label: '已取消', icon: '❌', color: '#9ca3af' }
  }

  const eventTypes = {
    'gathering': { label: '线下聚会', icon: '🍻' },
    'sharing': { label: '经验分享', icon: '📢' },
    'workshop': { label: '工作坊', icon: '🎯' },
    'screening': { label: '观影会', icon: '🎬' },
    'networking': { label: '社交酒会', icon: '🥂' },
    'other': { label: '其他', icon: '📌' }
  }

  const mockEvents = [
    {
      id: 'event-001',
      title: '枫榕赏金酒馆线下聚会',
      description: '传媒行业同行聚会，互相认识、交流合作的绝佳机会。现场有酒水供应。',
      type: 'gathering',
      status: 'upcoming',
      hostId: '13800138001',
      hostName: '馆主大人',
      venue: '上海市静安区某某酒吧',
      address: '上海市静安区南京西路1266号',
      eventDate: '2024-04-15',
      eventTime: '19:00',
      duration: '3小时',
      capacity: 30,
      attendees: [
        { userId: '13800138002', nickname: '江湖游侠', status: 'confirmed' },
        { userId: '13800138003', nickname: '赏金猎人', status: 'confirmed' }
      ],
      pendingApplications: [
        { userId: '13800138004', nickname: '新来小兵', message: '希望能认识更多同行', applyTime: '2024-03-10' }
      ],
      ticketPrice: 0,
      tags: ['社交', '行业交流', '同行聚会'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-10'
    },
    {
      id: 'event-002',
      title: '短视频创作经验分享会',
      description: '邀请资深从业者分享短视频创作经验，包括选题策划、拍摄技巧、运营策略等。',
      type: 'sharing',
      status: 'registration',
      hostId: '13800138002',
      hostName: '江湖游侠',
      venue: '线上直播 + 微信群',
      address: '腾讯会议',
      eventDate: '2024-03-25',
      eventTime: '20:00',
      duration: '2小时',
      capacity: 500,
      attendees: [
        { userId: '13800138001', nickname: '馆主大人', status: 'confirmed' },
        { userId: '13800138003', nickname: '赏金猎人', status: 'confirmed' },
        { userId: '13800138004', nickname: '新来小兵', status: 'confirmed' }
      ],
      pendingApplications: [],
      ticketPrice: 0,
      tags: ['短视频', '经验分享', '线上活动'],
      createdAt: '2024-03-05',
      updatedAt: '2024-03-15'
    },
    {
      id: 'event-003',
      title: '剪辑技能提升工作坊',
      description: '专业剪辑师带你从零基础到进阶，学习Premiere Pro和达芬奇调色。',
      type: 'workshop',
      status: 'upcoming',
      hostId: '13800138003',
      hostName: '赏金猎人',
      venue: '杭州市西湖区创意园',
      address: '杭州市西湖区文三路123号',
      eventDate: '2024-04-20',
      eventTime: '14:00',
      duration: '4小时',
      capacity: 20,
      attendees: [
        { userId: '13800138001', nickname: '馆主大人', status: 'confirmed' }
      ],
      pendingApplications: [],
      ticketPrice: 99,
      tags: ['剪辑', '工作坊', '技能提升'],
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10'
    },
    {
      id: 'event-004',
      title: '独立纪录片观影会',
      description: '观赏优秀独立纪录片《城市边缘》，映后有导演连线交流环节。',
      type: 'screening',
      status: 'completed',
      hostId: '13800138001',
      hostName: '馆主大人',
      venue: '上海市徐汇区某影院',
      address: '上海市徐汇区衡山路516号',
      eventDate: '2024-02-28',
      eventTime: '19:30',
      duration: '3小时',
      capacity: 50,
      attendees: [
        { userId: '13800138002', nickname: '江湖游侠', status: 'attended' },
        { userId: '13800138003', nickname: '赏金猎人', status: 'attended' }
      ],
      pendingApplications: [],
      ticketPrice: 39,
      tags: ['纪录片', '观影', '线下活动'],
      createdAt: '2024-02-15',
      updatedAt: '2024-02-28'
    }
  ]

  function loadEvents() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        events.value = JSON.parse(stored)
      } else {
        events.value = [...mockEvents]
        saveEvents()
      }
    } catch {
      events.value = [...mockEvents]
    }
  }

  function saveEvents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.value))
  }

  function createEvent(eventData) {
    const newEvent = {
      id: 'event-' + Date.now(),
      ...eventData,
      status: 'upcoming',
      attendees: [],
      pendingApplications: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    events.value.unshift(newEvent)
    saveEvents()
    return newEvent
  }

  function updateEvent(eventId, updates) {
    const index = events.value.findIndex(e => e.id === eventId)
    if (index !== -1) {
      events.value[index] = {
        ...events.value[index],
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      saveEvents()
      return true
    }
    return false
  }

  function deleteEvent(eventId) {
    const index = events.value.findIndex(e => e.id === eventId)
    if (index !== -1) {
      events.value.splice(index, 1)
      saveEvents()
      return true
    }
    return false
  }

  function getEventById(eventId) {
    return events.value.find(e => e.id === eventId) || null
  }

  function applyForEvent(eventId, userId, nickname, message) {
    const event = getEventById(eventId)
    if (!event) return { success: false, message: '活动不存在' }

    if (event.attendees.some(a => a.userId === userId)) {
      return { success: false, message: '已经报名过了' }
    }

    if (event.pendingApplications.some(a => a.userId === userId)) {
      return { success: false, message: '申请正在处理中' }
    }

    if (event.capacity && event.attendees.length >= event.capacity) {
      return { success: false, message: '名额已满' }
    }

    event.pendingApplications.push({
      userId,
      nickname,
      message,
      applyTime: new Date().toISOString().split('T')[0]
    })
    saveEvents()
    return { success: true, message: '报名申请已提交' }
  }

  function confirmAttendance(eventId, userId) {
    const event = getEventById(eventId)
    if (!event) return { success: false, message: '活动不存在' }

    const appIndex = event.pendingApplications.findIndex(a => a.userId === userId)
    if (appIndex !== -1) {
      const application = event.pendingApplications[appIndex]
      event.attendees.push({
        userId: application.userId,
        nickname: application.nickname,
        status: 'confirmed'
      })
      event.pendingApplications.splice(appIndex, 1)
      saveEvents()
      return { success: true, message: '已确认参加' }
    }
    return { success: false, message: '申请不存在' }
  }

  function rejectApplication(eventId, userId) {
    const event = getEventById(eventId)
    if (!event) return { success: false, message: '活动不存在' }

    const index = event.pendingApplications.findIndex(a => a.userId === userId)
    if (index !== -1) {
      event.pendingApplications.splice(index, 1)
      saveEvents()
      return { success: true, message: '已拒绝申请' }
    }
    return { success: false, message: '申请不存在' }
  }

  function cancelAttendance(eventId, userId) {
    const event = getEventById(eventId)
    if (!event) return { success: false, message: '活动不存在' }

    const index = event.attendees.findIndex(a => a.userId === userId)
    if (index !== -1) {
      event.attendees.splice(index, 1)
      saveEvents()
      return { success: true, message: '已取消参加' }
    }
    return { success: false, message: '未找到报名记录' }
  }

  function updateEventStatus(eventId, newStatus) {
    return updateEvent(eventId, { status: newStatus })
  }

  function getEventsByHost(hostId) {
    return events.value.filter(e => e.hostId === hostId)
  }

  function getEventsByAttendee(userId) {
    return events.value.filter(e => e.attendees.some(a => a.userId === userId))
  }

  function getUpcomingEvents() {
    return events.value.filter(e => e.status === 'upcoming' || e.status === 'registration')
  }

  function getAvailableEvents() {
    return events.value.filter(e => e.status === 'upcoming' || e.status === 'registration')
  }

  const eventStats = computed(() => ({
    total: events.value.length,
    upcoming: events.value.filter(e => e.status === 'upcoming').length,
    registration: events.value.filter(e => e.status === 'registration').length,
    ongoing: events.value.filter(e => e.status === 'ongoing').length,
    completed: events.value.filter(e => e.status === 'completed').length,
    totalAttendees: events.value.reduce((sum, e) => sum + e.attendees.length, 0)
  }))

  return {
    events,
    eventStatuses,
    eventTypes,
    loadEvents,
    saveEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    applyForEvent,
    confirmAttendance,
    rejectApplication,
    cancelAttendance,
    updateEventStatus,
    getEventsByHost,
    getEventsByAttendee,
    getUpcomingEvents,
    getAvailableEvents,
    eventStats
  }
})
