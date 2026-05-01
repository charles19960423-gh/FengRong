<template>
  <header class="site-header">
    <div class="ticker-bar" v-if="showTicker">
      <div class="ticker-content">
        <span v-for="(item, index) in tickerItems" :key="index" class="ticker-item">
          <strong>江湖传闻</strong>{{ item }}
        </span>
      </div>
    </div>
    <div class="header-content">
      <h1 class="site-title">枫榕赏金酒馆</h1>
      <p class="site-subtitle">任务管理系统</p>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const showTicker = ref(true)
const tickerItems = [
  ' 新赛季江湖风云正式开启',
  ' 完成每日任务可获得双倍声望',
  ' 连续登录7天可获得限定成就',
  ' 排行榜前三名可获得传奇法器',
  ' 邀请好友加入可获得丰厚奖励'
]
</script>

<style scoped>
.site-header {
  text-align: center;
  padding: 60px 20px 40px;
  border-bottom: 4px double #8C2B1B;
  background: linear-gradient(180deg, rgba(140,43,27,0.3) 0%, transparent 100%);
  position: relative;
}

.ticker-bar {
  background: #2D1E17;
  border-bottom: 2px solid #D4AF37;
  color: #D4AF37;
  padding: 8px 0;
  overflow: hidden;
  white-space: nowrap;
  font-size: 0.8rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1100;
}

.ticker-content {
  display: inline-block;
  padding-left: 100%;
  animation: ticker 30s linear infinite;
}

@keyframes ticker {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-100%, 0, 0); }
}

.ticker-item {
  margin-right: 50px;
  font-style: italic;
}

.header-content {
  margin-top: 34px;
}

.site-title {
  font-size: 3.5rem;
  color: #D4AF37;
  letter-spacing: 15px;
  margin-bottom: 10px;
  text-shadow: 3px 3px 6px #000;
  font-family: 'Noto Serif SC', serif;
}

.site-subtitle {
  color: #a68b6d;
  font-size: 1.1rem;
  letter-spacing: 5px;
}
</style>

