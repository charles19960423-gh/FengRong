<template>
  <div class="equipment-view">
    <div class="page-header">
      <h1> 影视设备租赁</h1>
      <p>杭州本地影视设备与场地租赁服务</p>
    </div>

    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.icon }} {{ tab.name }}
      </button>
    </div>

    <div v-if="activeTab === 'equipment'" class="equipment-section">
      <div class="filter-bar">
        <select v-model="equipmentFilter" class="filter-select">
          <option value="all">全部类别</option>
          <option value="camera"> 相机</option>
          <option value="stabilizer">稳定器</option>
          <option value="lighting">灯光</option>
          <option value="audio">音频</option>
          <option value="drone">无人机</option>
        </select>
        <select v-model="levelFilter" class="filter-select">
          <option value="all">全部等级</option>
          <option value="1">VIP1可用</option>
          <option value="2">VIP2可用</option>
          <option value="3">VIP3可用</option>
          <option value="4">VIP4可用</option>
        </select>
      </div>

      <div class="equipment-grid">
        <div 
          v-for="equipment in filteredEquipments" 
          :key="equipment.id" 
          class="equipment-card"
          :class="{ locked: !canRent(equipment) }"
        >
          <div class="equipment-image">{{ equipment.image }}</div>
          <h3>{{ equipment.name }}</h3>
          <p class="model">{{ equipment.model }}</p>
          <p class="specs">{{ equipment.specs }}</p>
          <div class="category">{{ equipment.category }}</div>
          <div class="price-info">
            <span class="daily-price">{{ equipment.dailyPrice }}/天</span>
            <span class="vip-price">VIP价 {{ getVipPrice(equipment) }}/天</span>
          </div>
          <div class="deposit">押金: {{ equipment.deposit }}</div>
          <button 
            v-if="canRent(equipment)" 
            class="rent-btn"
            @click="openRentModal(equipment)"
          >
            立即租赁
          </button>
          <span v-else class="locked-text">VIP{{ equipment.level }}+可用</span>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'venue'" class="venue-section">
      <div class="venue-grid">
        <div 
          v-for="venue in venues" 
          :key="venue.id" 
          class="venue-card"
          :class="{ locked: !canBook(venue) }"
        >
          <div class="venue-image">{{ venue.image }}</div>
          <h3>{{ venue.name }}</h3>
          <p class="location"> {{ venue.location }}</p>
          <p class="area">面积: {{ venue.area }}㎡</p>
          <div class="facilities">
            <span v-for="facility in venue.facilities" :key="facility" class="facility-tag">
              {{ facility }}
            </span>
          </div>
          <div class="price-info">
            <span class="half-price">半天 {{ venue.halfDayPrice }}</span>
            <span class="full-price">全天 {{ venue.fullDayPrice }}</span>
          </div>
          <button 
            v-if="canBook(venue)" 
            class="book-btn"
            @click="openVenueModal(venue)"
          >
            立即预订
          </button>
          <span v-else class="locked-text">VIP{{ venue.level }}+可用</span>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'package'" class="package-section">
      <div class="package-grid">
        <div 
          v-for="pkg in packages" 
          :key="pkg.id" 
          class="package-card"
        >
          <div class="package-image">{{ pkg.image }}</div>
          <h3>{{ pkg.name }}</h3>
          <p class="duration"> {{ pkg.duration }}</p>
          <p class="description">{{ pkg.description }}</p>
          <div class="price-info">
            <span class="original-price">原价 {{ pkg.originalPrice }}</span>
            <span class="vip-price">VIP?{{ getPackageVipPrice(pkg) }}</span>
          </div>
          <button class="purchase-btn" @click="openPackageModal(pkg)">
            立即购买
          </button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'myrentals'" class="rentals-section">
      <div v-if="userRentals.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>暂无租赁记录</p>
      </div>
      <div v-else class="rentals-list">
        <div 
          v-for="rental in userRentals" 
          :key="rental.id" 
          class="rental-item"
        >
          <div class="rental-info">
            <h4>{{ rental.equipmentName || rental.venueName || rental.packageName }}</h4>
            <p class="rental-type">{{ getRentalType(rental) }}</p>
            <p class="rental-date">{{ rental.rentedAt || rental.bookedAt || rental.purchasedAt }}</p>
          </div>
          <div class="rental-price">{{ rental.totalPrice }}</div>
          <div :class="['rental-status', rental.status]">
            {{ getStatusText(rental.status) }}
          </div>
          <div class="rental-actions">
            <button v-if="rental.status === 'pending'" class="action-btn" @click="confirmRental(rental.id)">
              确认
            </button>
            <button v-if="rental.status === 'confirmed'" class="action-btn" @click="completeRental(rental.id)">
              完成
            </button>
            <button v-if="rental.status === 'pending'" class="action-btn cancel" @click="cancelRental(rental.id)">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showRentModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>租赁 {{ selectedEquipment?.name }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>租赁天数</label>
            <input type="number" v-model="rentDays" min="1" max="30" />
          </div>
          <div class="form-group">
            <label>支付方式</label>
            <select v-model="paymentMethod">
              <option value="coins"> 金币</option>
              <option value="pearls"> 珍珠</option>
              <option value="points">?积分</option>
            </select>
          </div>
          <div class="price-summary">
            <p>日租 {{ selectedEquipment?.dailyPrice }}</p>
            <p>VIP折扣: {{ (authStore.currentDiscount * 100).toFixed(0) }}%</p>
            <p>押金: {{ selectedEquipment?.deposit }}</p>
            <p class="total">总计: {{ calculateTotal() }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="submit-btn" @click="submitRental">确认租赁</button>
        </div>
      </div>
    </div>

    <div v-if="showVenueModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>预订 {{ selectedVenue?.name }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>预订时长</label>
            <select v-model="venueDuration">
              <option value="halfday">半天</option>
              <option value="fullday">全天</option>
            </select>
          </div>
          <div class="form-group">
            <label>支付方式</label>
            <select v-model="paymentMethod">
              <option value="coins"> 金币</option>
              <option value="pearls"> 珍珠</option>
              <option value="points">?积分</option>
            </select>
          </div>
          <div class="price-summary">
            <p>价格: {{ getVenuePrice() }}</p>
            <p>VIP折扣: {{ (authStore.currentDiscount * 100).toFixed(0) }}%</p>
            <p class="total">总计: {{ calculateVenueTotal() }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="submit-btn" @click="submitVenueBooking">确认预订</button>
        </div>
      </div>
    </div>

    <div v-if="showPackageModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>购买 {{ selectedPackage?.name }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>支付方式</label>
            <select v-model="paymentMethod">
              <option value="coins"> 金币</option>
              <option value="pearls"> 珍珠</option>
              <option value="points">?积分</option>
            </select>
          </div>
          <div class="price-summary">
            <p>原价: {{ selectedPackage?.originalPrice }}</p>
            <p>VIP折扣: {{ (authStore.currentDiscount * 100).toFixed(0) }}%</p>
            <p class="total">总计: {{ calculatePackageTotal() }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="submit-btn" @click="submitPackagePurchase">确认购买</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEquipmentStore } from '@/stores'
import { useAuthStore } from '@/stores'

const equipmentStore = useEquipmentStore()
const authStore = useAuthStore()

const tabs = [
  { id: 'equipment', name: '设备租赁', icon: '' },
  { id: 'venue', name: '场地预订', icon: '' },
  { id: 'package', name: '套餐服务', icon: '' },
  { id: 'myrentals', name: '我的租赁', icon: '' }
]

const activeTab = ref('equipment')
const equipmentFilter = ref('all')
const levelFilter = ref('all')
const showRentModal = ref(false)
const showVenueModal = ref(false)
const showPackageModal = ref(false)
const selectedEquipment = ref(null)
const selectedVenue = ref(null)
const selectedPackage = ref(null)
const rentDays = ref(1)
const venueDuration = ref('halfday')
const paymentMethod = ref('coins')

const filteredEquipments = computed(() => {
  let equipments = equipmentStore.getAllEquipments()
  
  if (equipmentFilter.value !== 'all') {
    equipments = equipments.filter(e => e.id.startsWith(equipmentFilter.value.slice(0, 3)))
  }
  
  if (levelFilter.value !== 'all') {
    equipments = equipments.filter(e => e.level <= parseInt(levelFilter.value))
  }
  
  return equipments
})

const venues = computed(() => equipmentStore.getVenues())
const packages = computed(() => equipmentStore.getPackages())

const userRentals = computed(() => {
  if (!authStore.currentUser) return []
  return equipmentStore.getUserRentals(authStore.currentUser.phone)
})

function canRent(equipment) {
  if (!authStore.isLoggedIn) return false
  return authStore.currentUser.vipLevel >= equipment.level
}

function canBook(venue) {
  if (!authStore.isLoggedIn) return false
  return authStore.currentUser.vipLevel >= venue.level
}

function getVipPrice(equipment) {
  return equipmentStore.calculateDiscountedPrice(equipment.dailyPrice, authStore.currentUser?.vipLevel || 1)
}

function getPackageVipPrice(pkg) {
  return equipmentStore.calculateDiscountedPrice(pkg.originalPrice, authStore.currentUser?.vipLevel || 1)
}

function getVenuePrice() {
  if (!selectedVenue.value) return 0
  return venueDuration.value === 'halfday' 
    ? selectedVenue.value.halfDayPrice 
    : selectedVenue.value.fullDayPrice
}

function calculateTotal() {
  if (!selectedEquipment.value) return 0
  const dailyPrice = getVipPrice(selectedEquipment.value)
  return dailyPrice * rentDays.value
}

function calculateVenueTotal() {
  const price = getVenuePrice()
  return equipmentStore.calculateDiscountedPrice(price, authStore.currentUser?.vipLevel || 1)
}

function calculatePackageTotal() {
  if (!selectedPackage.value) return 0
  return getPackageVipPrice(selectedPackage.value)
}

function getRentalType(rental) {
  if (rental.equipmentId) return '设备租赁'
  if (rental.venueId) return '场地预订'
  if (rental.packageId) return '套餐服务'
  return '租赁'
}

function getStatusText(status) {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

function openRentModal(equipment) {
  selectedEquipment.value = equipment
  showRentModal.value = true
}

function openVenueModal(venue) {
  selectedVenue.value = venue
  showVenueModal.value = true
}

function openPackageModal(pkg) {
  selectedPackage.value = pkg
  showPackageModal.value = true
}

function closeModal() {
  showRentModal.value = false
  showVenueModal.value = false
  showPackageModal.value = false
  selectedEquipment.value = null
  selectedVenue.value = null
  selectedPackage.value = null
  rentDays.value = 1
}

function submitRental() {
  if (!authStore.isLoggedIn) {
    showNotification('请先登录', 'warning')
    return
  }
  
  const result = equipmentStore.rentEquipment(
    authStore.currentUser.phone,
    selectedEquipment.value.id,
    rentDays.value,
    paymentMethod.value
  )
  
  showNotification(result.message, result.success ? 'success' : 'error')
  closeModal()
}

function submitVenueBooking() {
  if (!authStore.isLoggedIn) {
    showNotification('请先登录', 'warning')
    return
  }
  
  const result = equipmentStore.bookVenue(
    authStore.currentUser.phone,
    selectedVenue.value.id,
    venueDuration.value,
    paymentMethod.value
  )
  
  showNotification(result.message, result.success ? 'success' : 'error')
  closeModal()
}

function submitPackagePurchase() {
  if (!authStore.isLoggedIn) {
    showNotification('请先登录', 'warning')
    return
  }
  
  const result = equipmentStore.purchasePackage(
    authStore.currentUser.phone,
    selectedPackage.value.id,
    paymentMethod.value
  )
  
  showNotification(result.message, result.success ? 'success' : 'error')
  closeModal()
}

function confirmRental(rentalId) {
  const result = equipmentStore.confirmRental(rentalId)
  showNotification(result.message, result.success ? 'success' : 'error')
}

function completeRental(rentalId) {
  const result = equipmentStore.completeRental(rentalId)
  showNotification(result.message, result.success ? 'success' : 'error')
}

function cancelRental(rentalId) {
  const result = equipmentStore.cancelRental(rentalId)
  showNotification(result.message, result.success ? 'success' : 'error')
}

function showNotification(message, type) {
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message, type }
  }))
}
</script>

