<template>
  <router-link :to="to" class="action-card">
    <div class="action-icon" :style="{ background: iconBg }">
      <span v-html="icon"></span>
    </div>
    <div class="action-content">
      <h4 class="action-title">{{ title }}</h4>
      <p class="action-desc">{{ description }}</p>
    </div>
    <div class="action-arrow">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconBg: {
    type: String,
    default: 'var(--primary-pale)'
  },
  to: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.action-card:hover {
  border-color: var(--primary-color);
}

.action-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
  min-width: 0;
}

.action-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.action-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-arrow {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color var(--transition-fast);
}

.action-card:hover .action-arrow {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .action-card {
    padding: 16px;
    gap: 14px;
  }
  
  .action-icon {
    width: 38px;
    height: 38px;
  }
  
  .action-desc {
    display: none;
  }
}
</style>
