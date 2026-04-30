<template>
  <div class="order-page">
    <div class="page-header">
      <h1>📋 订单管理</h1>
      <p>查看和管理您的订单</p>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">¥{{ formatNumber(orderStats.totalAmount) }}</span>
        <span class="stat-label">累计消费</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ orderStats.total }}</span>
        <span class="stat-label">订单总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ orderStats.completed }}</span>
        <span class="stat-label">已完成</span>
      </div>
    </div>

    <div class="tabs">
      <button :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
        全部 ({{ userOrders.length }})
      </button>
      <button :class="{ active: activeTab === 'pending_payment' }" @click="activeTab = 'pending_payment'">
        ⏳ 待支付 ({{ pendingOrders.length }})
      </button>
      <button :class="{ active: activeTab === 'processing' }" @click="activeTab = 'processing'">
        🔄 进行中 ({{ processingOrders.length }})
      </button>
      <button :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">
        ✅ 已完成 ({{ completedOrders.length }})
      </button>
      <button :class="{ active: activeTab === 'cancelled' }" @click="activeTab = 'cancelled'">
        ❌ 已取消 ({{ cancelledOrders.length }})
      </button>
    </div>

    <div class="order-list">
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>暂无相关订单</p>
      </div>

      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
        @click="viewOrder(order)"
      >
        <div class="order-header">
          <div class="order-type">
            <span class="type-icon">{{ getTypeIcon(order.type) }}</span>
            <span class="type-label">{{ getTypeLabel(order.type) }}</span>
          </div>
          <span 
            class="status-badge" 
            :style="{ backgroundColor: getStatusColor(order.status) }"
          >
            {{ getStatusIcon(order.status) }} {{ getStatusLabel(order.status) }}
          </span>
        </div>

        <div class="order-items">
          <div v-for="(item, index) in order.items" :key="index" class="order-item">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">¥{{ item.price }} × {{ item.quantity }}{{ item.unit }}</span>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-info">
            <span class="order-id">订单号: {{ order.id.slice(-8) }}</span>
            <span class="order-time">{{ order.createdAt }}</span>
          </div>
          <div class="order-total">
            <span class="total-label">合计:</span>
            <span class="total-amount">¥{{ order.actualAmount }}</span>
          </div>
        </div>

        <div class="order-actions" v-if="order.status === 'pending_payment'">
          <button class="action-btn pay-btn" @click.stop="handlePay(order.id)">支付</button>
          <button class="action-btn cancel-btn" @click.stop="handleCancel(order.id)">取消</button>
        </div>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-content order-detail-modal">
        <button class="close-btn" @click="showDetailModal = false">×</button>
        
        <div v-if="selectedOrder" class="order-detail">
          <div class="detail-header">
            <div class="detail-type">
              <span class="type-icon">{{ getTypeIcon(selectedOrder.type) }}</span>
              <span class="type-label">{{ getTypeLabel(selectedOrder.type) }}</span>
            </div>
            <span 
              class="status-badge" 
              :style="{ backgroundColor: getStatusColor(selectedOrder.status) }"
            >
              {{ getStatusIcon(selectedOrder.status) }} {{ getStatusLabel(selectedOrder.status) }}
            </span>
          </div>

          <div class="detail-info">
            <div class="info-row">
              <span class="info-label">订单号</span>
              <span class="info-value">{{ selectedOrder.id }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">创建时间</span>
              <span class="info-value">{{ selectedOrder.createdAt }}</span>
            </div>
            <div v-if="selectedOrder.completedAt" class="info-row">
              <span class="info-label">完成时间</span>
              <span class="info-value">{{ selectedOrder.completedAt }}</span>
            </div>
            <div v-if="selectedOrder.address" class="info-row">
              <span class="info-label">地址</span>
              <span class="info-value">{{ selectedOrder.address }}</span>
            </div>
            <div v-if="selectedOrder.remarks" class="info-row">
              <span class="info-label">备注</span>
              <span class="info-value">{{ selectedOrder.remarks }}</span>
            </div>
          </div>

          <div class="detail-items">
            <h3>订单明细</h3>
            <div class="items-list">
              <div v-for="(item, index) in selectedOrder.items" :key="index" class="detail-item">
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-unit">×{{ item.quantity }}{{ item.unit }}</span>
                </div>
                <span class="item-total">¥{{ item.price * item.quantity }}</span>
              </div>
            </div>
          </div>

          <div class="detail-summary">
            <div class="summary-row">
              <span class="summary-label">商品总额</span>
              <span class="summary-value">¥{{ selectedOrder.totalAmount }}</span>
            </div>
            <div v-if="selectedOrder.discountAmount > 0" class="summary-row discount">
              <span class="summary-label">优惠券抵扣</span>
              <span class="summary-value">-¥{{ selectedOrder.discountAmount }}</span>
            </div>
            <div class="summary-row total">
              <span class="summary-label">实付金额</span>
              <span class="summary-value">¥{{ selectedOrder.actualAmount }}</span>
            </div>
          </div>

          <div class="detail-actions">
            <button v-if="selectedOrder.status === 'pending_payment'" class="action-btn primary" @click="handlePay(selectedOrder.id)">
              立即支付 ¥{{ selectedOrder.actualAmount }}
            </button>
            <button v-if="selectedOrder.status === 'pending_payment'" class="action-btn" @click="handleCancel(selectedOrder.id)">
              取消订单
            </button>
            <button class="action-btn secondary" @click="showDetailModal = false">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '../stores/order'
import { useAuthStore } from '../stores/auth'

const orderStore = useOrderStore()
const authStore = useAuthStore()

const activeTab = ref('all')
const showDetailModal = ref(false)
const selectedOrder = ref(null)

onMounted(() => {
  orderStore.loadOrders()
})

const userOrders = computed(() => {
  if (!authStore.currentUser) return []
  return orderStore.getOrdersByUser(authStore.currentUser.phone)
})

const pendingOrders = computed(() => {
  if (!authStore.currentUser) return []
  return orderStore.getOrdersByStatus(authStore.currentUser.phone, 'pending_payment')
})

const processingOrders = computed(() => {
  if (!authStore.currentUser) return []
  return orderStore.getOrdersByStatus(authStore.currentUser.phone, 'processing')
})

const completedOrders = computed(() => {
  if (!authStore.currentUser) return []
  return orderStore.getOrdersByStatus(authStore.currentUser.phone, 'completed')
})

const cancelledOrders = computed(() => {
  if (!authStore.currentUser) return []
  return orderStore.getOrdersByStatus(authStore.currentUser.phone, 'cancelled')
})

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return userOrders.value
  return orderStore.getOrdersByStatus(authStore.currentUser?.phone || '', activeTab.value)
})

