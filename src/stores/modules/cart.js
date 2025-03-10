import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('big-active', () => {
  const cartList = ref([])
  const setCartList = (newCartList) => {
    cartList.value = newCartList
  }

  return { cartList, setCartList }
},
  {
    persist: true,
  }
)
