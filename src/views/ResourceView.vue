<template>
  <div class="resource-page">
    <div class="page-header">
      <h1>📚 江湖秘典</h1>
      <p>传媒行业资料库，分享PDF、链接、联系方式等资源</p>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ resourceStore.resourceStats.total }}</span>
        <span class="stat-label">资料总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ resourceStore.resourceStats.totalDownloads }}</span>
        <span class="stat-label">下载次数</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ resourceStore.resourceStats.totalLikes }}</span>
        <span class="stat-label">获赞次数</span>
      </div>
    </div>

    <div class="search-section">
      <div class="search-bar">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="🔍 搜索资料名称、描述或标签..."
          @input="handleSearch"
        />
      </div>
      <button class="upload-btn" @click="showUploadModal = true">+ 上传资料</button>
    </div>

    <div class="category-tabs">
      <button
        v-for="(cat, key) in resourceStore.resourceCategories"
        :key="key"
        :class="{ active: selectedCategory === key }"
        @click="selectedCategory = key"
      >
        {{ cat.icon }} {{ cat.label }}
      </button>
    </div>

    <div class="view-tabs">
      <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">📱 网格</button>
      <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">📋 列表</button>
    </div>

    <div v-if="viewMode === 'grid'" class="resource-grid">
      <div
        v-for="resource in filteredResources"
        :key="resource.id"
        class="resource-card"
        @click="viewResource(resource)"
      >
        <div class="card-header">
          <span class="type-badge" :class="resource.type">
            {{ getTypeLabel(resource.type) }}
          </span>
          <span class="category-badge">
            {{ resourceStore.getCategoryIcon(resource.category) }} {{ resourceStore.getCategoryLabel(resource.category) }}
          </span>
        </div>
        <h3>{{ resource.title }}</h3>
        <p class="card-description">{{ resource.description }}</p>
        <div class="card-tags">
          <span v-for="tag in resource.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
        <div class="card-footer">
          <span class="uploader">👤 {{ resource.uploaderName }}</span>
          <span class="upload-time">📅 {{ resource.uploadTime }}</span>
        </div>
        <div class="card-stats">
          <span>⬇️ {{ resource.downloads }}</span>
          <span>❤️ {{ resource.likes }}</span>
        </div>
      </div>
    </div>

    <div v-else class="resource-list">
      <div
        v-for="resource in filteredResources"
        :key="resource.id"
        class="resource-item"
        @click="viewResource(resource)"
      >
        <div class="item-icon">{{ getTypeIcon(resource.type) }}</div>
        <div class="item-content">
          <h3>{{ resource.title }}</h3>
          <p>{{ resource.description }}</p>
          <div class="item-meta">
            <span class="category">{{ resourceStore.getCategoryIcon(resource.category) }} {{ resourceStore.getCategoryLabel(resource.category) }}</span>
            <span class="tags">
              <span v-for="tag in resource.tags" :key="tag">#{{ tag }}</span>
            </span>
            <span class="uploader">👤 {{ resource.uploaderName }}</span>
          </div>
        </div>
        <div class="item-stats">
          <span>⬇️ {{ resource.downloads }}</span>
          <span>❤️ {{ resource.likes }}</span>
        </div>
      </div>
    </div>

    <div v-if="filteredResources.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>暂无相关资料</p>
      <button class="empty-action" @click="showUploadModal = true">成为第一个上传者</button>
    </div>

    <div v-if="showUploadModal" class="modal-overlay" @click.self="showUploadModal = false">
      <div class="modal-content">
        <h2>上传新资料</h2>
        <form @submit.prevent="uploadResource">
          <div class="form-group">
            <label>资料标题</label>
            <input v-model="newResource.title" type="text" placeholder="如：2024年短视频营销趋势报告" required />
          </div>
          <div class="form-group">
            <label>资料类型</label>
            <select v-model="newResource.type" required>
              <option value="pdf">📄 PDF文档</option>
              <option value="link">🔗 外部链接</option>
              <option value="contact">📞 联系方式</option>
              <option value="portfolio">🖼️ 作品集</option>
            </select>
          </div>
          <div class="form-group">
            <label>行业分类</label>
            <select v-model="newResource.category" required>
              <option v-for="(cat, key) in resourceStore.resourceCategories" :key="key" :value="key">
                {{ cat.icon }} {{ cat.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>详细描述</label>
            <textarea v-model="newResource.description" placeholder="描述资料内容..." rows="3" required></textarea>
          </div>
          <div v-if="newResource.type === 'pdf' || newResource.type === 'link'" class="form-group">
            <label>链接地址</label>
            <input v-model="newResource.url" type="url" placeholder="https://..." required />
          </div>
          <div v-if="newResource.type === 'contact'" class="form-row">
            <div class="form-group">
              <label>联系人</label>
              <input v-model="newResource.contactName" type="text" placeholder="姓名" />
            </div>
            <div class="form-group">
              <label>电话</label>
              <input v-model="newResource.contactPhone" type="tel" placeholder="手机号" />
            </div>
          </div>
          <div v-if="newResource.type === 'contact'" class="form-group">
            <label>微信</label>
            <input v-model="newResource.contactWechat" type="text" placeholder="微信号" />
          </div>
          <div class="form-group">
            <label>标签 (用逗号分隔)</label>
            <input v-model="tagsInput" type="text" placeholder="如：短视频,营销,趋势" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showUploadModal = false">取消</button>
            <button type="submit" class="btn-submit">上传</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-content detail-modal">
        <h2>{{ selectedResource?.title }}</h2>
        <div class="detail-meta">
          <span class="category">
            {{ resourceStore.getCategoryIcon(selectedResource?.category) }} {{ resourceStore.getCategoryLabel(selectedResource?.category) }}
          </span>
          <span class="type">{{ getTypeLabel(selectedResource?.type) }}</span>
        </div>
        <p class="detail-description">{{ selectedResource?.description }}</p>
        <div class="detail-info">
          <div class="info-row">
            <span>上传者:</span>
            <span>{{ selectedResource?.uploaderName }}</span>
          </div>
          <div class="info-row">
            <span>上传时间:</span>
            <span>{{ selectedResource?.uploadTime }}</span>
          </div>
          <div class="info-row">
            <span>下载次数:</span>
            <span>{{ selectedResource?.downloads }}</span>
          </div>
          <div class="info-row">
            <span>获赞:</span>
            <span>{{ selectedResource?.likes }}</span>
          </div>
        </div>
        <div class="detail-tags">
          <span v-for="tag in selectedResource?.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
        <div v-if="selectedResource?.type === 'contact'" class="contact-info">
          <h4>联系方式</h4>
          <p>📞 {{ selectedResource?.contactPhone || '暂无' }}</p>
          <p>📱 {{ selectedResource?.contactWechat || '暂无' }}</p>
        </div>
        <div class="detail-actions">
          <button class="action-btn secondary" @click="showDetailModal = false">关闭</button>
          <button class="action-btn primary" @click="handleDownload">⬇️ {{ selectedResource?.type === 'pdf' ? '下载' : '访问' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useResourceStore } from '../stores/resource'
import { useAuthStore } from '../stores/auth'

const resourceStore = useResourceStore()
const authStore = useAuthStore()

const searchKeyword = ref('')
const selectedCategory = ref('all')
const viewMode = ref('grid')
const showUploadModal = ref(false)
const showDetailModal = ref(false)
const selectedResource = ref(null)
const tagsInput = ref('')

const newResource = ref({
  title: '',
  type: 'pdf',
  category: 'other',
  description: '',
  url: '',
  contactName: '',
  contactPhone: '',
  contactWechat: ''
})

const filteredResources = computed(() => {
  let resources = resourceStore.resources.filter(r => r.isPublic)

  if (selectedCategory.value !== 'all') {
    resources = resources.filter(r => r.category === selectedCategory.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    resources = resources.filter(r =>
      r.title.toLowerCase().includes(keyword) ||
      r.description.toLowerCase().includes(keyword) ||
      r.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  return resources
})

function getTypeLabel(type) {
  const types = {
    pdf: '📄 PDF',
    link: '🔗 链接',
    contact: '📞 联系',
    portfolio: '🖼️ 作品'
  }
  return types[type] || type
}

function getTypeIcon(type) {
  const icons = {
    pdf: '📄',
    link: '🔗',
    contact: '📞',
    portfolio: '🖼️'
  }
  return icons[type] || '📦'
}

function handleSearch() {
}

function viewResource(resource) {
  selectedResource.value = resource
  showDetailModal.value = true
}

function handleDownload() {
  if (selectedResource.value) {
    resourceStore.incrementDownloads(selectedResource.value.id)
    if (selectedResource.value.url) {
      window.open(selectedResource.value.url, '_blank')
    }
    showDetailModal.value = false
  }
}

function uploadResource() {
  if (!authStore.isLoggedIn) {
    alert('请先登录')
    return
  }

  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t)

  resourceStore.addResource({
    ...newResource.value,
    tags,
    uploaderId: authStore.currentUser.phone,
    uploaderName: authStore.currentUser.nickname || authStore.currentUser.companyName
  })

  showUploadModal.value = false
  newResource.value = {
    title: '',
    type: 'pdf',
    category: 'other',
    description: '',
    url: '',
    contactName: '',
    contactPhone: '',
    contactWechat: ''
  }
  tagsInput.value = ''
}

onMounted(() => {
  resourceStore.loadResources()
})
</script>

<style scoped>
.resource-page {
  max-width: 1200px;
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

.search-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-bar {
  flex: 1;
}

.search-bar input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
}

.upload-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.category-tabs button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tabs button.active {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

.view-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.view-tabs button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.view-tabs button.active {
  background: #1f2937;
  color: white;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.resource-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: white;
}

.type-badge.pdf { background: #ef4444; }
.type-badge.link { background: #3b82f6; }
.type-badge.contact { background: #10b981; }
.type-badge.portfolio { background: #f59e0b; }

.category-badge {
  font-size: 0.875rem;
  color: #6b7280;
}

.resource-card h3 {
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 8px;
}

.card-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  padding: 2px 8px;
  background: #f3f4f6;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #6b7280;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 8px;
}

.card-stats {
  display: flex;
  gap: 16px;
  font-size: 0.875rem;
  color: #6b7280;
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resource-item {
  display: flex;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s;
}

.resource-item:hover {
  transform: translateX(4px);
}

.item-icon {
  font-size: 2.5rem;
  width: 60px;
  text-align: center;
}

.item-content {
  flex: 1;
}

.item-content h3 {
  font-size: 1.125rem;
  color: #1f2937;
  margin-bottom: 8px;
}

.item-content p {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: #9ca3af;
}

.item-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.875rem;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-action {
  margin-top: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
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

.detail-modal {
  max-width: 600px;
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #1f2937;
}

.detail-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
}

.detail-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.contact-info {
  background: #f3f4f6;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.contact-info h4 {
  margin-bottom: 12px;
}

.detail-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #374151;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-cancel, .btn-submit {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-cancel {
  background: white;
  border: 1px solid #d1d5db;
}

.btn-submit {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  color: white;
  border: none;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.action-btn.secondary {
  background: white;
  border: 1px solid #d1d5db;
}

.action-btn.primary {
  background: #8b5cf6;
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .search-section {
    flex-direction: column;
  }

  .stats-bar {
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>
