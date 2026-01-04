<template>
  <div class="experience-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">经历库 & 结构化</h1>
      <p class="page-subtitle">将一段琐碎的实习或项目经历，通过 AI 转化为标准的 STAR 模式简历描述。</p>
    </div>

    <!-- Main Content -->
    <div class="experience-content">
      <!-- Input Section -->
      <div class="input-section card">
        <div class="input-header">
          <h3>原始经历描述</h3>
          <span class="char-hint">建议输入 100-500 字</span>
        </div>
        <textarea 
          v-model="rawExperience"
          class="experience-input textarea"
          placeholder="例如：我去年暑假在一家公司实习，用React做了个后台系统，还修了一些Bug，速度变快了点..."
          rows="8"
        ></textarea>
        <div class="input-actions">
          <button 
            class="btn btn-primary parse-btn" 
            :disabled="!rawExperience.trim() || isProcessing"
            @click="parseExperience"
          >
            <span v-if="isProcessing" class="loading-icon">⟳</span>
            <span v-else>✨</span>
            {{ isProcessing ? '解析中...' : 'AI 结构化解析' }}
          </button>
          <button class="btn btn-icon btn-secondary" @click="resetInput" title="重置">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Result Section -->
      <div class="result-section card">
        <div v-if="!parsedResult" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/>
            </svg>
          </div>
          <p class="empty-text">在左侧输入你的经历，AI 将为你重写</p>
        </div>
        <div v-else class="parsed-result">
          <div class="result-header">
            <h3>STAR 结构化结果</h3>
            <button class="btn btn-sm btn-secondary" @click="saveExperience">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              保存
            </button>
          </div>
          <div class="star-content">
            <div class="star-item">
              <span class="star-label">S - 情境</span>
              <p class="star-text">{{ parsedResult.situation }}</p>
            </div>
            <div class="star-item">
              <span class="star-label">T - 任务</span>
              <p class="star-text">{{ parsedResult.task }}</p>
            </div>
            <div class="star-item">
              <span class="star-label">A - 行动</span>
              <p class="star-text">{{ parsedResult.action }}</p>
            </div>
            <div class="star-item">
              <span class="star-label">R - 结果</span>
              <p class="star-text">{{ parsedResult.result }}</p>
            </div>
          </div>
          <div class="optimized-desc">
            <h4>优化后的简历描述</h4>
            <p class="optimized-text">{{ parsedResult.optimized }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Saved Experiences -->
    <div class="saved-section">
      <h2 class="section-title">已保存的经历 ({{ savedExperiences.length }})</h2>
      <div v-if="savedExperiences.length === 0" class="empty-saved card">
        <p class="empty-text">暂无保存的经历，完成结构化后可以保存到库中</p>
      </div>
      <div v-else class="saved-list">
        <div v-for="exp in savedExperiences" :key="exp.id" class="saved-card card">
          <div class="saved-header">
            <span class="saved-date">{{ formatDate(exp.createdAt) }}</span>
            <button class="delete-btn" @click="deleteExperience(exp.id)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
          <p class="saved-content">{{ exp.optimized }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useExperienceStore } from '../stores/experience'

const experienceStore = useExperienceStore()
const savedExperiences = computed(() => experienceStore.savedExperiences)

const rawExperience = ref('')
const parsedResult = ref(null)
const isProcessing = ref(false)

// Mock AI parsing function
const parseExperience = async () => {
  if (!rawExperience.value.trim()) return
  
  isProcessing.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const input = rawExperience.value
  parsedResult.value = {
    situation: `在${input.includes('实习') ? '暑期实习' : '项目开发'}期间，团队面临${input.includes('后台') ? '后台管理系统' : '产品功能'}开发的需求，需要在有限时间内完成交付。`,
    task: `负责${input.includes('React') ? '基于 React 技术栈' : '核心模块'}的开发工作，需要确保代码质量并优化系统性能。`,
    action: `深入分析业务需求，采用组件化开发模式，${input.includes('Bug') ? '主动排查并修复了多个关键 Bug' : '优化了代码架构'}，并进行了性能调优。`,
    result: `成功交付项目，${input.includes('速度') ? '系统响应速度提升 40%' : '得到团队认可'}，获得导师好评，积累了宝贵的实战经验。`,
    optimized: `${input.includes('实习') ? '暑期实习期间' : '项目期间'}，独立负责${input.includes('React') ? 'React 技术栈' : '核心模块'}的${input.includes('后台') ? '后台管理系统' : '产品功能'}开发。通过组件化架构设计和代码优化，${input.includes('Bug') ? '修复 10+ 个关键 Bug' : '提升了代码可维护性'}，${input.includes('速度') ? '使系统响应速度提升 40%' : '按时完成交付'}，获得团队一致好评。`
  }
  
  isProcessing.value = false
}

const resetInput = () => {
  rawExperience.value = ''
  parsedResult.value = null
}

const saveExperience = () => {
  if (parsedResult.value) {
    experienceStore.addExperience({
      raw: rawExperience.value,
      ...parsedResult.value
    })
    resetInput()
  }
}

const deleteExperience = (id) => {
  experienceStore.removeExperience(id)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.experience-page {
  max-width: 1100px;
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Page Header */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

/* Main Content */
.experience-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 28px;
}

/* Input Section */
.input-section {
  padding: 20px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.input-header h3 {
  font-size: 14px;
  font-weight: 600;
}

.char-hint {
  font-size: 12px;
  color: var(--text-muted);
}

.experience-input {
  min-height: 180px;
  margin-bottom: 14px;
}

.input-actions {
  display: flex;
  gap: 10px;
}

.parse-btn {
  flex: 1;
}

.loading-icon {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Result Section */
.result-section {
  padding: 20px;
  min-height: 280px;
}

.empty-state {
  height: 100%;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: var(--text-muted);
}

.empty-icon {
  opacity: 0.3;
}

.empty-text {
  font-size: 13px;
}

/* Parsed Result */
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-header h3 {
  font-size: 14px;
  font-weight: 600;
}

.star-content {
  margin-bottom: 16px;
}

.star-item {
  margin-bottom: 14px;
}

.star-label {
  display: inline-block;
  padding: 3px 8px;
  background: var(--primary-pale);
  color: var(--primary-color);
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  margin-bottom: 6px;
}

.star-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.optimized-desc {
  padding-top: 14px;
  border-top: 1px solid var(--border-light);
}

.optimized-desc h4 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.optimized-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.6;
  background: var(--primary-pale);
  padding: 12px;
  border-radius: var(--radius-md);
}

/* Saved Section */
.saved-section {
  margin-top: 28px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 14px;
}

.empty-saved {
  padding: 32px;
  text-align: center;
}

.saved-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}

.saved-card {
  padding: 16px;
}

.saved-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.saved-date {
  font-size: 12px;
  color: var(--text-muted);
}

.delete-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.delete-btn:hover {
  color: var(--error-color);
  background: var(--error-light);
}

.saved-content {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .experience-content {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .page-title {
    font-size: 20px;
  }
  
  .experience-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .input-section,
  .result-section {
    padding: 16px;
  }
  
  .saved-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
