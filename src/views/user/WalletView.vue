<template>
  <div class="wallet-page">
    <div class="page-header">
      <h1>资产管理</h1>
      <p>查看和管理你的资产</p>
    </div>

    <div class="assets-overview">
      <div class="asset-card coins">
        <div class="asset-icon"></div>
        <div class="asset-info">
          <span class="asset-label">金币</span>
          <span class="asset-value">{{ formatNumber(authStore.currentUser?.coins || 0) }}</span>
        </div>
        <button class="asset-action" @click="showRecharge = true">充值</button>
      </div>

      <div class="asset-card prestige">
        <div class="asset-icon"></div>
        <div class="asset-info">
          <span class="asset-label">声望</span>
          <span class="asset-value">{{ authStore.currentUser?.prestige || 0 }}</span>
        </div>
        <div class="prestige-bar">
          <div class="prestige-progress" :style="{ width: getPrestigeProgress() + '%' }"></div>
        </div>
        <span class="prestige-level">Lv.{{ authStore.currentUser?.level }}</span>
      </div>

      <div class="asset-card pearls">
        <div class="asset-icon"></div>
        <div class="asset-info">
          <span class="asset-label">淡水珍珠</span>
          <span class="asset-value">{{ authStore.currentUser?.pearls || 0 }}</span>
        </div>
        <button class="asset-action" @click="showExchange = true">兑换</button>
      </div>
    </div>

    <div class="quick-actions">
      <button class="quick-btn" @click="showRecharge = true">
        <span class="btn-icon"></span>
        <span>充值金币</span>
      </button>
      <button class="quick-btn" @click="showExchange = true">
        <span class="btn-icon"></span>
        <span>珍珠兑换</span>
      </button>
      <button class="quick-btn" @click="showTransfer = true">
        <span class="btn-icon"></span>
        <span>好友转账</span>
      </button>
      <button class="quick-btn" @click="showShop = true">
        <span class="btn-icon"></span>
        <span>兑换商城</span>
      </button>
      <button class="quick-btn" @click="showInventory = true">
        <span class="btn-icon"></span>
        <span>物品仓库</span>
      </button>
    </div>

    <div class="transactions-section">
      <div class="section-header">
        <h2> 交易记录</h2>
        <div class="filter-tabs">
          <button 
            v-for="filter in filters" 
            :key="filter.value"
            :class="{ active: selectedFilter === filter.value }"
            @click="selectedFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div class="transactions-list">
        <div 
          v-for="transaction in filteredTransactions" 
          :key="transaction.id"
          class="transaction-item"
          :class="transaction.type"
        >
          <div class="transaction-icon">{{ getTransactionIcon(transaction.type) }}</div>
          <div class="transaction-content">
            <div class="transaction-title">{{ transaction.title }}</div>
            <div class="transaction-time">{{ transaction.time }}</div>
          </div>
          <div class="transaction-amount" :class="transaction.amount >= 0 ? 'income' : 'expense'">
            {{ transaction.amount >= 0 ? '+' : '' }}{{ formatNumber(transaction.amount) }}
          </div>
        </div>
      </div>

      <div v-if="filteredTransactions.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>暂无交易记录</p>
      </div>
    </div>

    <div class="leaderboard-section">
      <h2>声望排行榜</h2>
      <div class="leaderboard-list">
        <div 
          v-for="(user, index) in leaderboard" 
          :key="index"
          class="leaderboard-item"
          :class="{ 'top-three': index < 3 }"
        >
          <div class="rank" :class="'rank-' + (index + 1)">
            {{ index === 0 ? '' : index === 1 ? '' : index === 2 ? '' : index + 1 }}
          </div>
          <div class="leader-avatar">{{ user.avatar }}</div>
          <div class="leader-info">
            <div class="leader-name">{{ user.nickname }}</div>
            <div class="leader-level">Lv.{{ user.level }}</div>
          </div>
          <div class="leader-score">
            <span class="score-value">{{ user.prestige }}</span>
            <span class="score-label">声望</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showRecharge" class="modal-overlay" @click.self="showRecharge = false">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="showRecharge = false"></button>
        <h3>充值金币</h3>
        <div class="recharge-options">
          <button 
            v-for="option in rechargeOptions" 
            :key="option.amount"
            :class="{ selected: selectedRecharge === option.amount }"
            @click="selectedRecharge = option.amount"
          >
            <span class="option-amount">{{ option.amount }}</span>
            <span class="option-price">{{ option.price }}</span>
          </button>
        </div>
        <button class="confirm-btn" @click="confirmRecharge">确认充值</button>
      </div>
    </div>

    <div v-if="showExchange" class="modal-overlay" @click.self="showExchange = false">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="showExchange = false"></button>
        <h3> 珍珠兑换</h3>
        <div class="exchange-info">
          <div class="exchange-rate">
            <span> 1珍珠 =  100金币</span>
          </div>
          <div class="exchange-input">
            <label>兑换数量</label>
            <input 
              v-model="exchangeAmount" 
              type="number" 
              :max="authStore.currentUser?.pearls || 0"
              min="1"
            />
            <span class="input-hint">当前珍珠: {{ authStore.currentUser?.pearls || 0 }}</span>
          </div>
          <div class="exchange-result">
            将获 <span class="result-value"> {{ exchangeAmount * 100 }}</span>
          </div>
        </div>
        <button class="confirm-btn" @click="confirmExchange">确认兑换</button>
      </div>
    </div>

    <div v-if="showTransfer" class="modal-overlay" @click.self="showTransfer = false">
      <div class="modal-content transfer-modal" @click.stop>
        <button class="close-btn" @click="showTransfer = false"></button>
        <h3> 好友转账</h3>
        <div class="transfer-info">
          <div class="transfer-balance">
            当前余额: <span class="balance-value"> {{ formatNumber(authStore.currentUser?.coins || 0) }}</span>
          </div>
          <div class="form-group">
            <label>选择好友</label>
            <div class="friends-list">
              <div 
                v-for="friend in friends" 
                :key="friend.phone"
                :class="{ selected: selectedFriend?.phone === friend.phone }"
                class="friend-item"
                @click="selectedFriend = friend"
              >
                <div class="friend-avatar">{{ friend.avatar }}</div>
                <div class="friend-info">
                  <div class="friend-name">{{ friend.nickname }}</div>
                  <div class="friend-level">Lv.{{ friend.level }}</div>
                </div>
              </div>
            </div>
            <div v-if="friends.length === 0" class="no-friends">
              <span>暂无好友，快去添加好友吧</span>
            </div>
          </div>
          <div class="form-group">
            <label>转账金额</label>
            <input 
              v-model="transferAmount" 
              type="number" 
              min="1"
              :max="authStore.currentUser?.coins || 0"
            />
            <span class="input-hint">最大可转 {{ formatNumber(authStore.currentUser?.coins || 0) }}</span>
          </div>
          <div class="form-group">
            <label>留言可选</label>
            <input 
              v-model="transferMessage" 
              type="text" 
              placeholder="输入留言..."
              maxlength="50"
            />
          </div>
        </div>
        <button 
          class="confirm-btn" 
          :disabled="!selectedFriend || !transferAmount"
          @click="confirmTransfer"
        >
          确认转账
        </button>
      </div>
    </div>

    <div v-if="showShop" class="modal-overlay shop-overlay" @click.self="showShop = false">
      <div class="modal-content shop-modal" @click.stop>
        <button class="close-btn" @click="showShop = false"></button>
        <h3> 兑换商城</h3>
        <div class="shop-tabs">
          <button 
            v-for="tab in shopTabs" 
            :key="tab.value"
            :class="{ active: selectedShopTab === tab.value }"
            @click="selectedShopTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="shop-items">
          <div 
            v-for="item in filteredShopItems" 
            :key="item.id"
            class="shop-item"
          >
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-desc">{{ item.description }}</div>
              <div class="item-reward">{{ item.reward }}</div>
            </div>
            <div class="item-price">
              <span class="price-value">{{ item.price }}</span>
              <span class="price-currency">{{ item.currency === 'coins' ? '金币' : '珍珠' }}</span>
            </div>
            <button 
              class="buy-btn"
              :disabled="!canBuy(item)"
              @click="buyItem(item)"
            >
              {{ canBuy(item) ? '兑换' : '余额不足' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showInventory" class="modal-overlay inventory-overlay" @click.self="showInventory = false">
      <div class="modal-content inventory-modal" @click.stop>
        <button class="close-btn" @click="showInventory = false"></button>
        <div class="inventory-header">
          <h3> 物品仓库</h3>
          <div class="inventory-capacity">
            <span>容量: {{ inventoryStore.capacityUsed }} / {{ inventoryStore.maxCapacity }}</span>
            <div class="capacity-bar">
              <div class="capacity-fill" :style="{ width: inventoryStore.capacityPercent + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="inventory-tabs">
          <button 
            v-for="tab in inventoryStore.itemCategories" 
            :key="tab.id"
            :class="{ active: selectedInventoryTab === tab.id }"
            @click="selectedInventoryTab = tab.id"
          >
            <span>{{ tab.icon }}</span>
            <span>{{ tab.name }}</span>
          </button>
        </div>
        <div class="inventory-items">
          <div 
            v-for="item in (inventoryStore.filteredItems[selectedInventoryTab]?.items || [])" 
            :key="item.id"
            class="inventory-item"
          >
            <div class="inventory-item-icon">{{ item.icon }}</div>
            <div class="inventory-item-info">
              <div class="inventory-item-name">{{ item.name }}</div>
              <div class="inventory-item-desc">{{ item.description }}</div>
              <div class="inventory-item-count">数量: {{ item.count }}</div>
            </div>
            <div class="inventory-item-actions">
              <button class="action-btn use-btn" @click="useInventoryItem(item)">使用</button>
              <button class="action-btn sell-btn" @click="sellInventoryItem(item)">出售</button>
            </div>
          </div>
          <div v-if="(inventoryStore.filteredItems[selectedInventoryTab]?.items || []).length === 0" class="empty-inventory">
            <span></span>
            <p>该分类暂无物品</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores'
import { useTransactionStore } from '@/stores'
import { useInventoryStore } from '@/stores'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const inventoryStore = useInventoryStore()

const selectedFilter = ref('all')
const showRecharge = ref(false)
const showExchange = ref(false)
const showTransfer = ref(false)
const showShop = ref(false)
const showInventory = ref(false)
const selectedRecharge = ref(1000)
const exchangeAmount = ref(1)
const selectedFriend = ref(null)
const transferAmount = ref('')
const transferMessage = ref('')
const selectedShopTab = ref('coins')
const selectedInventoryTab = ref('all')

onMounted(() => {
  transactionStore.loadFromStorage()
  inventoryStore.loadFromStorage()
})

const filters = [
  { label: '全部', value: 'all' },
  { label: '收入', value: 'income' },
  { label: '支出', value: 'expense' }
]

const shopTabs = [
  { label: '金币兑换', value: 'coins' },
  { label: '珍珠兑换', value: 'pearls' }
]

const rechargeOptions = [
  { amount: 1000, price: '10' },
  { amount: 5000, price: '50' },
  { amount: 10000, price: '100' },
  { amount: 50000, price: '500' }
]

const friends = computed(() => [
  { phone: '13800138003', nickname: '赏金猎人', avatar: '', level: 32 },
  { phone: '13800138001', nickname: '馆主大人', avatar: '', level: 50 },
  { phone: '13800138004', nickname: '光明法师', avatar: '', level: 28 }
])

const shopItems = [
  { 
    id: 'item1', 
    name: '初级体力药水', 
    icon: '', 
    description: '恢复50点体力',
    reward: '体力 +50',
    price: 100,
    currency: 'coins'
  },
  { 
    id: 'item2', 
    name: '中级体力药水', 
    icon: '', 
    description: '恢复100点体力',
    reward: '体力 +100',
    price: 250,
    currency: 'coins'
  },
  { 
    id: 'item3', 
    name: '经验卷轴', 
    icon: '', 
    description: '获得500点经验',
    reward: '经验 +500',
    price: 500,
    currency: 'coins'
  },
  { 
    id: 'item4', 
    name: '声望令牌', 
    icon: '', 
    description: '获得50点声望',
    reward: '声望 +50',
    price: 800,
    currency: 'coins'
  },
  { 
    id: 'item5', 
    name: '珍珠袋', 
    icon: '', 
    description: '获得5颗珍珠',
    reward: '珍珠 +5',
    price: 500,
    currency: 'coins'
  },
  { 
    id: 'item6', 
    name: '神秘宝箱', 
    icon: '', 
    description: '随机获得珍贵物品',
    reward: '随机奖励',
    price: 1500,
    currency: 'coins'
  },
  { 
    id: 'pearl1', 
    name: '高级体力药水', 
    icon: '', 
    description: '恢复500点体力',
    reward: '体力 +500',
    price: 5,
    currency: 'pearls'
  },
  { 
    id: 'pearl2', 
    name: '传说经验卷轴', 
    icon: '', 
    description: '获得5000点经验',
    reward: '经验 +5000',
    price: 10,
    currency: 'pearls'
  },
  { 
    id: 'pearl3', 
    name: '至尊声望令牌', 
    icon: '', 
    description: '获得500点声望',
    reward: '声望 +500',
    price: 15,
    currency: 'pearls'
  },
  { 
    id: 'pearl4', 
    name: '金色宝箱', 
    icon: '', 
    description: '随机获得稀有物品',
    reward: '稀有奖励',
    price: 20,
    currency: 'pearls'
  }
]

const filteredShopItems = computed(() => {
  return shopItems.filter(item => item.currency === selectedShopTab.value)
})

const filteredTransactions = computed(() => {
  return transactionStore.getTransactionsByType(selectedFilter.value)
})

const leaderboard = computed(() => [
  { nickname: '馆主大人', avatar: '', prestige: 1500, level: 50 },
  { nickname: '赏金猎人', avatar: '', prestige: 890, level: 32 },
  { nickname: '江湖游侠', avatar: '', prestige: 650, level: 25 },
  { nickname: '光明法师', avatar: '', prestige: 520, level: 28 },
  { nickname: '暗夜刺客', avatar: '', prestige: 480, level: 24 }
])

function getPrestigeProgress() {
  const prestige = authStore.currentUser?.prestige || 0
  const nextLevel = Math.floor(prestige / 200) + 1
  const current = prestige % 200
  return (current / 200) * 100
}

function getTransactionIcon(category) {
  return transactionStore.getTransactionIcon(category)
}

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

function confirmRecharge() {
  authStore.addCoins(selectedRecharge.value)
  transactionStore.addTransaction('recharge', '充值到账', selectedRecharge.value)
  
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: `充值 ${selectedRecharge.value} 金币成功`, type: 'success' }
  }))
  showRecharge.value = false
}

