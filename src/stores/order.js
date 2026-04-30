import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const STORAGE_KEY = 'fr_orders'

  const orders = ref([])

  const mockOrders = [
    {
      id: 'order-001',
      userId: '13800138001',
      type: 'equipment_rental',
      status: 'completed',
      items: [
        { name: 'Sony A7M4 相机', quantity: 1, price: 200, unit: '天' }
      ],
      totalAmount: 200,
      couponId: 'user-coupon-1',
      discountAmount: 10,
      actualAmount: 190,
      createdAt: '2024-01-10 10:00:00',
      completedAt: '2024-01-12 18:00:00',
      address: '上海市静安区南京西路1266号',
      remarks: '请提前一天送达'
    },
    {
      id: 'order-002',
      userId: '13800138001',
      type: 'event_ticket',
      status: 'completed',
      items: [
        { name: '短视频创作经验分享会', quantity: 1, price: 0, unit: '张' }
      ],
      totalAmount: 0,
      couponId: null,
      discountAmount: 0,
      actualAmount: 0,
      createdAt: '2024-01-14 14:30:00',
      completedAt: '2024-01-15 22:00:00',
      address: '线上直播',
      remarks: ''
    },
    {
      id: 'order-003',
      userId: '13800138001',
      type: 'task_payment',
      status: 'completed',
      items: [
        { name: '完成任务「短视频拍摄」', quantity: 1, price: 100, unit: '次' }
      ],
      totalAmount: 100,
      couponId: null,
      discountAmount: 0,
      actualAmount: 100,
      createdAt: '2024-01-15 09:30:00',
      completedAt: '2024-01-15 09:30:00',
      address: '',
      remarks: ''
    },
    {
      id: 'order-004',
      userId: '13800138001',
      type: 'equipment_rental',
      status: 'processing',
      items: [
        { name: 'DJI Mavic 3 无人机', quantity: 1, price: 300, unit: '天' },
        { name: '三脚架', quantity: 1, price: 50, unit: '天' }
      ],
      totalAmount: 350,
      couponId: 'user-coupon-2',
      discountAmount: 50,
      actualAmount: 300,
      createdAt: '2024-01-15 11:00:00',
      completedAt: null,
      address: '北京市朝阳区建国路88号',
      remarks: '周六上午9点前送达'
    },
    {
      id: 'order-005',
      userId: '13800138001',
      type: 'event_ticket',
      status: 'pending_payment',
      items: [
        { name: '剪辑技能提升工作坊', quantity: 1, price: 99, unit: '张' }
      ],
      totalAmount: 99,
      couponId: null,
      discountAmount: 0,
      actualAmount: 99,
      createdAt: '2024-01-15 15:00:00',
      completedAt: null,
      address: '杭州市西湖区文三路123号',
      remarks: ''
    }
  ]

  const orderStatuses = {
    pending_payment: { label: '待支付', icon: '⏳', color: '#f59e0b' },
    processing: { label: '进行中', icon: '🔄', color: '#3b82f6' },
    completed: { label: '已完成', icon: '✅', color: '#10b981' },
    cancelled: { label: '已取消', icon: '❌', color: '#6b7280' }
  }

  const orderTypes = {
    equipment_rental: { label: '设备租赁', icon: '🎥' },
    event_ticket: { label: '活动门票', icon: '🎫' },
    task_payment: { label: '任务结算', icon: '💰' },
    venue_rental: { label: '场地租赁', icon: '🏢' },
    package: { label: '套餐服务', icon: '🎁' }
  }

  function loadOrders() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        orders.value = JSON.parse(stored)
      } else {
        orders.value = [...mockOrders]
        saveOrders()
      }
    } catch {
      orders.value = [...mockOrders]
    }
  }

  function saveOrders() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.value))
  }

  function createOrder(userId, type, items, address = '', remarks = '', couponId = null, discountAmount = 0) {
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const actualAmount = totalAmount - discountAmount

    const newOrder = {
      id: 'order-' + Date.now(),
      userId,
      type,
      status: actualAmount > 0 ? 'pending_payment' : 'processing',
      items,
      totalAmount,
      couponId,
      discountAmount,
      actualAmount,
      createdAt: new Date().toLocaleString('zh-CN'),
      completedAt: null,
      address,
      remarks
    }

    orders.value.unshift(newOrder)
    saveOrders()
    return newOrder
  }

  function updateOrderStatus(orderId, newStatus) {
    const index = orders.value.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders.value[index].status = newStatus
      if (newStatus === 'completed') {
        orders.value[index].completedAt = new Date().toLocaleString('zh-CN')
      }
      saveOrders()
      return true
    }
    return false
  }

  function cancelOrder(orderId) {
    return updateOrderStatus(orderId, 'cancelled')
  }

  function completeOrder(orderId) {
    return updateOrderStatus(orderId, 'completed')
  }

  function payOrder(orderId) {
    const index = orders.value.findIndex(o => o.id === orderId)
    if (index !== -1 && orders.value[index].status === 'pending_payment') {
      orders.value[index].status = 'processing'
      saveOrders()
      return { success: true, message: '支付成功' }
    }
    return { success: false, message: '订单状态不允许支付' }
  }

  function getOrdersByUser(userId) {
    return orders.value.filter(o => o.userId === userId)
  }

  function getOrderById(orderId) {
    return orders.value.find(o => o.id === orderId) || null
  }

  function getOrdersByStatus(userId, status) {
    return orders.value.filter(o => o.userId === userId && o.status === status)
  }

  const orderStats = computed(() => ({
    total: orders.value.length,
    pendingPayment: orders.value.filter(o => o.status === 'pending_payment').length,
    processing: orders.value.filter(o => o.status === 'processing').length,
    completed: orders.value.filter(o => o.status === 'completed').length,
    cancelled: orders.value.filter(o => o.status === 'cancelled').length,
    totalAmount: orders.value.reduce((sum, o) => sum + o.actualAmount, 0),
    completedAmount: orders.value.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.actualAmount, 0)
  }))

  return {
    orders,
    orderStatuses,
    orderTypes,
    loadOrders,
    saveOrders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    completeOrder,
    payOrder,
    getOrdersByUser,
    getOrderById,
    getOrdersByStatus,
    orderStats
  }
})
