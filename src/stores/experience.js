import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExperienceStore = defineStore('experience', () => {
  // 从 localStorage 加载保存的经历
  const savedExperiences = ref(
    JSON.parse(localStorage.getItem('experiences') || '[]')
  )

  // 添加经历
  const addExperience = (experience) => {
    savedExperiences.value.push({
      id: Date.now(),
      ...experience,
      createdAt: new Date().toISOString()
    })
    saveToLocalStorage()
  }

  // 删除经历
  const removeExperience = (id) => {
    savedExperiences.value = savedExperiences.value.filter(exp => exp.id !== id)
    saveToLocalStorage()
  }

  // 保存到 localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('experiences', JSON.stringify(savedExperiences.value))
  }

  // 统计数据
  const experienceCount = computed(() => savedExperiences.value.length)

  return {
    savedExperiences,
    addExperience,
    removeExperience,
    experienceCount
  }
})