function confirmExchange() {
  if (exchangeAmount.value <= 0 || exchangeAmount.value > (authStore.currentUser?.pearls || 0)) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '请输入有效的兑换数量', type: 'warning' }
    }))
    return
  }
  
  authStore.deductPearls(exchangeAmount.value)
  authStore.addCoins(exchangeAmount.value * 100)
  transactionStore.addTransaction('exchange', '珍珠兑换', exchangeAmount.value * 100)
  
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: ` 兑换成功获${exchangeAmount.value * 100} 金币`, type: 'success' }
  }))
  showExchange.value = false
  exchangeAmount.value = 1
}

function confirmTransfer() {
  if (!selectedFriend.value) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '请选择要转账的好友', type: 'warning' }
    }))
    return
  }
  
  const amount = parseInt(transferAmount.value)
  if (!amount || amount <= 0 || amount > (authStore.currentUser?.coins || 0)) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '请输入有效的转账金额', type: 'warning' }
    }))
    return
  }
  
  authStore.deductCoins(amount)
  transactionStore.addTransaction('transfer', `转账{selectedFriend.value.nickname}`, -amount)
  
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { message: ` 成功转账 ${amount} 金币${selectedFriend.value.nickname}`, type: 'success' }
  }))
  showTransfer.value = false
  selectedFriend.value = null
  transferAmount.value = ''
  transferMessage.value = ''
}

