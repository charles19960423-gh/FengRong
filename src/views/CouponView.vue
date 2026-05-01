<template>
  <div class="coupon-page">
    <div class="page-header">
      <h1>优惠券中心</h1>
      <p>查看和管理您的优惠券</p>
    </div>

    <div class="tabs">
      <button :class="{ active: activeTab === 'available' }" @click="activeTab = 'available'">
        可用优惠券({{ availableCoupons.length }})
      </button>
      <button :class="{ active: activeTab === 'used' }" @click="activeTab = 'used'">
        已使用({{ usedCoupons.length }})
      </button>
      <button :class="{ active: activeTab === 'expired' }" @click="activeTab = 'expired'">
        已过期({{ expiredCoupons.length }})
      </button>
      <button :class="{ active: activeTab === 'receive' }" @click="activeTab = 'receive'">
        领取优惠券
      </button>
    </div>

    <div v-if="activeTab === 'available'" class="coupon-list">
      <div v-if="availableCoupons.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>暂无可用优惠券</p>
      </div>
      <div
        v-for="coupon in availableCoupons"
        :key="coupon.id"
        class="coupon-card available"
      >
        <div class="coupon-left">
          <div class="coupon-icon">{{ coupon.template?.icon }}</div>
          <div class="coupon-value">
            <span class="value-symbol"></span>
            <span class="value-amount">{{ coupon.template?.value }}</span>
          </div>
          <div class="coupon-condition">
            {{ coupon.template?.minSpend > 0 ? `满${coupon.template?.minSpend}可用` : '无门槛' }}
          </div>
        </div>
        <div class="coupon-right">
          <div class="coupon-name">{{ coupon.template?.name }}</div>
          <div class="coupon-desc">{{ coupon.template?.description }}</div>
          <div class="coupon-meta">
            <span class="source-badge" :class="coupon.template?.source">
              {{ coupon.template?.source === 'platform' ? '平台发放' : '任务奖励' }}
            </span>
            <span class="valid-date">有效期至 {{ coupon.template?.validEnd }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'used'" class="coupon-list">
      <div v-if="usedCoupons.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>暂无已使用的优惠券</p>
      </div>
      <div
        v-for="coupon in usedCoupons"
        :key="coupon.id"
        class="coupon-card used"
      >
        <div class="coupon-left">
          <div class="coupon-icon">{{ coupon.template?.icon }}</div>
          <div class="coupon-value used-value">
            <span class="value-symbol"></span>
            <span class="value-amount">{{ coupon.template?.value }}</span>
          </div>
        </div>
        <div class="coupon-right">
          <div class="coupon-name">{{ coupon.template?.name }}</div>
          <div class="coupon-meta">
            <span class="used-date">使用时间: {{ coupon.usedAt }}</span>
            <span class="order-id">订单 {{ coupon.orderId?.slice(-8) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'expired'" class="coupon-list">
      <div v-if="expiredCoupons.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>暂无已过期的优惠券</p>
      </div>
      <div
        v-for="coupon in expiredCoupons"
        :key="coupon.id"
        class="coupon-card expired"
      >
        <div class="coupon-left">
          <div class="coupon-icon">{{ coupon.template?.icon }}</div>
          <div class="coupon-value expired-value">
            <span class="value-symbol"></span>
            <span class="value-amount">{{ coupon.template?.value }}</span>
          </div>
        </div>
        <div class="coupon-right">
          <div class="coupon-name">{{ coupon.template?.name }}</div>
          <div class="coupon-desc">{{ coupon.template?.description }}</div>
          <div class="coupon-meta">
            <span class="expired-label">已过期</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'receive'" class="receive-section">
      <h2>可领取的优惠券</h2>
      <div v-if="availableTemplates.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>当前没有可领取的优惠券</p>
      </div>
      <div class="receive-list">
        <div
          v-for="template in availableTemplates"
          :key="template.id"
          class="receive-card"
        >
          <div class="receive-icon">{{ template.icon }}</div>
          <div class="receive-info">
            <div class="receive-name">{{ template.name }}</div>
            <div class="receive-desc">{{ template.description }}</div>
            <div class="receive-meta">
              <span class="source-badge" :class="template.source">
                {{ template.source === 'platform' ? '平台发放' : '任务奖励' }}
              </span>
              <span class="vip-require">VIP{{ template.vipLevel }}可用</span>
            </div>
          </div>
          <div class="receive-value">
            <span class="value-symbol"></span>
            <span class="value-amount">{{ template.value }}</span>
          </div>
          <button class="receive-btn" @click="receiveCoupon(template.id)">
            领取
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCouponStore } from '@/stores'
import { useAuthStore } from '@/stores'

const couponStore = useCouponStore()
const authStore = useAuthStore()

const activeTab = ref('available')

onMounted(() => {
  couponStore.loadUserCoupons()
})

const availableCoupons = computed(() => {
  if (!authStore.currentUser) return []
  return couponStore.getAvailableCoupons(authStore.currentUser.phone)
})

const usedCoupons = computed(() => {
  if (!authStore.currentUser) return []
  return couponStore.getUsedCoupons(authStore.currentUser.phone)
})

const expiredCoupons = computed(() => {
  if (!authStore.currentUser) return []
  return couponStore.getExpiredCoupons(authStore.currentUser.phone)
})

const availableTemplates = computed(() => {
  if (!authStore.currentUser) return []
  return couponStore.getAvailableTemplates(
    authStore.currentUser.phone,
    authStore.currentUser.vipLevel || 1
  )
})

function receiveCoupon(templateId) {
  if (!authStore.currentUser) {
    alert('请先登录')
    return
  }

  const result = couponStore.addCoupon(templateId, authStore.currentUser.phone)
  alert(result.message)
}
</script>

<style scoped>
.coupon-page {
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
  background: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-card {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.coupon-card.available {
  border: 2px solid #f59e0b;
}

.coupon-card.used,
.coupon-card.expired {
  opacity: 0.6;
}

.coupon-left {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 16px;
}

.coupon-card.used .coupon-left,
.coupon-card.expired .coupon-left {
  background: #f3f4f6;
}

.coupon-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.coupon-value {
  display: flex;
  align-items: baseline;
}

.value-symbol {
  font-size: 1rem;
  color: #92400e;
}

.value-amount {
  font-size: 2rem;
  font-weight: bold;
  color: #92400e;
}

.used-value .value-symbol,
.used-value .value-amount,
.expired-value .value-symbol,
.expired-value .value-amount {
  color: #9ca3af;
}

.coupon-condition {
  font-size: 0.75rem;
  color: #92400e;
  margin-top: 4px;
}

.coupon-right {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.coupon-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.coupon-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.coupon-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
}

.source-badge {
  padding: 2px 8px;
  border-radius: 12px;
}

.source-badge.platform {
  background: #dbeafe;
  color: #1d4ed8;
}

.source-badge.task {
  background: #dcfce7;
  color: #166534;
}

.valid-date,
.used-date,
.order-id {
  color: #9ca3af;
}

.expired-label {
  color: #ef4444;
  font-weight: 500;
}

.receive-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.receive-section h2 {
  margin-bottom: 16px;
  color: #1f2937;
}

.receive-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.receive-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.receive-icon {
  font-size: 2rem;
  width: 50px;
  text-align: center;
}

.receive-info {
  flex: 1;
}

.receive-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.receive-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.receive-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
}

.vip-require {
  color: #f59e0b;
  font-weight: 500;
}

.receive-value {
  display: flex;
  align-items: baseline;
}

.receive-btn {
  padding: 8px 20px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
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

@media (max-width: 640px) {
  .coupon-card {
    flex-direction: column;
  }

  .coupon-left {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
  }

  .coupon-condition {
    margin-left: auto;
  }

  .receive-card {
    flex-direction: column;
    text-align: center;
  }

  .receive-meta {
    justify-content: center;
  }
}
</style>

