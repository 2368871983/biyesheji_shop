import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStore = defineStore('address', () => {

  const address = ref({})
  const setAddress = (data) => {
    address.value = data
  }
  const chosenAddressId = ref('')
  const setChosenAddressId = (id) => {
    chosenAddressId.value = id
  }


  return { address, setAddress, setChosenAddressId, chosenAddressId, }
},
  {
    persist: true,
  }
)
