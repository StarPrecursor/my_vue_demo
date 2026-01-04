<template>
  <header class="header">
    <!-- Mobile Menu Button -->
    <button class="menu-btn show-mobile" @click="openMobile">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <!-- Mobile Logo -->
    <div class="mobile-logo show-mobile">
      <div class="logo-icon">C</div>
      <span class="logo-text">AI Coach</span>
    </div>

    <div class="header-spacer"></div>
    
    <div class="header-user">
      <span class="user-name hide-mobile">user</span>
      <span class="user-status hide-mobile">求职中</span>
      <div class="user-avatar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <button class="logout-btn hide-mobile" title="退出登录">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
const emit = defineEmits(['openMobile'])

const openMobile = () => {
  emit('openMobile')
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  height: var(--header-height);
  background: var(--bg-main);
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 99;
  gap: 16px;
}

.header-spacer {
  flex: 1;
}

/* Menu Button (Mobile) */
.menu-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.menu-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Mobile Logo */
.mobile-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mobile-logo .logo-icon {
  width: 32px;
  height: 32px;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.mobile-logo .logo-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

/* User Section */
.header-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.user-status {
  font-size: 12px;
  color: var(--text-muted);
  padding: 3px 8px;
  background: var(--primary-pale);
  border-radius: var(--radius-full);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.logout-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.logout-btn:hover {
  background: var(--bg-main);
  color: var(--text-primary);
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .header {
    left: var(--sidebar-collapsed-width);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .header {
    left: 0;
    padding: 0 16px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border-light);
  }
}
</style>
