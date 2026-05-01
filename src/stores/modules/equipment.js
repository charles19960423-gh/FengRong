import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEquipmentStore = defineStore('equipment', () => {
  const equipments = ref([])
  const rentals = ref([])
  const coupons = ref([])

  const equipmentConfigs = {
    camera: [
      { id: 'cam-001', name: '索尼A7M4套机', model: 'Sony A7M4', specs: '3300万像素', dailyPrice: 300, deposit: 5000, level: 1, category: '基础设备', image: '📷' },
      { id: 'cam-002', name: '索尼FX3摄像机', model: 'Sony FX3', specs: '4K 120fps', dailyPrice: 800, deposit: 10000, level: 2, category: '进阶设备', image: '🎥' },
      { id: 'cam-003', name: 'RED Komodo', model: 'RED Komodo', specs: '6K电影机', dailyPrice: 2000, deposit: 30000, level: 3, category: '专业设备', image: '🎬' },
      { id: 'cam-004', name: 'ARRI Alexa Mini', model: 'ARRI Alexa', specs: '4K电影机', dailyPrice: 5000, deposit: 80000, level: 4, category: '高端设备', image: '🎞️' }
    ],
    stabilizer: [
      { id: 'stab-001', name: 'DJI RS3', model: 'DJI RS3', specs: '承重3kg', dailyPrice: 200, deposit: 2000, level: 1, category: '基础设备', image: '⚖️' },
      { id: 'stab-002', name: 'DJI RS3 Pro', model: 'DJI RS3 Pro', specs: '承重4.5kg', dailyPrice: 350, deposit: 3000, level: 2, category: '进阶设备', image: '⚙️' }
    ],
    lighting: [
      { id: 'light-001', name: '神牛SL60W', model: 'Godox SL60W', specs: '60W LED', dailyPrice: 80, deposit: 500, level: 1, category: '基础设备', image: '💡' },
      { id: 'light-002', name: '爱图仕120D II', model: 'Aputure 120D II', specs: '120W LED', dailyPrice: 300, deposit: 2000, level: 2, category: '进阶设备', image: '🔆' },
      { id: 'light-003', name: '爱图仕300D II', model: 'Aputure 300D II', specs: '300W LED', dailyPrice: 500, deposit: 3000, level: 3, category: '专业设备', image: '✨' }
    ],
    audio: [
      { id: 'audio-001', name: '罗德Wireless Pro', model: 'Rode Wireless Pro', specs: '无线麦克风', dailyPrice: 150, deposit: 1000, level: 1, category: '基础设备', image: '🎤' },
      { id: 'audio-002', name: 'Zoom H4n Pro', model: 'Zoom H4n Pro', specs: '录音机', dailyPrice: 100, deposit: 800, level: 1, category: '基础设备', image: '🎙️' }
    ],
    drone: [
      { id: 'drone-001', name: 'DJI Mini 3 Pro', model: 'DJI Mini 3 Pro', specs: '航拍无人机', dailyPrice: 400, deposit: 5000, level: 2, category: '进阶设备', image: '🚁' },
      { id: 'drone-002', name: 'DJI Inspire 3', model: 'DJI Inspire 3', specs: '专业航拍', dailyPrice: 1200, deposit: 20000, level: 4, category: '高端设备', image: '🛸' }
    ]
  }

  const venueConfigs = [
    { id: 'venue-001', name: '古风小景棚', location: '滨江', area: 80, facilities: ['古风家具', '道具'], halfDayPrice: 800, fullDayPrice: 1500, level: 1, image: '🏮' },
    { id: 'venue-002', name: '现代简约棚', location: '拱墅', area: 100, facilities: ['白色背景', '柔光箱'], halfDayPrice: 600, fullDayPrice: 1000, level: 1, image: '🏢' },
    { id: 'venue-003', name: '影创空间A棚', location: '西湖', area: 200, facilities: ['专业灯光', '绿幕'], halfDayPrice: 1200, fullDayPrice: 2000, level: 2, image: '🎭' },
    { id: 'venue-004', name: '影创空间B棚', location: '西湖', area: 300, facilities: ['多场景切换', '控光系统'], halfDayPrice: 1800, fullDayPrice: 3000, level: 3, image: '🎪' },
    { id: 'venue-005', name: '江南水乡景', location: '西溪', area: 500, facilities: ['古桥', '流水', '古建筑'], halfDayPrice: 1500, fullDayPrice: 2500, level: 3, image: '🌊' },
    { id: 'venue-006', name: '民国风情街', location: '横店杭州点', area: 300, facilities: ['民国建筑', '道具'], halfDayPrice: 2000, fullDayPrice: 3500, level: 4, image: '🏯' }
  ]

  const packageConfigs = [
    { id: 'pkg-001', name: '短视频套餐', equipment: ['cam-001'], venue: 'venue-001', duration: '半天', originalPrice: 1100, description: '适合自媒体博主', image: '📱' },
    { id: 'pkg-002', name: '微电影套餐', equipment: ['cam-002', 'stab-001', 'light-002', 'audio-001'], venue: 'venue-003', duration: '1天', originalPrice: 5600, description: '适合影视团队', image: '🎬' },
    { id: 'pkg-003', name: '直播套餐', equipment: ['cam-003', 'light-003', 'audio-001'], venue: 'venue-004', duration: '1天', originalPrice: 4200, description: '适合直播达人', image: '🔴' },
    { id: 'pkg-004', name: '团建套餐', equipment: [], venue: 'venue-001', duration: '3小时', originalPrice: 1500, description: '适合公司团建', image: '👥' },
    { id: 'pkg-005', name: '尊享套餐', equipment: ['cam-004', 'drone-002', 'light-003', 'audio-001'], venue: 'venue-005', duration: '3天', originalPrice: 18000, description: '适合剧组团队', image: '👑' },
    { id: 'pkg-006', name: '航拍套餐', equipment: ['drone-002'], venue: '', duration: '1天', originalPrice: 2000, description: '适合地产/风景拍摄', image: '🌍' }
  ]

  const couponConfigs = [
    { id: 'coupon-001', type: 'equipment', value: 10, minSpend: 100, vipLevel: 1, name: '设备租赁满减券' },
    { id: 'coupon-002', type: 'venue', value: 50, minSpend: 500, vipLevel: 2, name: '场地租赁满减券' },
    { id: 'coupon-003', type: 'package', value: 100, minSpend: 1000, vipLevel: 3, name: '套餐满减券' },
    { id: 'coupon-004', type: 'equipment', value: 50, minSpend: 500, vipLevel: 4, name: '高端设备优惠券' },
    { id: 'coupon-005', type: 'all', value: 200, minSpend: 2000, vipLevel: 5, name: '全场通用券' }
  ]

  function getAllEquipments() {
    const all = []
    Object.values(equipmentConfigs).forEach(category => {
      all.push(...category)
    })
    return all
  }

  function getEquipmentsByCategory(category) {
    return equipmentConfigs[category] || []
  }

  function getEquipmentById(id) {
    for (const category of Object.values(equipmentConfigs)) {
      const eq = category.find(e => e.id === id)
      if (eq) return eq
    }
    return null
  }

  function getVenues() {
    return venueConfigs
  }

  function getVenueById(id) {
    return venueConfigs.find(v => v.id === id) || null
  }

  function getPackages() {
    return packageConfigs
  }

  function getPackageById(id) {
    return packageConfigs.find(p => p.id === id) || null
  }

  function getCouponsByVipLevel(vipLevel) {
    return couponConfigs.filter(c => c.vipLevel <= vipLevel)
  }

  function getCouponById(id) {
    return couponConfigs.find(c => c.id === id) || null
  }

  function calculateDiscountedPrice(originalPrice, vipLevel) {
    const vipDiscounts = [1, 0.95, 0.9, 0.8, 0.65, 0.5]
    const discount = vipDiscounts[Math.min(vipLevel, 5)] || 1
    return Math.floor(originalPrice * discount)
  }

  function rentEquipment(userId, equipmentId, days, paymentMethod) {
    const equipment = getEquipmentById(equipmentId)
    if (!equipment) return { success: false, message: '设备不存在' }

    const dailyPrice = calculateDiscountedPrice(equipment.dailyPrice, 1)
    const totalPrice = dailyPrice * days

    const rental = {
      id: `rent-${Date.now()}`,
      userId,
      equipmentId,
      equipmentName: equipment.name,
      days,
      dailyPrice,
      totalPrice,
      deposit: equipment.deposit,
      paymentMethod,
      status: 'pending',
      rentedAt: new Date().toISOString().split('T')[0],
      estimatedReturn: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    rentals.value.push(rental)
    saveRentals()
    
    return { success: true, message: '租赁申请已提交', rental }
  }

  function bookVenue(userId, venueId, duration, paymentMethod) {
    const venue = getVenueById(venueId)
    if (!venue) return { success: false, message: '场地不存在' }

    const price = duration === 'halfday' ? venue.halfDayPrice : venue.fullDayPrice
    const discountedPrice = calculateDiscountedPrice(price, 1)

    const booking = {
      id: `book-${Date.now()}`,
      userId,
      venueId,
      venueName: venue.name,
      duration,
      originalPrice: price,
      totalPrice: discountedPrice,
      paymentMethod,
      status: 'pending',
      bookedAt: new Date().toISOString().split('T')[0]
    }

    rentals.value.push(booking)
    saveRentals()
    
    return { success: true, message: '场地预订已提交', booking }
  }

  function purchasePackage(userId, packageId, paymentMethod) {
    const pkg = getPackageById(packageId)
    if (!pkg) return { success: false, message: '套餐不存在' }

    const discountedPrice = calculateDiscountedPrice(pkg.originalPrice, 1)

    const purchase = {
      id: `pkg-${Date.now()}`,
      userId,
      packageId,
      packageName: pkg.name,
      originalPrice: pkg.originalPrice,
      totalPrice: discountedPrice,
      paymentMethod,
      status: 'pending',
      purchasedAt: new Date().toISOString().split('T')[0]
    }

    rentals.value.push(purchase)
    saveRentals()
    
    return { success: true, message: '套餐购买已提交', purchase }
  }

  function getUserRentals(userId) {
    return rentals.value.filter(r => r.userId === userId)
  }

  function confirmRental(rentalId) {
    const rental = rentals.value.find(r => r.id === rentalId)
    if (!rental) return { success: false, message: '租赁记录不存在' }
    
    rental.status = 'confirmed'
    saveRentals()
    return { success: true, message: '租赁已确认' }
  }

  function completeRental(rentalId) {
    const rental = rentals.value.find(r => r.id === rentalId)
    if (!rental) return { success: false, message: '租赁记录不存在' }
    
    rental.status = 'completed'
    rental.returnedAt = new Date().toISOString().split('T')[0]
    saveRentals()
    return { success: true, message: '租赁已完成' }
  }

  function cancelRental(rentalId) {
    const rental = rentals.value.find(r => r.id === rentalId)
    if (!rental) return { success: false, message: '租赁记录不存在' }
    
    rental.status = 'cancelled'
    rental.cancelledAt = new Date().toISOString().split('T')[0]
    saveRentals()
    return { success: true, message: '租赁已取消' }
  }

  function loadRentals() {
    try {
      const stored = localStorage.getItem('equipment_rentals')
      if (stored) {
        rentals.value = JSON.parse(stored)
      }
    } catch {
      rentals.value = []
    }
  }

  function saveRentals() {
    localStorage.setItem('equipment_rentals', JSON.stringify(rentals.value))
  }

  return {
    equipments,
    rentals,
    coupons,
    equipmentConfigs,
    venueConfigs,
    packageConfigs,
    couponConfigs,
    getAllEquipments,
    getEquipmentsByCategory,
    getEquipmentById,
    getVenues,
    getVenueById,
    getPackages,
    getPackageById,
    getCouponsByVipLevel,
    getCouponById,
    calculateDiscountedPrice,
    rentEquipment,
    bookVenue,
    purchasePackage,
    getUserRentals,
    confirmRental,
    completeRental,
    cancelRental,
    loadRentals,
    saveRentals
  }
})
