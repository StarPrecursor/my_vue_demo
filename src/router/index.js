import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/experience',
    name: 'ExperienceLib',
    component: () => import('../views/ExperienceLib.vue')
  },
  {
    path: '/jd-match',
    name: 'JDMatch',
    component: () => import('../views/JDMatch.vue')
  },
  {
    path: '/interview',
    name: 'InterviewPrep',
    component: () => import('../views/InterviewPrep.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

