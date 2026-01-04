<template>
  <div class="app-layout">
    <Sidebar 
      :mobileOpen="mobileMenuOpen" 
      @closeMobile="mobileMenuOpen = false"
    />
    <Header @openMobile="mobileMenuOpen = true" />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const mobileMenuOpen = ref(false)
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--bg-main);
}

.main-content {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  padding: calc(var(--header-height) + 24px) 32px 32px;
}

/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .main-content {
    margin-left: var(--sidebar-collapsed-width);
    padding: calc(var(--header-height) + 20px) 24px 24px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: calc(var(--header-height) + 16px) 16px 24px;
  }
}
</style>
