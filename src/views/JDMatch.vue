<template>
  <div class="jd-match-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">JD 匹配与差距分析</h1>
      <p class="page-subtitle">上传目标岗位的 JD，AI 将对比你的简历库，找出关键差距并提供定制化修改建议。</p>
    </div>

    <!-- Main Content -->
    <div class="match-content">
      <!-- Input Section -->
      <div class="input-section card">
        <div class="input-header">
          <span class="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <h3>目标岗位 JD</h3>
        </div>
        <textarea 
          v-model="jdContent"
          class="jd-input textarea"
          placeholder="直接粘贴 JD 全文..."
          rows="12"
        ></textarea>
        <button 
          class="btn btn-primary match-btn" 
          :disabled="!jdContent.trim() || isProcessing"
          @click="analyzeMatch"
        >
          <span v-if="isProcessing" class="loading-icon">⟳</span>
          <span v-else>◎</span>
          {{ isProcessing ? '分析中...' : '开始匹配分析' }}
        </button>
      </div>

      <!-- Result Section -->
      <div class="result-section card">
        <div v-if="!matchResult" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <p class="empty-text">粘贴目标岗位的 Job Description<br/>我们将分析你与该岗位的适配程度</p>
        </div>
        <div v-else class="match-result">
          <!-- Match Score -->
          <div class="score-section">
            <div class="score-circle" :class="scoreClass">
              <span class="score-value">{{ matchResult.score }}%</span>
              <span class="score-label">匹配度</span>
            </div>
          </div>

          <!-- Analysis Sections -->
          <div class="analysis-section">
            <h4 class="analysis-title">
              <span class="icon-success">✓</span>
              匹配的技能
            </h4>
            <div class="tags">
              <span v-for="skill in matchResult.matchedSkills" :key="skill" class="tag tag-success">
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="analysis-section">
            <h4 class="analysis-title">
              <span class="icon-warning">!</span>
              需要补充的技能
            </h4>
            <div class="tags">
              <span v-for="skill in matchResult.missingSkills" :key="skill" class="tag tag-warning">
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="analysis-section">
            <h4 class="analysis-title">
              <span class="icon-tip">💡</span>
              优化建议
            </h4>
            <ul class="suggestions-list">
              <li v-for="(suggestion, index) in matchResult.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const jdContent = ref('')
const matchResult = ref(null)
const isProcessing = ref(false)

const scoreClass = computed(() => {
  if (!matchResult.value) return ''
  const score = matchResult.value.score
  if (score >= 80) return 'score-high'
  if (score >= 60) return 'score-medium'
  return 'score-low'
})

// Mock JD matching analysis
const analyzeMatch = async () => {
  if (!jdContent.value.trim()) return
  
  isProcessing.value = true
  
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const jd = jdContent.value.toLowerCase()
  
  const possibleSkills = {
    matched: [],
    missing: []
  }
  
  if (jd.includes('react') || jd.includes('vue') || jd.includes('前端')) {
    possibleSkills.matched.push('前端开发')
  }
  if (jd.includes('javascript') || jd.includes('js') || jd.includes('typescript')) {
    possibleSkills.matched.push('JavaScript/TypeScript')
  }
  if (jd.includes('python')) {
    possibleSkills.missing.push('Python')
  }
  if (jd.includes('java') && !jd.includes('javascript')) {
    possibleSkills.missing.push('Java')
  }
  if (jd.includes('数据') || jd.includes('data')) {
    possibleSkills.missing.push('数据分析')
  }
  if (jd.includes('团队') || jd.includes('协作')) {
    possibleSkills.matched.push('团队协作')
  }
  if (jd.includes('沟通') || jd.includes('communication')) {
    possibleSkills.matched.push('沟通能力')
  }
  if (jd.includes('英语') || jd.includes('english')) {
    possibleSkills.missing.push('英语能力')
  }
  
  if (possibleSkills.matched.length === 0) {
    possibleSkills.matched = ['问题解决能力', '学习能力', '责任心']
  }
  if (possibleSkills.missing.length === 0) {
    possibleSkills.missing = ['相关行业经验', '专业技术深度']
  }
  
  const matchedCount = possibleSkills.matched.length
  const totalCount = matchedCount + possibleSkills.missing.length
  const score = Math.round((matchedCount / totalCount) * 100 * 0.8 + Math.random() * 20)
  
  matchResult.value = {
    score: Math.min(score, 95),
    matchedSkills: possibleSkills.matched,
    missingSkills: possibleSkills.missing,
    suggestions: [
      '建议在简历中突出展示与该岗位相关的项目经验',
      '可以补充一些量化的成果数据来增强说服力',
      '针对缺失的技能，可以通过在线课程快速学习',
      '建议在求职信中说明你对该岗位的热情和学习意愿'
    ]
  }
  
  isProcessing.value = false
}
</script>

<style scoped>
.jd-match-page {
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
  color: var(--primary-color);
  margin-bottom: 6px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

/* Main Content */
.match-content {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
}

/* Input Section */
.input-section {
  padding: 20px;
}

.input-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.input-icon {
  color: var(--primary-color);
}

.input-header h3 {
  font-size: 14px;
  font-weight: 600;
}

.jd-input {
  min-height: 260px;
  margin-bottom: 14px;
}

.match-btn {
  width: 100%;
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
  padding: 24px;
  min-height: 360px;
}

.empty-state {
  height: 100%;
  min-height: 320px;
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
  text-align: center;
  line-height: 1.6;
}

/* Match Result */
.match-result {
  animation: fadeIn 0.25s ease-out;
}

/* Score Section */
.score-section {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.score-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid;
}

.score-high {
  border-color: var(--success-color);
  background: var(--success-light);
}

.score-medium {
  border-color: var(--warning-color);
  background: var(--warning-light);
}

.score-low {
  border-color: var(--error-color);
  background: var(--error-light);
}

.score-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.score-label {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Analysis Section */
.analysis-section {
  margin-bottom: 20px;
}

.analysis-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.icon-success {
  color: var(--success-color);
}

.icon-warning {
  color: var(--warning-color);
}

.icon-tip {
  font-size: 14px;
}

/* Tags */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Suggestions */
.suggestions-list {
  list-style: none;
  padding: 0;
}

.suggestions-list li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.suggestions-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .match-content {
    grid-template-columns: 1fr 1fr;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .page-title {
    font-size: 20px;
  }
  
  .match-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .input-section,
  .result-section {
    padding: 16px;
  }
  
  .jd-input {
    min-height: 160px;
  }
  
  .result-section {
    min-height: auto;
  }
  
  .score-circle {
    width: 100px;
    height: 100px;
  }
  
  .score-value {
    font-size: 24px;
  }
}
</style>
