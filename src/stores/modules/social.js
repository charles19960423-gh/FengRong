import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSocialStore = defineStore('social', () => {
  const STORAGE_KEY = 'fr_social_data'

  const friends = ref([])
  const friendRequests = ref([])
  const posts = ref([])
  const comments = ref([])
  const socialActivities = ref([])
  const teams = ref([])
  const pendingRequests = ref([])
  const teamMembers = ref([])

  const mockFriends = [
    {
      id: 'friend-001',
      userId: '13800138002',
      userName: '江湖少侠',
      nickname: '江湖少侠',
      avatar: '🦸',
      level: 25,
      title: '武林新秀',
      status: 'online',
      lastOnline: null,
      lastActive: '在线',
      mutual: true,
      addedAt: '2024-11-01',
      commonTasks: 3,
      mutualFriends: 5
    },
    {
      id: 'friend-002',
      userId: '13800138003',
      userName: '神秘刺客',
      nickname: '神秘刺客',
      avatar: '🥷',
      level: 32,
      title: '暗夜杀手',
      status: 'offline',
      lastOnline: '2024-12-17',
      lastActive: '2024-12-17 18:30',
      mutual: true,
      addedAt: '2024-10-15',
      commonTasks: 1,
      mutualFriends: 2
    },
    {
      id: 'friend-003',
      userId: '13800138004',
      userName: '逍遥剑客',
      nickname: '逍遥剑客',
      avatar: '⚔️',
      level: 28,
      title: '江湖游侠',
      status: 'online',
      lastOnline: null,
      lastActive: '在线',
      mutual: false,
      addedAt: '2024-12-01',
      commonTasks: 0,
      mutualFriends: 0
    }
  ]

  const mockFriendRequests = [
    {
      id: 'req-001',
      fromId: '13800138005',
      fromName: '药师阿琳',
      fromNickname: '药师阿琳',
      fromAvatar: '🧪',
      fromLevel: 18,
      fromTitle: '炼药学徒',
      toId: '13800138001',
      toName: '馆主大人',
      toNickname: '馆主大人',
      toAvatar: '👑',
      message: '你好！想加个好友一起玩',
      time: '2024-12-18 10:00',
      createdAt: '2024-12-18'
    },
    {
      id: 'req-002',
      fromId: '13800138006',
      fromName: '铁匠老张',
      fromNickname: '铁匠老张',
      fromAvatar: '🔨',
      fromLevel: 35,
      fromTitle: '锻造大师',
      toId: '13800138001',
      toName: '馆主大人',
      toNickname: '馆主大人',
      toAvatar: '👑',
      message: '久仰大名，希望能成为好友',
      time: '2024-12-17 15:30',
      createdAt: '2024-12-17'
    }
  ]

  const mockPendingRequests = [
    {
      id: 'preq-001',
      fromId: '13800138001',
      fromName: '馆主大人',
      fromNickname: '馆主大人',
      fromAvatar: '👑',
      toId: '13800138007',
      toName: '炼丹道长',
      toNickname: '炼丹道长',
      toAvatar: '⚗️',
      message: '',
      time: '2024-12-18 09:00'
    }
  ]

  const mockPosts = [
    {
      id: 'post-001',
      authorId: '13800138002',
      authorName: '江湖少侠',
      authorNickname: '江湖少侠',
      authorAvatar: '🦸',
      content: '今天完成了一个艰难的任务，获得了珍贵的奖励！🏆',
      images: [],
      likes: ['13800138001', '13800138003'],
      comments: ['comment-001', 'comment-002'],
      createdAt: '2024-12-18 14:30',
      visibility: 'public'
    },
    {
      id: 'post-002',
      authorId: '13800138003',
      authorName: '神秘刺客',
      authorNickname: '神秘刺客',
      authorAvatar: '🥷',
      content: '分享一张风景照，雪山之巅真的很美 ❄️',
      images: ['https://example.com/snow.jpg'],
      likes: ['13800138001'],
      comments: [],
      createdAt: '2024-12-17 20:15',
      visibility: 'friends'
    }
  ]

  const mockComments = [
    {
      id: 'comment-001',
      postId: 'post-001',
      authorId: '13800138001',
      authorName: '馆主大人',
      authorNickname: '馆主大人',
      authorAvatar: '👑',
      content: '恭喜恭喜！🎉',
      createdAt: '2024-12-18 14:35',
      likes: []
    },
    {
      id: 'comment-002',
      postId: 'post-001',
      authorId: '13800138004',
      authorName: '逍遥剑客',
      authorNickname: '逍遥剑客',
      authorAvatar: '⚔️',
      content: '厉害！是什么任务？',
      createdAt: '2024-12-18 15:00',
      likes: ['13800138002']
    }
  ]

  const mockSocialActivities = [
    {
      id: 'act-001',
      user: { id: '13800138002', nickname: '江湖少侠', avatar: '🦸' },
      action: '完成了任务',
      target: '「收集神秘符文」',
      time: '5分钟前',
      reward: '💰 3,500金币',
      members: null
    },
    {
      id: 'act-002',
      user: { id: '13800138003', nickname: '神秘刺客', avatar: '🥷' },
      action: '发起了组队',
      target: '「清除山贼据点」',
      time: '15分钟前',
      reward: null,
      members: 3
    },
    {
      id: 'act-003',
      user: { id: '13800138004', nickname: '逍遥剑客', avatar: '⚔️' },
      action: '发布了悬赏',
      target: '「护送商队」',
      time: '30分钟前',
      reward: '💰 8,000金币',
      members: null
    },
    {
      id: 'act-004',
      user: { id: '13800138005', nickname: '药师阿琳', avatar: '🧪' },
      action: '获得了成就',
      target: '「初出茅庐」',
      time: '1小时前',
      reward: '🏅',
      members: null
    }
  ]

  const mockTeamMembers = [
    {
      id: 'team-001',
      userId: '13800138001',
      nickname: '馆主大人',
      avatar: '👑',
      level: 50,
      status: 'online',
      role: '队长'
    },
    {
      id: 'team-002',
      userId: '13800138002',
      nickname: '江湖少侠',
      avatar: '🦸',
      level: 25,
      status: 'online',
      role: '队员'
    },
    {
      id: 'team-003',
      userId: '13800138004',
      nickname: '逍遥剑客',
      avatar: '⚔️',
      level: 28,
      status: 'offline',
      role: '队员'
    }
  ]

  const mockRecommendations = [
    {
      id: 'rec-001',
      userId: '13800138008',
      nickname: '光明牧师',
      userName: '光明牧师',
      avatar: '✨',
      level: 22,
      title: '圣光使者',
      reason: '你们有2个共同好友',
      commonTasks: 2,
      mutualFriends: 2,
      commonAchievements: 1
    },
    {
      id: 'rec-002',
      userId: '13800138009',
      nickname: '狂战士',
      userName: '狂战士',
      avatar: '🔥',
      level: 30,
      title: '战意滔天',
      reason: '擅长战斗类任务',
      commonTasks: 0,
      mutualFriends: 0,
      commonAchievements: 0
    },
    {
      id: 'rec-003',
      userId: '13800138010',
      nickname: '神算子',
      userName: '神算子',
      avatar: '📊',
      level: 26,
      title: '运筹帷幄',
      reason: '你们有共同完成的任务',
      commonTasks: 5,
      mutualFriends: 3,
      commonAchievements: 2
    }
  ]

  function loadSocial() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        friends.value = data.friends || []
        friendRequests.value = data.friendRequests || []
        pendingRequests.value = data.pendingRequests || []
        posts.value = data.posts || []
        comments.value = data.comments || []
        socialActivities.value = data.socialActivities || []
        teams.value = data.teams || []
        teamMembers.value = data.teamMembers || []
      } else {
        friends.value = [...mockFriends]
        friendRequests.value = [...mockFriendRequests]
        pendingRequests.value = [...mockPendingRequests]
        posts.value = [...mockPosts]
        comments.value = [...mockComments]
        socialActivities.value = [...mockSocialActivities]
        teams.value = []
        teamMembers.value = [...mockTeamMembers]
        saveSocial()
      }
    } catch {
      friends.value = [...mockFriends]
      friendRequests.value = [...mockFriendRequests]
      pendingRequests.value = [...mockPendingRequests]
      posts.value = [...mockPosts]
      comments.value = [...mockComments]
      socialActivities.value = [...mockSocialActivities]
      teams.value = []
      teamMembers.value = [...mockTeamMembers]
    }
  }

  function saveSocial() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      friends: friends.value,
      friendRequests: friendRequests.value,
      pendingRequests: pendingRequests.value,
      posts: posts.value,
      comments: comments.value,
      socialActivities: socialActivities.value,
      teams: teams.value,
      teamMembers: teamMembers.value
    }))
  }

  function loadSocialData() {
    loadSocial()
  }

  function getFriends(userId) {
    return friends.value.filter(f => f.userId !== userId)
  }

  function getFriendRequests(userId) {
    return friendRequests.value.filter(r => r.toId === userId && r.status === 'pending')
  }

  function getPendingRequests(userId) {
    return pendingRequests.value.filter(r => r.fromId === userId)
  }

  function getRecommendations() {
    return mockRecommendations
  }

  function sendFriendRequest(fromId, fromName, fromAvatar, toId, message = '') {
    const existingRequest = friendRequests.value.find(
      r => (r.fromId === fromId && r.toId === toId) || (r.fromId === toId && r.toId === fromId)
    )
    if (existingRequest) return { success: false, message: '已有好友请求' }

    const isAlreadyFriend = friends.value.some(
      f => (f.userId === fromId || f.userId === toId)
    )
    if (isAlreadyFriend) return { success: false, message: '已是好友' }

    const request = {
      id: 'preq-' + Date.now(),
      fromId,
      fromName,
      fromNickname: fromName,
      fromAvatar,
      toId,
      toName: fromName,
      toNickname: fromName,
      toAvatar: '👑',
      message,
      time: new Date().toLocaleString('zh-CN', { hour12: false })
    }
    pendingRequests.value.unshift(request)
    saveSocial()
    return { success: true, request }
  }

  function acceptFriendRequest(requestId) {
    const index = friendRequests.value.findIndex(r => r.id === requestId)
    if (index === -1) return { success: false, message: '请求不存在' }

    const request = friendRequests.value[index]
    friendRequests.value[index].status = 'accepted'

    const newFriend = {
      id: 'friend-' + Date.now(),
      userId: request.fromId,
      userName: request.fromName,
      nickname: request.fromNickname || request.fromName,
      avatar: request.fromAvatar,
      level: request.fromLevel || 1,
      title: request.fromTitle || '冒险者',
      status: 'online',
      lastOnline: null,
      lastActive: '在线',
      mutual: true,
      addedAt: new Date().toISOString().split('T')[0],
      commonTasks: 0,
      mutualFriends: 0
    }
    friends.value.unshift(newFriend)
    saveSocial()
    return { success: true, friend: newFriend }
  }

  function rejectFriendRequest(requestId) {
    const index = friendRequests.value.findIndex(r => r.id === requestId)
    if (index === -1) return { success: false, message: '请求不存在' }

    friendRequests.value[index].status = 'rejected'
    saveSocial()
    return { success: true }
  }

  function removeFriend(friendId, userId) {
    const index = friends.value.findIndex(f => f.id === friendId)
    if (index === -1) return { success: false, message: '好友不存在' }

    friends.value.splice(index, 1)
    saveSocial()
    return { success: true }
  }

  function cancelRequest(requestId) {
    const index = pendingRequests.value.findIndex(r => r.id === requestId)
    if (index === -1) return { success: false, message: '请求不存在' }

    pendingRequests.value.splice(index, 1)
    saveSocial()
    return { success: true }
  }

  function createPost(authorId, authorName, authorAvatar, content, images = [], visibility = 'public') {
    const post = {
      id: 'post-' + Date.now(),
      authorId,
      authorName,
      authorNickname: authorName,
      authorAvatar,
      content,
      images,
      likes: [],
      comments: [],
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      visibility
    }
    posts.value.unshift(post)
    saveSocial()
    return post
  }

  function getPosts(userId) {
    return posts.value.filter(post => {
      if (post.visibility === 'public') return true
      if (post.visibility === 'friends') {
        return friends.value.some(f => f.userId === userId)
      }
      return false
    })
  }

  function likePost(postId, userId) {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return { success: false, message: '帖子不存在' }

    const likeIndex = post.likes.indexOf(userId)
    if (likeIndex === -1) {
      post.likes.push(userId)
    } else {
      post.likes.splice(likeIndex, 1)
    }
    saveSocial()
    return { success: true, liked: likeIndex === -1 }
  }

  function addComment(postId, authorId, authorName, authorAvatar, content) {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return { success: false, message: '帖子不存在' }

    const comment = {
      id: 'comment-' + Date.now(),
      postId,
      authorId,
      authorName,
      authorNickname: authorName,
      authorAvatar,
      content,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      likes: []
    }
    comments.value.unshift(comment)
    post.comments.push(comment.id)
    saveSocial()
    return { success: true, comment }
  }

  function getComments(postId) {
    return comments.value.filter(c => c.postId === postId)
  }

  function likeComment(commentId, userId) {
    const comment = comments.value.find(c => c.id === commentId)
    if (!comment) return { success: false, message: '评论不存在' }

    const likeIndex = comment.likes.indexOf(userId)
    if (likeIndex === -1) {
      comment.likes.push(userId)
    } else {
      comment.likes.splice(likeIndex, 1)
    }
    saveSocial()
    return { success: true, liked: likeIndex === -1 }
  }

  function getTeamMembers(teamId) {
    const team = teams.value.find(t => t.id === teamId)
    return team ? team.members : []
  }

  const onlineFriends = computed(() => friends.value.filter(f => f.status === 'online'))
  const offlineFriends = computed(() => friends.value.filter(f => f.status === 'offline'))

  return {
    friends,
    friendRequests,
    pendingRequests,
    posts,
    comments,
    socialActivities,
    teams,
    teamMembers,
    onlineFriends,
    offlineFriends,
    loadSocial,
    saveSocial,
    loadSocialData,
    getFriends,
    getFriendRequests,
    getPendingRequests,
    getRecommendations,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    cancelRequest,
    createPost,
    getPosts,
    likePost,
    addComment,
    getComments,
    likeComment,
    getTeamMembers
  }
})