function canBuy(item) {
  if (item.currency === 'coins') {
    return (authStore.currentUser?.coins || 0) >= item.price
  } else {
    return (authStore.currentUser?.pearls || 0) >= item.price
  }
}

function buyItem(item) {
  if (!canBuy(item)) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: '余额不足无法兑换', type: 'warning' }
    }))
    return
  }
  
  const amount = item.currency === 'coins' ? -item.price : -item.price * 100
  
  if (item.currency === 'coins') {
    authStore.deductCoins(item.price)
  } else {
    authStore.deductPearls(item.price)
  }
  
  const itemIdMap = {
    'item1': 'health_potion_1',
    'item2': 'health_potion_2',
    'item3': 'exp_scroll',
    'item4': 'prestige_token',
    'item5': 'pearl_bag',
    'item6': 'gold_box',
    'pearl1': 'health_potion_3',
    'pearl2': 'exp_book',
    'pearl3': 'prestige_token_2',
    'pearl4': 'rare_box'
  }
  
  const inventoryItemId = itemIdMap[item.id]
  if (inventoryItemId) {
    const result = inventoryStore.addItem(inventoryItemId)
    if (!result.success) {
      window.dispatchEvent(new CustomEvent('notification', {
        detail: { message: result.message, type: 'warning' }
      }))
      return
    }
  }
  
  transactionStore.addTransaction('buy', `兑换${item.name}`, amount)
  
  if (item.reward.includes('体力')) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: ` 成功兑换 ${item.name}?{item.reward}`, type: 'success' }
    }))
  } else if (item.reward.includes('经验')) {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: ` 成功兑换 ${item.name}?{item.reward}`, type: 'success' }
    }))
  } else if (item.reward.includes('声望')) {
    const prestige = parseInt(item.reward.replace('声望 +', ''))
    authStore.addPrestige(prestige)
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: ` 成功兑换 ${item.name}?{item.reward}`, type: 'success' }
    }))
  } else if (item.reward.includes('珍珠')) {
    const pearls = parseInt(item.reward.replace('珍珠 +', ''))
    authStore.addPearls(pearls)
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: ` 成功兑换 ${item.name}?{item.reward}`, type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: ` 成功兑换 ${item.name}?{item.reward}`, type: 'success' }
    }))
  }
}

