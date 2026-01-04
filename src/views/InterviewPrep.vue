<template>
  <div class="interview-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-main">
        <h1 class="page-title">面试模拟问答</h1>
        <p class="page-subtitle">基于你的经历库和目标 JD，生成针对性的面试题，并提供回答思路。</p>
      </div>
      <button class="btn btn-dark start-dialog-btn" @click="startMockInterview">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        开始模拟对话
      </button>
    </div>

    <!-- Main Content -->
    <div class="interview-content">
      <!-- Left Section -->
      <div class="left-section">
        <!-- JD Input -->
        <div class="jd-section card">
          <h3 class="section-label">目标岗位 JD（用于生成针对性问题）</h3>
          <textarea 
            v-model="targetJD"
            class="jd-input textarea"
            placeholder="粘贴目标岗位的 Job Description..."
            rows="3"
          ></textarea>
        </div>

        <!-- Questions List -->
        <div class="questions-section card">
          <div v-if="questions.length === 0" class="empty-questions">
            <p>暂无面试问题，输入 JD 后点击下方按钮生成</p>
          </div>
          <div v-else class="questions-list">
            <div 
              v-for="(question, index) in questions" 
              :key="index" 
              class="question-item"
              :class="{ expanded: expandedQuestion === index }"
              @click="toggleQuestion(index)"
            >
              <div class="question-header">
                <span class="question-number">Q{{ index + 1 }}</span>
                <span class="question-text">{{ question.text }}</span>
                <span class="expand-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polyline :points="expandedQuestion === index ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
                  </svg>
                </span>
              </div>
              <div v-if="expandedQuestion === index" class="question-answer">
                <h4>回答思路：</h4>
                <p>{{ question.hint }}</p>
                <div class="answer-tags">
                  <span v-for="tag in question.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            class="generate-btn"
            :disabled="isGenerating"
            @click="generateQuestions"
          >
            <span v-if="isGenerating" class="loading-icon">⟳</span>
            生成更多高频面试题 +
          </button>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <!-- Interviewer Tips Card -->
        <div class="tips-card">
          <div class="tips-header">
            <span class="tips-icon">ⓘ</span>
            <span class="tips-label">面试官视角</span>
          </div>
          <p class="tips-content">
            "目前的题库主要覆盖了行为面试(BQ)和简历细节核实。建议在回答时严格遵循 STAR 法则，每个回答控制在 2 分钟左右。"
          </p>
        </div>

        <!-- Practice Plan Card -->
        <div class="plan-card card">
          <h3 class="plan-title">今日练习计划</h3>
          <div class="plan-items">
            <div 
              v-for="(item, index) in practiceItems" 
              :key="index"
              class="plan-item"
              :class="{ completed: item.completed }"
              @click="togglePracticeItem(index)"
            >
              <span class="check-circle">
                <svg v-if="item.completed" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span class="plan-text">{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mock Interview Dialog -->
    <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
      <div class="dialog-content">
        <div class="dialog-header">
          <h2>模拟面试</h2>
          <button class="close-btn" @click="closeDialog">×</button>
        </div>
        <div class="chat-container">
          <div class="chat-messages" ref="chatContainer">
            <div 
              v-for="(msg, index) in chatMessages" 
              :key="index" 
              class="chat-message"
              :class="msg.role"
            >
              <div class="message-avatar">
                {{ msg.role === 'interviewer' ? '👔' : '👤' }}
              </div>
              <div class="message-content">
                <span class="message-role">{{ msg.role === 'interviewer' ? '面试官' : '你' }}</span>
                <p class="message-text">{{ msg.content }}</p>
              </div>
            </div>
            <div v-if="isTyping" class="chat-message interviewer typing">
              <div class="message-avatar">👔</div>
              <div class="message-content">
                <span class="message-role">面试官</span>
                <p class="message-text typing-indicator">正在思考<span>...</span></p>
              </div>
            </div>
          </div>
          <div class="chat-input-area">
            <textarea 
              v-model="userInput"
              class="chat-input textarea"
              placeholder="输入你的回答... (Ctrl+Enter 发送)"
              rows="2"
              @keydown.enter.ctrl="sendMessage"
            ></textarea>
            <button 
              class="btn btn-primary send-btn" 
              :disabled="!userInput.trim() || isTyping"
              @click="sendMessage"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const targetJD = ref('')
const questions = ref([])
const expandedQuestion = ref(null)
const isGenerating = ref(false)

const practiceItems = ref([
  { text: '完成自我介绍练习', completed: false },
  { text: '完成 3 道 BQ 题', completed: false },
  { text: '录制一段模拟面试', completed: false }
])

const showDialog = ref(false)
const chatMessages = ref([])
const userInput = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)

const mockQuestions = [
  {
    text: '请简单介绍一下你自己',
    hint: '用 1-2 分钟介绍你的教育背景、主要经历和求职意向。突出与目标岗位相关的经验和技能。',
    tags: ['自我介绍', '开场']
  },
  {
    text: '请描述一个你成功解决复杂问题的经历',
    hint: '使用 STAR 法则：描述具体情境、你的任务、采取的行动和最终结果。注意量化成果。',
    tags: ['问题解决', 'STAR', 'BQ']
  },
  {
    text: '你如何处理工作中的压力和紧迫的截止日期？',
    hint: '给出具体例子，说明你的时间管理和优先级排序能力。展示你在压力下仍能保持高效。',
    tags: ['抗压能力', '时间管理']
  },
  {
    text: '谈谈你在团队合作中遇到的挑战及解决方式',
    hint: '描述一个具体的团队冲突或挑战，说明你如何促进沟通、协调资源并达成共识。',
    tags: ['团队合作', '沟通', 'BQ']
  },
  {
    text: '你最大的优点和缺点是什么？',
    hint: '优点要与岗位匹配，缺点要真实但不致命，并说明你正在如何改进。',
    tags: ['自我认知', '经典问题']
  },
  {
    text: '为什么选择我们公司？',
    hint: '提前研究公司背景、产品和文化。结合自身发展规划，说明为什么这是双向选择。',
    tags: ['动机', '公司了解']
  },
  {
    text: '描述一个你失败的经历以及你从中学到了什么',
    hint: '选择一个真实但不太严重的失败，重点放在你的反思和成长上。',
    tags: ['失败经历', '成长', 'BQ']
  },
  {
    text: '你的职业规划是什么？',
    hint: '展示你有清晰的目标，且这个目标与公司的发展方向一致。避免说"想升职加薪"。',
    tags: ['职业规划', '发展']
  }
]

