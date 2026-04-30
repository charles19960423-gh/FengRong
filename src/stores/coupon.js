import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCouponStore = defineStore('coupon', () => {
  const STORAGE_KEY = 'fr_user_coupons'

  const userCoupons = ref([])

  const couponTemplates = [
    {
      id: 'coupon-template-001',
      name: '设备租赁满减券',
      icon: '🎥',
      type: 'equipment',
      source: 'platform',
      value: 10,
      minSpend: 100,
      vipLevel: 1,
      validStart: '2024-01-01',
      validEnd: '2024-12-31',
      maxUse: 1,
      description: '设备租赁消费满100元可用'
    },
    {
      id: 'coupon-template-002',
      name: '场地租赁满减券',
      icon: '🏢',
      type: 'venue',
      source: 'platform',
      value: 50,
      minSpend: 500,
      vipLevel: 2,
      validStart: '2024-01-01',
      validEnd: '2024-12-31',
      maxUse: 1,
      description: '场地租赁消费满500元可用'
    },
    {
      id: 'coupon-template-003',
      name: '套餐满减券',
      icon: '🎁',
      type: 'package',
      source: 'platform',
      value: 100,
      minSpend: 1000,
      vipLevel: 3,
      validStart: '2024-01-01',
      validEnd: '2024-12-31',
      maxUse: 1,
      description: '套餐消费满1000元可用'
    },
    {
      id: 'coupon-template-004',
      name: '高端设备优惠券',
      icon: '🌟',
      type: 'equipment',
      source: 'platform',
      value: 50,
      minSpend: 500,
      vipLevel: 4,
      validStart: '2024-01-01',
      validEnd: '2024-12-31',
      maxUse: 1,
      description: '高端设备租赁满500元可用'
    },
    {
      id: 'coupon-template-005',
      name: '全场通用券',
      icon: '💎',
      type: 'all',
      source: 'platform',
      value: 200,
      minSpend: 2000,
      vipLevel: 5,
      validStart: '2024-01-01',
      validEnd: '2024-12-31',
      maxUse: 1,
      description: '全场消费满2000元可用'
    },
    {
      id: 'coupon-template-006',
      name: '新手礼包',
      icon: '🎁',
      type: 'all',
      source: 'platform',
      value: 20,
      minSpend: 0,
      vipLevel: 1,
      validStart: '2024-01-01',
      validEnd: '2024-12-31',
      maxUse: 1,
      description: '新用户专享，无门槛使用'
    },
    {
      id: 'coupon-template-007',
      name: '任务奖励券',
      icon: '📋',
      type: 'equipment',
      source: 'task',
      value: 15,
      minSpend: 50,
      vipLevel: 1,
      validStart: '2024-01-01',
      validEnd: '2024-12-31',
      maxUse: 3,
      description: '完成任务获得，设备租赁满50元可用'
    },
    {
      id: 'coupon-template-008',
      name: '成就奖励券',
      icon: '🏆',
      type: 'all',
      source: 'task',
      value: 50,
      minSpend: 200,
      vipLevel: 1,
      validStart: '2024-01-01',
      validEnd: '2024-12-31',
      maxUse: 1,
      description: '达成成就获得，全场满200元可用'
    }
  ]

  function loadUserCoupons() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        userCoupons.value = JSON.parse(stored)
      } else {
        userCoupons.value = []
      }
    } catch {
      userCoupons.value = []
    }
  }

  function saveUserCoupons() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userCoupons.value))
  }

  function addCoupon(templateId, userId) {
    const template = couponTemplates.find(t => t.id === templateId)
    if (!template) return { success: false, message: '优惠券不存在' }

    const existingCount = userCoupons.value.filter(
      c => c.templateId === templateId && c.userId === userId && c.status === 'available'
    ).length

    if (existingCount >= template.maxUse) {
      return { success: false, message: '已达到领取上限' }
    }

    const newCoupon = {
      id: 'user-coupon-' + Date.now(),
      templateId,
      userId,
      status: 'available',
      receivedAt: new Date().toISOString().split('T')[0],
      usedAt: null,
      orderId: null
    }

    userCoupons.value.unshift(newCoupon)
    saveUserCoupons()
    return { success: true, message: '领取成功', coupon: newCoupon }
  }

  function useCoupon(couponId, orderId, userId) {
    const coupon = userCoupons.value.find(c => c.id === couponId && c.userId === userId)
    if (!coupon) return { success: false, message: '优惠券不存在' }
    if (coupon.status !== 'available') return { success: false, message: '优惠券不可用' }

    const today = new Date().toISOString().split('T')[0]
    const template = couponTemplates.find(t => t.id === coupon.templateId)
    if (template && today > template.validEnd) {
      coupon.status = 'expired'
      saveUserCoupons()
      return { success: false, message: '优惠券已过期' }
    }

    coupon.status = 'used'
    coupon.usedAt = today
    coupon.orderId = orderId
    saveUserCoupons()
    return { success: true, message: '使用成功' }
  }

  function getAvailableCoupons(userId) {
    const today = new Date().toISOString().split('T')[0]
    return userCoupons.value
      .filter(c => c.userId === userId && c.status === 'available')
      .map(c => ({
        ...c,
        template: couponTemplates.find(t => t.id === c.templateId)
      }))
      .filter(c => !c.template || today <= c.template.validEnd)
  }

  function getUsedCoupons(userId) {
    return userCoupons.value
      .filter(c => c.userId === userId && c.status === 'used')
      .map(c => ({
        ...c,
        template: couponTemplates.find(t => t.id === c.templateId)
      }))
  }

  function getExpiredCoupons(userId) {
    const today = new Date().toISOString().split('T')[0]
    const availableExpired = userCoupons.value
      .filter(c => c.userId === userId && c.status === 'available')
      .map(c => ({
        ...c,
        template: couponTemplates.find(t => t.id === c.templateId)
      }))
      .filter(c => c.template && today > c.template.validEnd)

    return [...availableExpired, ...userCoupons.value
      .filter(c => c.userId === userId && c.status === 'expired')
      .map(c => ({
        ...c,
        template: couponTemplates.find(t => t.id === c.templateId)
      }))]
  }

  function getAllCoupons(userId) {
    return userCoupons.value
      .filter(c => c.userId === userId)
      .map(c => ({
        ...c,
        template: couponTemplates.find(t => t.id === c.templateId)
      }))
  }

  function getCouponsBySource(userId, source) {
    return userCoupons.value
      .filter(c => c.userId === userId)
      .map(c => ({
        ...c,
        template: couponTemplates.find(t => t.id === c.templateId)
      }))
      .filter(c => c.template && c.template.source === source)
  }

  function getAvailableCouponsForOrder(userId, amount, type) {
    const available = getAvailableCoupons(userId)
    return available.filter(c => {
      if (c.template.minSpend > amount) return false
      if (c.template.type !== 'all' && c.template.type !== type) return false
      return true
    })
  }

  function getAvailableTemplates(userId, vipLevel) {
    const userCouponIds = userCoupons.value
      .filter(c => c.userId === userId && c.status === 'available')
      .map(c => c.templateId)

    return couponTemplates.filter(t => {
      if (t.vipLevel > vipLevel) return false
      const count = userCouponIds.filter(id => id === t.id).length
      return count < t.maxUse
    })
  }

  const couponStats = computed(() => ({
    total: userCoupons.value.length,
    available: userCoupons.value.filter(c => c.status === 'available').length,
    used: userCoupons.value.filter(c => c.status === 'used').length,
    expired: userCoupons.value.filter(c => c.status === 'expired').length
  }))

  return {
    userCoupons,
    couponTemplates,
    loadUserCoupons,
    saveUserCoupons,
    addCoupon,
    useCoupon,
    getAvailableCoupons,
    getUsedCoupons,
    getExpiredCoupons,
    getAllCoupons,
    getCouponsBySource,
    getAvailableCouponsForOrder,
    getAvailableTemplates,
    couponStats
  }
})
