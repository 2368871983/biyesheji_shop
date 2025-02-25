import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActiveStore = defineStore('big-active', () => {
  const active = ref(0)
  const setActive = (newActive) => {
    active.value = newActive
  }
  return { active, setActive }
},
  {
    persist: true,
  }
)