function useInventoryItem(item) {
  inventoryStore.useItem(item.id, authStore)
}

function sellInventoryItem(item) {
  const result = inventoryStore.sellItem(item.id, authStore)
  if (result.success) {
    transactionStore.addTransaction('buy', `出售${item.name}`, parseInt(result.message.match(/\d+/)[0]))
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message: result.message, type: 'success' }
    }))
  }
}
</script>

<style scoped>
.wallet-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin: 30px 0;
}

.page-header h1 {
  color: #D4AF37;
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.page-header p {
  color: #888;
}

.assets-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.asset-card {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 15px;
  padding: 25px;
  border-left: 4px solid;
  position: relative;
}

.asset-card.coins { border-color: #D4AF37; }
.asset-card.prestige { border-color: #f39c12; }
.asset-card.pearls { border-color: #00bcd4; }

.asset-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.asset-info {
  margin-bottom: 15px;
}

.asset-label {
  display: block;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.asset-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #D4AF37;
}

.asset-action {
  padding: 8px 16px;
  background: rgba(140,43,27,0.5);
  border: none;
  border-radius: 5px;
  color: #D4C39E;
  cursor: pointer;
  font-size: 0.9rem;
}

.asset-action:hover {
  background: rgba(140,43,27,0.7);
}

.prestige-bar {
  height: 8px;
  background: #333;
  border-radius: 4px;
  margin-bottom: 10px;
  overflow: hidden;
}

.prestige-progress {
  height: 100%;
  background: linear-gradient(90deg, #f39c12, #D4AF37);
  transition: width 0.3s;
}

.prestige-level {
  color: #f39c12;
  font-weight: bold;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.quick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border: 1px solid #444;
  border-radius: 12px;
  color: #D4C39E;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  border-color: #8C2B1B;
  background: rgba(140,43,27,0.2);
}

.btn-icon {
  font-size: 1.5rem;
}

.transactions-section {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-header h2 {
  color: #D4AF37;
  margin: 0;
}

.filter-tabs {
  display: flex;
  gap: 10px;
}

.filter-tabs button {
  padding: 8px 15px;
  background: #333;
  border: none;
  border-radius: 5px;
  color: #888;
  cursor: pointer;
}

.filter-tabs button.active {
  background: #8C2B1B;
  color: white;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
}

.transaction-icon {
  font-size: 1.5rem;
}

.transaction-content {
  flex: 1;
}

.transaction-title {
  color: #D4C39E;
  font-weight: 500;
}

.transaction-time {
  color: #666;
  font-size: 0.85rem;
}

.transaction-amount {
  font-weight: bold;
  font-size: 1.1rem;
}

.transaction-amount.income {
  color: #2ecc71;
}

.transaction-amount.expense {
  color: #e74c3c;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.empty-state p {
  color: #888;
}

.leaderboard-section {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border-radius: 15px;
  padding: 25px;
}

.leaderboard-section h2 {
  color: #D4AF37;
  margin: 0 0 20px 0;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
}

.leaderboard-item.top-three {
  background: rgba(212,175,55,0.1);
  border: 1px solid rgba(212,175,55,0.3);
}

.rank {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
}

.rank-1, .rank-2, .rank-3 {
  font-size: 1.5rem;
}

.leader-avatar {
  font-size: 2rem;
}

.leader-info {
  flex: 1;
}

.leader-name {
  color: #D4C39E;
  font-weight: bold;
}

.leader-level {
  color: #888;
  font-size: 0.9rem;
}

.leader-score {
  text-align: right;
}

.score-value {
  display: block;
  color: #D4AF37;
  font-weight: bold;
  font-size: 1.2rem;
}

.score-label {
  display: block;
  color: #888;
  font-size: 0.85rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.shop-overlay {
  overflow-y: auto;
}

.modal-content {
  background: linear-gradient(135deg, #2D1E17 0%, #1A120B 100%);
  border: 2px solid #8C2B1B;
  border-radius: 15px;
  width: 100%;
  max-width: 400px;
  padding: 30px;
  position: relative;
}

.shop-modal {
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-content h3 {
  color: #D4AF37;
  margin: 0 0 20px 0;
}

.recharge-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.recharge-options button {
  padding: 15px;
  background: rgba(0,0,0,0.2);
  border: 2px solid #444;
  border-radius: 10px;
  color: #D4C39E;
  cursor: pointer;
  transition: all 0.2s;
}

.recharge-options button.selected {
  border-color: #D4AF37;
  background: rgba(212,175,55,0.2);
}

.option-amount {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #D4AF37;
}

.option-price {
  display: block;
  font-size: 0.9rem;
  color: #888;
}

.exchange-info, .transfer-info {
  margin-bottom: 20px;
}

.exchange-rate, .transfer-balance {
  text-align: center;
  padding: 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.balance-value {
  color: #D4AF37;
  font-weight: bold;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  color: #D4C39E;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: #1A120B;
  border: 1px solid #444;
  border-radius: 8px;
  color: #D4C39E;
  font-size: 1rem;
  box-sizing: border-box;
}

.input-hint {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
}

.exchange-result {
  text-align: center;
  padding: 15px;
  background: rgba(46,204,113,0.1);
  border-radius: 10px;
}

.result-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2ecc71;
}

.confirm-btn {
  width: 100%;
  padding: 12px;
  background: #D4AF37;
  border: none;
  border-radius: 8px;
  color: #1A120B;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.confirm-btn:hover:not(:disabled) {
  background: #B89500;
}

.confirm-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.friends-list {
  max-height: 200px;
  overflow-y: auto;
  background: #1A120B;
  border: 1px solid #444;
  border-radius: 8px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: background 0.2s;
}

.friend-item:last-child {
  border-bottom: none;
}

.friend-item:hover, .friend-item.selected {
  background: rgba(140,43,27,0.3);
}

.friend-item.selected {
  border-left: 3px solid #D4AF37;
}

.friend-avatar {
  font-size: 1.5rem;
}

.friend-name {
  color: #D4C39E;
  font-weight: bold;
}

.friend-level {
  color: #888;
  font-size: 0.85rem;
}

.no-friends {
  padding: 20px;
  text-align: center;
  color: #888;
  background: #1A120B;
  border: 1px solid #444;
  border-radius: 8px;
}

.shop-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.shop-tabs button {
  padding: 10px 20px;
  background: #333;
  border: none;
  border-radius: 5px;
  color: #888;
  cursor: pointer;
}

.shop-tabs button.active {
  background: #8C2B1B;
  color: white;
}

.shop-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.shop-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
}

.item-icon {
  font-size: 2rem;
}

.item-info {
  flex: 1;
}

.item-name {
  color: #D4AF37;
  font-weight: bold;
  margin-bottom: 5px;
}

.item-desc {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.item-reward {
  color: #2ecc71;
  font-size: 0.85rem;
}

.item-price {
  text-align: right;
}

.price-value {
  display: block;
  color: #D4AF37;
  font-weight: bold;
  font-size: 1.2rem;
}

.price-currency {
  display: block;
  color: #888;
  font-size: 0.9rem;
}

.buy-btn {
  padding: 8px 16px;
  background: #D4AF37;
  border: none;
  border-radius: 5px;
  color: #1A120B;
  font-weight: bold;
  cursor: pointer;
}

.buy-btn:hover:not(:disabled) {
  background: #B89500;
}

.buy-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.inventory-overlay {
  overflow-y: auto;
}

.inventory-modal {
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;
}

.inventory-header h3 {
  margin: 0;
}

.inventory-capacity {
  text-align: right;
}

.inventory-capacity span {
  display: block;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.capacity-bar {
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
  width: 150px;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #27ae60);
  transition: width 0.3s;
}

.inventory-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.inventory-tabs button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background: #333;
  border: none;
  border-radius: 5px;
  color: #888;
  cursor: pointer;
}

.inventory-tabs button.active {
  background: #8C2B1B;
  color: white;
}

.inventory-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.inventory-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
}

.inventory-item-icon {
  font-size: 2rem;
}

.inventory-item-info {
  flex: 1;
}

.inventory-item-name {
  color: #D4AF37;
  font-weight: bold;
  margin-bottom: 5px;
}

.inventory-item-desc {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.inventory-item-count {
  color: #2ecc71;
  font-size: 0.85rem;
}

.inventory-item-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.use-btn {
  background: #2ecc71;
  color: #1A120B;
}

.use-btn:hover {
  background: #27ae60;
}

.sell-btn {
  background: #e74c3c;
  color: white;
}

.sell-btn:hover {
  background: #c0392b;
}

.empty-inventory {
  text-align: center;
  padding: 40px;
  color: #888;
}

.empty-inventory span {
  display: block;
  font-size: 3rem;
  margin-bottom: 10px;
}
</style>
