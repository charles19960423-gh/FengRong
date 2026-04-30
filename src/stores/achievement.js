import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAchievementStore = defineStore('achievement', () => {
  const achievements = ref({
    'first-bounty': {
      id: 'first-bounty',
      name: '首次揭榜',
      icon: '🪵',
      rarity: 'common',
      rarityText: '普通',
      category: '赏金任务',
      description: '完成第一个赏金任务',
      story: '江湖新人初入酒馆，在悬赏公告板前驻足良久，终于接下人生第一份委托。从此，传奇的序章正式展开...',
      unlockedAt: '2024-01-15',
      progress: 100,
      requirements: { type: 'task', target: 1, current: 1 },
      rewards: { prestige: 50, title: '江湖新秀' }
    },
    'regular': {
      id: 'regular',
      name: '酒馆熟客',
      icon: '🔑',
      rarity: 'common',
      rarityText: '普通',
      category: '酒馆打卡',
      description: '连续7天登录',
      story: '每日必到酒馆报到，与掌柜相谈甚欢。这份坚持，让你成为了酒馆里最熟悉的面孔。',
      unlockedAt: '2024-01-22',
      progress: 100,
      requirements: { type: 'login', target: 7, current: 7 },
      rewards: { prestige: 100, title: '常客' }
    },
    'whiskey': {
      id: 'whiskey',
      name: '威士忌收藏家',
      icon: '🥃',
      rarity: 'uncommon',
      rarityText: '精良',
      category: '藏品收集',
      description: '收集10种法器',
      story: '在江湖中闯荡，收集了各式各样的法器。每一件都是冒险的见证，每一件都藏着独特的故事。',
      unlockedAt: '2024-02-01',
      progress: 100,
      requirements: { type: 'collect', target: 10, current: 10 },
      rewards: { prestige: 200, title: '收藏家' }
    },
    'legend': {
      id: 'legend',
      name: '江湖传说',
      icon: '⚔️',
      rarity: 'legendary',
      rarityText: '传说',
      category: '传奇殿堂',
      description: '声望达到1000',
      story: '你的名字在江湖中广为流传，无论是酒馆里的闲谈，还是茶楼中的议论，都离不开你的传奇故事。',
      unlockedAt: null,
      progress: 65,
      requirements: { type: 'prestige', target: 1000, current: 650 },
      rewards: { prestige: 500, title: '江湖传说' }
    },
    'task-master': {
      id: 'task-master',
      name: '赏金猎人',
      icon: '🎯',
      rarity: 'uncommon',
      rarityText: '精良',
      category: '赏金任务',
      description: '完成10个赏金任务',
      story: '十次揭榜，十次凯旋。你的战绩在酒馆公告板上熠熠生辉，成为众多冒险者的榜样。',
      unlockedAt: null,
      progress: 70,
      requirements: { type: 'task', target: 10, current: 7 },
      rewards: { prestige: 300, title: '赏金猎人' }
    },
    'perfect-task': {
      id: 'perfect-task',
      name: '完美执行',
      icon: '⭐',
      rarity: 'rare',
      rarityText: '稀有',
      category: '赏金任务',
      description: '以完美评价完成5个任务',
      story: '不仅完成任务，更追求极致。每一次交付都无可挑剔，你的专业精神令人叹服。',
      unlockedAt: null,
      progress: 40,
      requirements: { type: 'perfect', target: 5, current: 2 },
      rewards: { prestige: 400, title: '完美执行者' }
    },
    'social-star': {
      id: 'social-star',
      name: '社交达人',
      icon: '🌟',
      rarity: 'uncommon',
      rarityText: '精良',
      category: '社交达人',
      description: '邀请3位好友加入',
      story: '一人独行快，众人同行远。你将酒馆的故事分享给更多人，让江湖更加热闹。',
      unlockedAt: '2024-02-10',
      progress: 100,
      requirements: { type: 'invite', target: 3, current: 3 },
      rewards: { prestige: 150, title: '社交达人' }
    },
    'night-owl': {
      id: 'night-owl',
      name: '夜猫子',
      icon: '🦉',
      rarity: 'common',
      rarityText: '普通',
      category: '酒馆打卡',
      description: '在深夜(23:00-02:00)登录5次',
      story: '夜深人静时，酒馆的灯火依然为你点亮。那些在深夜完成的任务，都成了难忘的回忆。',
      unlockedAt: null,
      progress: 60,
      requirements: { type: 'night', target: 5, current: 3 },
      rewards: { prestige: 80, title: '夜行者' }
    },
    'gear-master': {
      id: 'gear-master',
      name: '法器大师',
      icon: '🔮',
      rarity: 'epic',
      rarityText: '史诗',
      category: '藏品收集',
      description: '收集30种法器',
      story: '从普通的铜剑到传说中的神器，你的藏品足以开设一座小型法器博物馆。',
      unlockedAt: null,
      progress: 20,
      requirements: { type: 'collect', target: 30, current: 6 },
      rewards: { prestige: 800, title: '法器大师' }
    },
    'season-1': {
      id: 'season-1',
      name: '第一季参与者',
      icon: '🏅',
      rarity: 'rare',
      rarityText: '稀有',
      category: '赛季之星',
      description: '参与第一赛季活动',
      story: '在酒馆开业之初便投身其中，见证了第一个赛季的风起云涌。这份经历，是你江湖资历的最好证明。',
      unlockedAt: '2024-01-31',
      progress: 100,
      requirements: { type: 'season', target: 1, current: 1 },
      rewards: { prestige: 250, title: '先驱者' }
    },
    'rich-man': {
      id: 'rich-man',
      name: '金主',
      icon: '💰',
      rarity: 'rare',
      rarityText: '稀有',
      category: '传奇殿堂',
      description: '累计获得10000声望',
      story: '声望如流水般汇聚而来，你的名字已成为财富与实力的象征。',
      unlockedAt: null,
      progress: 28,
      requirements: { type: 'total-prestige', target: 10000, current: 2800 },
      rewards: { prestige: 500, title: '金主' }
    },
    'loyal': {
      id: 'loyal',
      name: '忠诚卫士',
      icon: '🛡️',
      rarity: 'epic',
      rarityText: '史诗',
      category: '酒馆打卡',
      description: '连续登录30天',
      story: '一个月的坚守，见证了你的忠诚与执着。酒馆因你这样的守护者而更加温暖。',
      unlockedAt: null,
      progress: 45,
      requirements: { type: 'login', target: 30, current: 13 },
      rewards: { prestige: 600, title: '忠诚卫士' }
    },
    'headline-author': {
      id: 'headline-author',
      name: '头条作者',
      icon: '📰',
      rarity: 'common',
      rarityText: '普通',
      category: '头条速递',
      description: '发布首篇任务报道',
      story: '笔尖为剑，记录江湖风云的第一篇报道！你的文字将传遍整个酒馆。',
      unlockedAt: '2024-03-01',
      progress: 100,
      requirements: { type: 'task', target: 1, current: 1 },
      rewards: { prestige: 50, title: '新锐记者' }
    },
    'traffic-star': {
      id: 'traffic-star',
      name: '流量明星',
      icon: '📈',
      rarity: 'uncommon',
      rarityText: '精良',
      category: '社交达人',
      description: '获得100次点赞',
      story: '你的报道引起了广泛关注，点赞数突破百次。江湖中，你的名字越来越响亮。',
      unlockedAt: null,
      progress: 75,
      requirements: { type: 'likes', target: 100, current: 75 },
      rewards: { prestige: 150, title: '流量达人' }
    },
    'deep-investigation': {
      id: 'deep-investigation',
      name: '深度调查',
      icon: '🔍',
      rarity: 'uncommon',
      rarityText: '精良',
      category: '赏金任务',
      description: '完成10个深度任务',
      story: '深入事件背后，挖掘真相。每一次深度调查，都让你更接近江湖的本质。',
      unlockedAt: null,
      progress: 40,
      requirements: { type: 'deep-task', target: 10, current: 4 },
      rewards: { prestige: 250, title: '调查记者' }
    },
    'material-expert': {
      id: 'material-expert',
      name: '素材达人',
      icon: '📸',
      rarity: 'rare',
      rarityText: '稀有',
      category: '藏品收集',
      description: '上传50张任务素材',
      story: '用镜头记录江湖的每一个精彩瞬间，你的素材库已经相当丰富。',
      unlockedAt: null,
      progress: 30,
      requirements: { type: 'upload', target: 50, current: 15 },
      rewards: { prestige: 350, title: '素材大师' }
    },
    'opinion-leader': {
      id: 'opinion-leader',
      name: '意见领袖',
      icon: '🎤',
      rarity: 'rare',
      rarityText: '稀有',
      category: '社交达人',
      description: '粉丝数达到1000',
      story: '你的观点影响着众多江湖人士，成为大家信赖的意见领袖。',
      unlockedAt: null,
      progress: 25,
      requirements: { type: 'followers', target: 1000, current: 250 },
      rewards: { prestige: 450, title: '江湖名嘴' }
    },
    'yearly-journalist': {
      id: 'yearly-journalist',
      name: '年度记者',
      icon: '🏅',
      rarity: 'epic',
      rarityText: '史诗',
      category: '赛季之星',
      description: '获得年度最佳记者称号',
      story: '一年的辛勤耕耘，终于收获荣誉。你成为了江湖公认的年度最佳记者！',
      unlockedAt: null,
      progress: 0,
      requirements: { type: 'season-points', target: 5000, current: 0 },
      rewards: { prestige: 800, title: '年度风云记者' }
    },
    'media-tycoon': {
      id: 'media-tycoon',
      name: '传媒大亨',
      icon: '👑',
      rarity: 'legendary',
      rarityText: '传说',
      category: '传奇殿堂',
      description: '建立自己的传媒帝国',
      story: '从一名普通记者到传媒帝国的缔造者，你的传奇故事将被永远铭记。',
      unlockedAt: null,
      progress: 0,
      requirements: { type: 'complete-all', target: 1, current: 0 },
      rewards: { prestige: 1500, title: '传媒帝王' }
    },
    'daily-update': {
      id: 'daily-update',
      name: '每日一更',
      icon: '⏰',
      rarity: 'common',
      rarityText: '普通',
      category: '酒馆打卡',
      description: '连续发布30天内容',
      story: '坚持每日更新，从未间断。你的勤奋与坚持，让读者养成了每天期待的习惯。',
      unlockedAt: null,
      progress: 10,
      requirements: { type: 'daily-post', target: 30, current: 3 },
      rewards: { prestige: 100, title: '勤勉作者' }
    },
    'hotspot-tracker': {
      id: 'hotspot-tracker',
      name: '热点追踪者',
      icon: '🌡️',
      rarity: 'common',
      rarityText: '普通',
      category: '头条速递',
      description: '连续7天发布热点内容',
      story: '紧跟时事热点，第一时间传递江湖动态。你的报道总是走在最前沿！',
      unlockedAt: null,
      progress: 50,
      requirements: { type: 'hotspot', target: 7, current: 3 },
      rewards: { prestige: 80, title: '热点先锋' }
    },
    'exclusive-scoop': {
      id: 'exclusive-scoop',
      name: '独家爆料',
      icon: '🎯',
      rarity: 'uncommon',
      rarityText: '精良',
      category: '头条速递',
      description: '发布5篇独家报道',
      story: '挖掘不为人知的内幕，每一篇独家报道都能引起江湖震动！',
      unlockedAt: null,
      progress: 60,
      requirements: { type: 'exclusive', target: 5, current: 3 },
      rewards: { prestige: 200, title: '独家记者' }
    },
    'video-creator': {
      id: 'video-creator',
      name: '视频达人',
      icon: '🎬',
      rarity: 'uncommon',
      rarityText: '精良',
      category: '藏品收集',
      description: '发布10个视频内容',
      story: '用镜头讲述江湖故事，你的视频作品广受好评！',
      unlockedAt: null,
      progress: 40,
      requirements: { type: 'video', target: 10, current: 4 },
      rewards: { prestige: 220, title: '视频创作者' }
    },
    'columnist': {
      id: 'columnist',
      name: '专栏作家',
      icon: '✍️',
      rarity: 'rare',
      rarityText: '稀有',
      category: '头条速递',
      description: '开设并更新专栏10期',
      story: '深耕某一领域，你的专栏成为众多读者的必读内容！',
      unlockedAt: null,
      progress: 30,
      requirements: { type: 'column', target: 10, current: 3 },
      rewards: { prestige: 400, title: '专栏作家' }
    },
    'live-star': {
      id: 'live-star',
      name: '直播新星',
      icon: '🎤',
      rarity: 'rare',
      rarityText: '稀有',
      category: '社交达人',
      description: '完成5次直播',
      story: '镜头前的你魅力四射，每次直播都吸引众多观众！',
      unlockedAt: null,
      progress: 20,
      requirements: { type: 'live', target: 5, current: 1 },
      rewards: { prestige: 380, title: '直播达人' }
    },
    'data-analyst': {
      id: 'data-analyst',
      name: '数据分析师',
      icon: '📊',
      rarity: 'epic',
      rarityText: '史诗',
      category: '赛季之星',
      description: '发布20篇数据报告',
      story: '用数据解读江湖趋势，你的分析报告成为决策参考！',
      unlockedAt: null,
      progress: 15,
      requirements: { type: 'data-report', target: 20, current: 3 },
      rewards: { prestige: 750, title: '数据专家' }
    }
  })

  const categories = ref([
    { id: 'all', name: '全部', icon: '📋' },
    { id: '酒馆打卡', name: '酒馆打卡', icon: '🍶' },
    { id: '头条速递', name: '头条速递', icon: '📰' },
    { id: '赏金任务', name: '赏金任务', icon: '🎯' },
    { id: '社交达人', name: '社交达人', icon: '👥' },
    { id: '藏品收集', name: '藏品收集', icon: '🎒' },
    { id: '赛季之星', name: '赛季之星', icon: '⭐' },
    { id: '传奇殿堂', name: '传奇殿堂', icon: '👑' }
  ])

  const rarityColors = {
    'common': '#9e9e9e',
    'uncommon': '#2ecc71',
    'rare': '#3498db',
    'epic': '#9b59b6',
    'legendary': '#ffd700'
  }

  const MAX_EQUIP_SLOTS = 3
  const equipped = ref(getStoredEquipped())

  function getStoredEquipped() {
    const stored = localStorage.getItem('equippedAchievements')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        return Array.isArray(data) ? data : []
      } catch {
        return []
      }
    }
    return []
  }

  const stats = computed(() => {
    const all = Object.values(achievements.value)
    const unlocked = all.filter(a => a.unlockedAt !== null)
    const legendary = all.filter(a => a.rarity === 'legendary')
    const unlockedLegendary = legendary.filter(a => a.unlockedAt !== null)

    return {
      total: all.length,
      unlocked: unlocked.length,
      legendary: legendary.length,
      unlockedLegendary: unlockedLegendary.length,
      progress: Math.round((unlocked.length / all.length) * 100)
    }
  })

  function filterByCategory(categoryId) {
    if (categoryId === 'all') {
      return Object.values(achievements.value)
    }
    return Object.values(achievements.value).filter(a => a.category === categoryId)
  }

  function getStatus(achievement) {
    if (achievement.unlockedAt !== null) return 'unlocked'
    if (achievement.progress > 0 && achievement.progress < 100) return 'in-progress'
    return 'locked'
  }

  function getRarityColor(rarity) {
    return rarityColors[rarity] || '#9e9e9e'
  }

  function isEquipped(achievementId) {
    return equipped.value.some(e => e && e.id === achievementId)
  }

  function equip(achievementId, slotIndex = 0) {
    const achievement = achievements.value[achievementId]
    if (!achievement || achievement.unlockedAt === null) return false

    while (equipped.value.length < MAX_EQUIP_SLOTS) {
      equipped.value.push(null)
    }

    const existingIndex = equipped.value.findIndex(e => e && e.id === achievementId)
    if (existingIndex !== -1 && existingIndex !== slotIndex) {
      equipped.value[existingIndex] = null
    }

    equipped.value[slotIndex] = {
      id: achievementId,
      equippedAt: new Date().toISOString().split('T')[0]
    }

    localStorage.setItem('equippedAchievements', JSON.stringify(equipped.value))
    return true
  }

  function unequip(slotIndex) {
    if (equipped.value[slotIndex]) {
      equipped.value[slotIndex] = null
      localStorage.setItem('equippedAchievements', JSON.stringify(equipped.value))
      return true
    }
    return false
  }

  function getEquippedData() {
    return equipped.value.map(e => e ? achievements.value[e.id] : null)
  }

  function getAchievementData(achievementId) {
    return achievements.value[achievementId] || null
  }

  function updateProgress(achievementId, newProgress) {
    const achievement = achievements.value[achievementId]
    if (!achievement) return false

    const oldProgress = achievement.progress
    achievement.progress = Math.min(newProgress, 100)
    achievement.requirements.current = Math.min(achievement.requirements.target, achievement.requirements.current + (newProgress - oldProgress))

    if (achievement.progress >= 100 && achievement.unlockedAt === null) {
      achievement.unlockedAt = new Date().toISOString().split('T')[0]
      return { unlocked: true, achievement }
    }
    return { unlocked: false }
  }

  function checkProgress(eventType, data = {}) {
    const unlockedList = []

    Object.values(achievements.value).forEach(achievement => {
      if (achievement.unlockedAt !== null) return

      let shouldUpdate = false
      let newProgress = achievement.progress

      switch (achievement.requirements.type) {
        case 'task':
          if (eventType === 'task_completed') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'prestige':
          if (eventType === 'prestige_change' && data.prestige) {
            newProgress = Math.min(100, (data.prestige / achievement.requirements.target) * 100)
            shouldUpdate = true
          }
          break
        case 'collect':
          if (eventType === 'item_collected') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'login':
          if (eventType === 'daily_login') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'invite':
          if (eventType === 'friend_invited') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'likes':
          if (eventType === 'like_received') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'upload':
          if (eventType === 'material_uploaded') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'followers':
          if (eventType === 'follower_gained' && data.count) {
            newProgress = Math.min(100, (data.count / achievement.requirements.target) * 100)
            shouldUpdate = true
          }
          break
        case 'daily-post':
          if (eventType === 'daily_post') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'video':
          if (eventType === 'video_posted') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'live':
          if (eventType === 'live_completed') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'deep-task':
          if (eventType === 'deep_task_completed') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'exclusive':
          if (eventType === 'exclusive_posted') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'column':
          if (eventType === 'column_posted') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'data-report':
          if (eventType === 'report_posted') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'perfect':
          if (eventType === 'perfect_task') {
            newProgress = Math.min(100, achievement.progress + (100 / achievement.requirements.target))
            shouldUpdate = true
          }
          break
        case 'total-prestige':
          if (eventType === 'prestige_added' && data.total) {
            newProgress = Math.min(100, (data.total / achievement.requirements.target) * 100)
            shouldUpdate = true
          }
          break
      }

      if (shouldUpdate && newProgress !== achievement.progress) {
        const result = updateProgress(achievement.id, newProgress)
        if (result.unlocked) {
          unlockedList.push(result.achievement)
        }
      }
    })

    return unlockedList
  }

  return {
    achievements,
    categories,
    stats,
    filterByCategory,
    getStatus,
    getRarityColor,
    isEquipped,
    equip,
    unequip,
    getEquippedData,
    getAchievementData,
    updateProgress,
    checkProgress,
    MAX_EQUIP_SLOTS
  }
})
