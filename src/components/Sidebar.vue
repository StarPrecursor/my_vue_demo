<template>
  <!-- Desktop Sidebar -->
  <aside class="sidebar hide-mobile" :class="{ collapsed: isCollapsed }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">C</div>
      <span v-if="!isCollapsed" class="logo-text">AI Coach</span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <router-link 
        v-for="item in navItems" 
        :key="item.path" 
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        :title="item.name"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span v-if="!isCollapsed" class="nav-text">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Pro Plan Card -->
    <div v-if="!isCollapsed" class="pro-plan-card">
      <div class="pro-header">
        <span class="pro-icon">⚡</span>
        <span class="pro-label">PRO PLAN</span>
      </div>
      <p class="pro-desc">解锁 100+ 面试模拟题与深度简历分析</p>
      <button class="pro-btn">立即升级</button>
    </div>
  </aside>

  <!-- Mobile Drawer Overlay -->
  <div v-if="mobileOpen" class="overlay show-mobile" @click="closeMobile"></div>

  <!-- Mobile Drawer -->
  <aside class="mobile-drawer show-mobile" :class="{ open: mobileOpen }">
    <div class="drawer-header">
      <div class="logo-icon">C</div>
      <span class="logo-text">AI Coach</span>
      <button class="close-btn" @click="closeMobile">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <nav class="drawer-nav">
      <router-link 
        v-for="item in navItems" 
        :key="item.path" 
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="closeMobile"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span class="nav-text">{{ item.name }}</span>
      </router-link>
    </nav>
    <div class="pro-plan-card">
      <div class="pro-header">
        <span class="pro-icon">⚡</span>
        <span class="pro-label">PRO PLAN</span>
      </div>
      <p class="pro-desc">解锁 100+ 面试模拟题与深度简历分析</p>
      <button class="pro-btn">立即升级</button>
    </div>
  </aside>

</template>

<script setup>
import { useRoute } from 'vue-router'

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  },
  mobileOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['closeMobile'])

const route = useRoute()

const navItems = [
  {
    path: '/',
    name: '仪表盘',
    shortName: '首页',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>`
  },
  {
    path: '/experience',
    name: '经历库',
    shortName: '经历',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>`
  },
  {
    path: '/jd-match',
    name: 'JD 匹配',
    shortName: '匹配',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>`
  },
  {
    path: '/interview',
    name: '面试准备',
    shortName: '面试',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`
  }
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const closeMobile = () => {
  emit('closeMobile')
}
</script>

<style scoped>
/* Desktop Sidebar */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width var(--transition-normal);
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

/* Logo */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--border-light);
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.nav-item:hover {
  background: var(--primary-pale);
  color: var(--primary-color);
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

/* Pro Plan Card */
.pro-plan-card {
  margin: 16px;
  padding: 16px;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}

.pro-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.pro-icon {
  font-size: 14px;
}

.pro-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-color);
  letter-spacing: 0.5px;
}

.pro-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}

.pro-btn {
  width: 100%;
  padding: 8px 14px;
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pro-btn:hover {
  background: var(--primary-color);
  color: white;
}

/* Mobile Drawer */
.mobile-drawer {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: var(--bg-sidebar);
  z-index: 300;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform var(--transition-normal);
}

.mobile-drawer.open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.drawer-header .logo-text {
  flex: 1;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
}

.close-btn:hover {
  background: var(--bg-main);
}

.drawer-nav {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Tablet - Collapsed Sidebar */
@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: var(--sidebar-collapsed-width);
  }
  
  .sidebar .nav-text,
  .sidebar .logo-text,
  .sidebar .pro-plan-card {
    display: none;
  }
  
  .sidebar .nav-item {
    justify-content: center;
    padding: 14px;
  }
  
  .sidebar-logo {
    justify-content: center;
    padding: 20px 16px;
  }
}
</style>