const toggleQuestion = (index) => {
  expandedQuestion.value = expandedQuestion.value === index ? null : index
}

const togglePracticeItem = (index) => {
  practiceItems.value[index].completed = !practiceItems.value[index].completed
}

const generateQuestions = async () => {
  isGenerating.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const currentCount = questions.value.length
  const newQuestions = mockQuestions
    .slice(currentCount, currentCount + 3)
    .map(q => ({ ...q }))
  
  if (newQuestions.length === 0) {
    questions.value = [...mockQuestions.slice(0, 3)]
  } else {
    questions.value.push(...newQuestions)
  }
  
  isGenerating.value = false
}

const startMockInterview = () => {
  showDialog.value = true
  chatMessages.value = [
    {
      role: 'interviewer',
      content: '你好！欢迎参加今天的面试。在开始之前，我想先了解一下你。请简单介绍一下你自己，包括你的教育背景和相关经历。'
    }
  ]
}

const closeDialog = () => {
  showDialog.value = false
  chatMessages.value = []
  userInput.value = ''
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isTyping.value) return
  
  const message = userInput.value.trim()
  chatMessages.value.push({
    role: 'user',
    content: message
  })
  userInput.value = ''
  
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
  
  isTyping.value = true
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
  
  const responses = [
    '很好的回答。能再详细说说你在这个过程中具体做了什么吗？',
    '我理解了。那在这个项目中，你遇到的最大挑战是什么？你是如何克服的？',
    '听起来很有意思。你能用具体的数据来说明这个成果吗？',
    '好的，我还想了解一下，如果再遇到类似的情况，你会有什么不同的做法？',
    '非常棒！你的经历很符合我们的岗位要求。还有什么问题想问我的吗？'
  ]
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  
  chatMessages.value.push({
    role: 'interviewer',
    content: randomResponse
  })
  
  isTyping.value = false
  
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.interview-page {
  max-width: 1100px;
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
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

.start-dialog-btn {
  flex-shrink: 0;
}

/* Main Content */
.interview-content {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
}

/* Left Section */
.left-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.jd-section {
  padding: 16px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.jd-input {
  min-height: 70px;
}

/* Questions Section */
.questions-section {
  padding: 16px;
}

.empty-questions {
  padding: 32px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

.questions-list {
  margin-bottom: 14px;
}

.question-item {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-bottom: 10px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.question-item:hover {
  border-color: var(--primary-color);
}

.question-item.expanded {
  border-color: var(--primary-color);
  background: var(--primary-pale);
}

.question-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

.question-number {
  background: var(--primary-color);
  color: white;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.question-text {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.expand-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.question-answer {
  padding: 0 14px 14px;
  border-top: 1px dashed var(--border-color);
  margin-top: -4px;
  padding-top: 14px;
}

.question-answer h4 {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.question-answer p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 10px;
}

.answer-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.generate-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.generate-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-icon {
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-right: 4px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Right Section */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Tips Card */
.tips-card {
  background: var(--bg-dark);
  border-radius: var(--radius-lg);
  padding: 18px;
  color: white;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.tips-icon {
  font-size: 14px;
  color: #60A5FA;
}

.tips-label {
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.tips-content {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

/* Plan Card */
.plan-card {
  padding: 18px;
}

.plan-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 14px;
}

.plan-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plan-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.check-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.plan-item.completed .check-circle {
  background: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.plan-text {
  font-size: 13px;
  color: var(--text-secondary);
}

.plan-item.completed .plan-text {
  color: var(--text-muted);
  text-decoration: line-through;
}

/* Dialog Overlay */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: fadeIn 0.2s ease-out;
}

.dialog-content {
  width: 100%;
  max-width: 640px;
  max-height: 80vh;
  background: white;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.dialog-header h2 {
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 22px;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 50%;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--bg-main);
  color: var(--text-primary);
}

/* Chat Container */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 380px;
}

.chat-message {
  display: flex;
  gap: 10px;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}

.message-role {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 4px;
  display: block;
}

.message-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-main);
  padding: 10px 14px;
  border-radius: var(--radius-md);
}

.chat-message.user .message-text {
  background: var(--primary-pale);
}

.typing-indicator span {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Chat Input */
.chat-input-area {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-light);
}

.chat-input {
  flex: 1;
  min-height: 42px;
  resize: none;
}

.send-btn {
  flex-shrink: 0;
  align-self: flex-end;
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .interview-content {
    grid-template-columns: 1fr 260px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .start-dialog-btn {
    width: 100%;
  }
  
  .interview-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .right-section {
    order: -1;
    flex-direction: row;
    overflow-x: auto;
    gap: 12px;
    padding-bottom: 4px;
  }
  
  .tips-card,
  .plan-card {
    flex-shrink: 0;
    width: 260px;
  }
  
  .dialog-content {
    max-height: 90vh;
  }
  
  .chat-messages {
    max-height: 300px;
  }
}
</style>