<style scoped>
.equipment-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 10px;
}

.page-header p {
  color: #999;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 20px;
  background: #333;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover,
.tab-btn.active {
  background: #ffd700;
  color: #000;
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  justify-content: center;
}

.filter-select {
  padding: 8px 16px;
  border-radius: 8px;
  background: #333;
  color: #fff;
  border: 1px solid #444;
}

.equipment-grid,
.venue-grid,
.package-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.equipment-card,
.venue-card,
.package-card {
  background: #222;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid #444;
  transition: transform 0.3s;
}

.equipment-card:hover,
.venue-card:hover,
.package-card:hover {
  transform: translateY(-5px);
}

.equipment-card.locked,
.venue-card.locked {
  opacity: 0.6;
}

.equipment-image,
.venue-image,
.package-image {
  font-size: 4rem;
  margin-bottom: 15px;
}

.equipment-card h3,
.venue-card h3,
.package-card h3 {
  margin-bottom: 10px;
  color: #ffd700;
}

.model,
.location,
.duration {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.specs,
.area {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.category {
  display: inline-block;
  padding: 4px 12px;
  background: #444;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-bottom: 15px;
}

.facilities {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  margin-bottom: 15px;
}

.facility-tag {
  padding: 4px 10px;
  background: #444;
  border-radius: 10px;
  font-size: 0.75rem;
}

.price-info {
  margin-bottom: 10px;
}

.daily-price,
.half-price,
.original-price {
  color: #666;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.vip-price,
.full-price {
  display: block;
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: bold;
}

.deposit {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 15px;
}

.description {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.rent-btn,
.book-btn,
.purchase-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #ffd700;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.rent-btn:hover,
.book-btn:hover,
.purchase-btn:hover {
  background: #ffb700;
}

.locked-text {
  display: block;
  color: #666;
  font-size: 0.9rem;
  padding: 12px;
}

.rentals-section {
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.rentals-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.rental-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #222;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #444;
}

.rental-info h4 {
  margin-bottom: 5px;
  color: #ffd700;
}

.rental-type,
.rental-date {
  color: #999;
  font-size: 0.85rem;
}

.rental-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
}

.rental-status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.rental-status.pending {
  background: #ff9800;
  color: #fff;
}

.rental-status.confirmed {
  background: #2196f3;
  color: #fff;
}

.rental-status.completed {
  background: #4caf50;
  color: #fff;
}

.rental-status.cancelled {
  background: #f44336;
  color: #fff;
}

.rental-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #4caf50;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s;
}

.action-btn:hover {
  background: #45a049;
}

.action-btn.cancel {
  background: #f44336;
}

.action-btn.cancel:hover {
  background: #da190b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #222;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  color: #ffd700;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 1.5rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #999;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background: #333;
  border: 1px solid #444;
  color: #fff;
}

.price-summary {
  background: #333;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.price-summary p {
  margin-bottom: 5px;
  color: #999;
}

.price-summary .total {
  font-size: 1.3rem;
  font-weight: bold;
  color: #ffd700;
  margin-top: 10px;
}

.modal-footer {
  text-align: right;
}

.submit-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  background: #ffd700;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #ffb700;
}
</style>
