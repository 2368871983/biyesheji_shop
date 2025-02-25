import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const searchList = ref([])
  const getItem = (item) => {
    searchList.value = item
  }
  const removeItem = () => {
    searchList.value = []
  }

  return { searchList, getItem, removeItem }
},
  {
    persist: true,
  }
)
