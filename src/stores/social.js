import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSocialStore = defineStore('social', () => {
  const STORAGE_KEY = 'fr_social_data'

  const friends = ref([])
  const friendRequests = ref([])
  const pendingRequests = ref([])
  const socialActivities = ref([])
  const teamMembers = ref([])

  const mockFriends = [
    {
      id: 'user-001',
      nickname: '暗夜游侠',
      avatar: '🦸',
      level: 25,
      title: '资深冒险者',
      status: 'online',
      lastActive: '刚刚',
      commonTasks: 5,
      mutualFriends: 12
    },
    {
      id: 'user-002',
      nickname: '光明法师',
      avatar: '🧙',
      level: 32,
      title: '传奇法师',
      status: 'online',
      lastActive: '刚刚',
      commonTasks: 8,
      mutualFriends: 8
    },
    {
      id: 'user-003',
      nickname: '荒野猎人',
      avatar: '🏹',
      level: 18,
      title: '赏金猎人',
      status: 'offline',
      lastActive: '3小时前',
      commonTasks: 3,
      mutualFriends: 5
    },
    {
      id: 'user-004',
      nickname: '圣光骑士',
      avatar: '🛡️',
      level: 40,
      title: '圣殿骑士',
      status: 'online',
      lastActive: '刚刚',
      commonTasks: 12,
      mutualFriends: 15
    },
    {
      id: 'user-005',
      nickname: '暗影刺客',
      avatar: '🗡️',
      level: 28,
      title: '无影杀手',
      status: 'offline',
      lastActive: '1天前',
      commonTasks: 2,
      mutualFriends: 3
    },
    {
      id: 'user-006',
      nickname: '自然德鲁伊',
      avatar: '🌿',
      level: 35,
      title: '森林守护者',
      status: 'online',
      lastActive: '刚刚',
      commonTasks: 6,
      mutualFriends: 9
    }
  ]

  const mockFriendRequests = [
    {
      id: 'req-001',
      from: {
        id: 'user-007',
        nickname: '烈焰战士',
        avatar: '🔥',
        level: 22,
        title: '火焰使者'
      },
      message: '你好！看到你完成了很多赏金任务，希望能一起组队！',
      time: '2小时前'
    },
    {
      id: 'req-002',
      from: {
        id: 'user-008',
        nickname: '冰霜巫师',
        avatar: '❄️',
        level: 29,
        title: '寒冰法师'
      },
      message: '同行你好，交个朋友吧！',
      time: '5小时前'
    }
  ]

  const mockPendingRequests = [
    {
      id: 'preq-001',
      to: {
        id: 'user-009',
        nickname: '雷霆战神',
        avatar: '⚡',
        level: 38,
        title: '雷电使者'
      },
      time: '1天前',
      status: 'pending'
    }
  ]

  const mockActivities = [
    {
      id: 'act-001',
      type: 'task',
      user: { id: 'user-002', nickname: '光明法师', avatar: '🧙' },
      action: '完成了任务',
      target: '护送商人',
      time: '30分钟前',
      reward: '+200 声望'
    },
    {
      id: 'act-002',
      type: 'achievement',
      user: { id: 'user-004', nickname: '圣光骑士', avatar: '🛡️' },
      action: '获得了成就',
      target: '百发百中',
      time: '1小时前'
    },
    {
      id: 'act-003',
      type: 'friend',
      user: { id: 'user-001', nickname: '暗夜游侠', avatar: '🦸' },
      action: '与',
      target: '荒野猎人 成为好友',
      time: '2小时前'
    },
    {
      id: 'act-004',
      type: 'team',
      user: { id: 'user-006', nickname: '自然德鲁伊', avatar: '🌿' },
      action: '创建了队伍',
      target: '森林探险队',
      time: '3小时前',
      members: 4
    },
    {
      id: 'act-005',
      type: 'task',
      user: { id: 'user-003', nickname: '荒野猎人', avatar: '🏹' },
      action: '接取了赏金任务',
      target: '清除山贼据点',
      time: '5小时前',
      reward: '⚔️ 精良武器'
    }
  ]

  const mockTeamMembers = [
    {
      id: 'user-002',
      nickname: '光明法师',
      avatar: '🧙',
      role: '队长',
      level: 32,
      status: 'online'
    },
    {
      id: 'user-004',
      nickname: '圣光骑士',
      avatar: '🛡️',
      role: '坦克',
      level: 40,
      status: 'online'
    },
    {
      id: 'user-001',
      nickname: '暗夜游侠',
      avatar: '🦸',
      role: '输出',
      level: 25,
      status: 'online'
    }
  ]

  const mockRecommendations = [
    {
      id: 'user-010',
      nickname: '风暴召唤者',
      avatar: '🌪️',
      level: 31,
      title: '元素大师',
      reason: '你们有共同完成的任务',
      commonTasks: 4
    },
    {
      id: 'user-011',
      nickname: '亡灵术士',
      avatar: '💀',
      level: 27,
      title: '黑暗使者',
      reason: '你们有5个共同好友',
      mutualFriends: 5
    },
    {
      id: 'user-012',
      nickname: '机械工程师',
      avatar: '⚙️',
      level: 24,
      title: '发明家',
      reason: '活跃度很高',
      activity: 'high'
    },
    {
      id: 'user-013',
      nickname: '时空行者',
      avatar: '⏳',
      level: 36,
      title: '维度旅行者',
      reason: '完成了相同的成就',
      commonAchievements: 3
    }
  ]

  function loadSocialData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        friends.value = data.friends || [...mockFriends]
        friendRequests.value = data.friendRequests || [...mockFriendRequests]
        pendingRequests.value = data.pendingRequests || [...mockPendingRequests]
        socialActivities.value = data.socialActivities || [...mockActivities]
        teamMembers.value = data.teamMembers || [...mockTeamMembers]
      } else {
        friends.value = [...mockFriends]
        friendRequests.value = [...mockFriendRequests]
        pendingRequests.value = [...mockPendingRequests]
        socialActivities.value = [...mockActivities]
        teamMembers.value = [...mockTeamMembers]
        saveSocialData()
      }
    } catch {
      friends.value = [...mockFriends]
      friendRequests.value = [...mockFriendRequests]
      pendingRequests.value = [...mockPendingRequests]
      socialActivities.value = [...mockActivities]
      teamMembers.value = [...mockTeamMembers]
    }
  }

  function saveSocialData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      friends: friends.value,
      friendRequests: friendRequests.value,
      pendingRequests: pendingRequests.value,
      socialActivities: socialActivities.value,
      teamMembers: teamMembers.value
    }))
  }

  const onlineFriends = computed(() => 
    friends.value.filter(f => f.status === 'online')
  )

  const offlineFriends = computed(() => 
    friends.value.filter(f => f.status === 'offline')
  )

  function acceptFriendRequest(requestId) {
    const index = friendRequests.value.findIndex(r => r.id === requestId)
    if (index !== -1) {
      const request = friendRequests.value[index]
      friends.value.push({
        ...request.from,
        status: 'online',
        lastActive: '刚刚',
        commonTasks: 0,
        mutualFriends: 0
      })
      friendRequests.value.splice(index, 1)
      saveSocialData()
      return true
    }
    return false
  }

  function rejectFriendRequest(requestId) {
    const index = friendRequests.value.findIndex(r => r.id === requestId)
    if (index !== -1) {
      friendRequests.value.splice(index, 1)
      saveSocialData()
      return true
    }
    return false
  }

  function sendFriendRequest(userId) {
    const existing = pendingRequests.value.find(r => r.to.id === userId)
    if (!existing) {
      pendingRequests.value.push({
        id: 'preq-' + Date.now(),
        to: { id: userId, nickname: '未知用户', avatar: '👤', level: 0, title: '' },
        time: '刚刚',
        status: 'pending'
      })
      saveSocialData()
      return true
    }
    return false
  }

  function removeFriend(friendId) {
    const index = friends.value.findIndex(f => f.id === friendId)
    if (index !== -1) {
      friends.value.splice(index, 1)
      saveSocialData()
      return true
    }
    return false
  }

  function getRecommendations() {
    return mockRecommendations
  }

  return {
    friends,
    friendRequests,
    pendingRequests,
    socialActivities,
    teamMembers,
    onlineFriends,
    offlineFriends,
    loadSocialData,
    acceptFriendRequest,
    rejectFriendRequest,
    sendFriendRequest,
    removeFriend,
    getRecommendations
  }
})