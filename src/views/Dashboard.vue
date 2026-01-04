<template>
  <div class="dashboard">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <h1 class="welcome-title">欢迎回来, 同学! 👋</h1>
      <p class="welcome-subtitle">今天我们该如何提升你的竞争力?</p>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <StatCard 
        label="简历完整度" 
        :value="resumeCompleteness + '%'" 
        :icon="resumeIcon"
        iconBg="var(--primary-pale)"
      />
      <StatCard 
        label="匹配岗位" 
        :value="matchedJobs + ' 个'" 
        :icon="targetIcon"
        iconBg="#F0FDF4"
      />
      <StatCard 
        label="结构化经历" 
        :value="experienceCount + ' 条'" 
        :icon="docIcon"
        iconBg="#EFF6FF"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Quick Start Section -->
      <div class="quick-start-section">
        <h2 class="section-title">快速开始</h2>
        <div class="action-cards">
          <ActionCard 
            title="结构化我的经历"
            description="将琐碎的工作内容转化为具有竞争力的简历要点。"
            :icon="sparkleIcon"
            iconBg="var(--primary-pale)"
            to="/experience"
          />
          <ActionCard 
            title="JD 匹配度分析"
            description="上传你心仪的岗位描述，AI 告诉你该如何修改简历。"
            :icon="matchIcon"
            iconBg="#F0FDF4"
            to="/jd-match"
          />
          <ActionCard 
            title="模拟面试练习"
            description="基于你的真实经历和目标岗位进行 1v1 对话。"
            :icon="chatIcon"
            iconBg="#EFF6FF"
            to="/interview"
          />
        </div>
      </div>

      <!-- Strategy Section -->
      <div class="strategy-section">
        <h2 class="section-title">投递策略</h2>
        <div class="ai-suggestion-card">
          <div class="suggestion-header">
            <span class="suggestion-icon">💡</span>
            <span class="suggestion-label">AI 建议</span>
          </div>
          <p class="suggestion-text">
            开始添加你的第一条经历，让 AI 帮你优化成专业的简历描述。
          </p>
          <button class="btn btn-primary suggestion-btn" @click="goToExperience">
            查看详细报告
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useExperienceStore } from '../stores/experience'
import StatCard from '../components/StatCard.vue'
import ActionCard from '../components/ActionCard.vue'

const router = useRouter()
const experienceStore = useExperienceStore()

// Stats
const resumeCompleteness = computed(() => {
  const count = experienceStore.experienceCount
  if (count === 0) return 0
  if (count >= 5) return 100
  return Math.min(count * 20, 100)
})

const matchedJobs = computed(() => 0)
const experienceCount = computed(() => experienceStore.experienceCount)

// Icons
const resumeIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.5">
  <circle cx="12" cy="8" r="4"/>
  <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
</svg>`

const targetIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.5">
  <circle cx="12" cy="12" r="10"/>
  <circle cx="12" cy="12" r="6"/>
  <circle cx="12" cy="12" r="2"/>
</svg>`

const docIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.5">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="16" y1="13" x2="8" y2="13"/>
  <line x1="16" y1="17" x2="8" y2="17"/>
</svg>`

const sparkleIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.5">
  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/>
</svg>`

const matchIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.5">
  <circle cx="11" cy="11" r="8"/>
  <path d="m21 21-4.35-4.35"/>
</svg>`

const chatIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.5">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>`

const goToExperience = () => {
  router.push('/experience')
}
</script>

<style scoped>
.dashboard {
  max-width: 1100px;
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 28px;
}

.welcome-title {
  font-size: 26px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.welcome-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

/* Section Title */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 14px;
}

/* Action Cards */
.action-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* AI Suggestion Card */
.ai-suggestion-card {
  background: var(--bg-dark);
  border-radius: var(--radius-lg);
  padding: 20px;
  color: white;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.suggestion-icon {
  font-size: 16px;
}

.suggestion-label {
  font-size: 14px;
  font-weight: 600;
}

.suggestion-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 16px;
}

.suggestion-btn {
  width: 100%;
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 22px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .action-cards {
    gap: 8px;
  }
}
</style>