const orderStats = computed(() => {
  const userOrders = orderStore.getOrdersByUser(authStore.currentUser?.phone || '')
  return {
    total: userOrders.length,
    totalAmount: userOrders.reduce((sum, o) => sum + o.actualAmount, 0),
    completed: userOrders.filter(o => o.status === 'completed').length
  }
})

function getTypeIcon(type) {
  return orderStore.orderTypes[type]?.icon || '📦'
}

function getTypeLabel(type) {
  return orderStore.orderTypes[type]?.label || type
}

function getStatusIcon(status) {
  return orderStore.orderStatuses[status]?.icon || '📦'
}

function getStatusLabel(status) {
  return orderStore.orderStatuses[status]?.label || status
}

function getStatusColor(status) {
  return orderStore.orderStatuses[status]?.color || '#6b7280'
}

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

function viewOrder(order) {
  selectedOrder.value = order
  showDetailModal.value = true
}

function handlePay(orderId) {
  const result = orderStore.payOrder(orderId)
  alert(result.message)
  if (result.success) {
    showDetailModal.value = false
  }
}

function handleCancel(orderId) {
  if (confirm('确定要取消订单吗？')) {
    orderStore.cancelOrder(orderId)
    showDetailModal.value = false
    alert('订单已取消')
  }
}
</script>

<style scoped>
.order-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-header p {
  color: #6b7280;
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tabs button {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.tabs button.active {
  background: #1f2937;
  color: white;
  border-color: #1f2937;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-icon {
  font-size: 1.25rem;
}

.type-label {
  font-weight: 500;
  color: #1f2937;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 16px;
  color: white;
  font-size: 0.875rem;
}

.order-items {
  margin-bottom: 12px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.item-name {
  color: #374151;
}

.item-price {
  color: #1f2937;
  font-weight: 500;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.order-id,
.order-time {
  margin-right: 16px;
}

.order-total {
  display: flex;
  align-items: baseline;
}

.total-label {
  color: #6b7280;
  margin-right: 8px;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
}

.order-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.action-btn.pay-btn {
  background: #f59e0b;
  color: white;
  border: none;
}

.action-btn.cancel-btn {
  background: #f3f4f6;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.empty-state p {
  color: #6b7280;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
}

.order-detail {
  margin-top: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-label {
  color: #6b7280;
}

.info-value {
  color: #1f2937;
}

.detail-items {
  margin-bottom: 20px;
}

.detail-items h3 {
  margin-bottom: 12px;
  color: #1f2937;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.item-info {
  display: flex;
  gap: 12px;
}

.item-unit {
  color: #9ca3af;
  font-size: 0.875rem;
}

.item-total {
  color: #1f2937;
  font-weight: 500;
}

.detail-summary {
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.summary-row.discount .summary-value {
  color: #10b981;
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.125rem;
  padding-top: 12px;
  border-top: 1px dashed #d1d5db;
}

.detail-actions {
  display: flex;
  gap: 12px;
}

.action-btn.primary {
  flex: 1;
  background: #f59e0b;
  color: white;
  border: none;
}

.action-btn.secondary {
  background: #f3f4f6;
}

@media (max-width: 640px) {
  .stats-bar {
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .order-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .order-id,
  .order-time {
    margin-right: 0;
  }
}
</style>
