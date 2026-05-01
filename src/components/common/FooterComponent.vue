<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>枫榕赏金酒馆</h3>
        <p>江湖中最可靠的任务发布与管理平台</p>
      </div>
      <div class="footer-section">
        <h4>快速链接</h4>
        <ul>
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/achievements">成就系统</router-link></li>
          <li><router-link to="/tasks">任务中心</router-link></li>
          <li><router-link to="/bounty">赏金猎人</router-link></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>关于我们</h4>
        <p>我们致力于为江湖侠客提供最优质的任务管理体验<br>从揭榜到完成每一步都有我们的陪伴</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 枫榕赏金酒馆 | 江湖版本 v1.0</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.site-footer {
  background: #1A120B;
  color: #D4C39E;
  padding: 40px 20px;
  border-top: 4px double #8C2B1B;
  margin-top: 50px;
}

.footer-content {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.footer-section h3,
.footer-section h4 {
  color: #D4AF37;
  margin-bottom: 15px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 8px;
}

.footer-section a {
  color: #D4C39E;
  text-decoration: none;
}

.footer-section a:hover {
  color: #D4AF37;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #333;
  font-size: 0.9rem;
  color: #888;
}
</style>

