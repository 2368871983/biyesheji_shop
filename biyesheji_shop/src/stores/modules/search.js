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
  const getSearchList = () => {
    return searchList.value
  }
  return { searchList, getItem, removeItem, getSearchList }
},
  {
    persist: true,
  }
)
