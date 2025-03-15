<script setup>
import { ref } from 'vue'
const chosenAddressId = ref('1')

import { getAddressList } from '@/api/address'

const addressList = ref([])
const getAddress = async () => {
  const res = await getAddressList()
  console.log(res)
  addressList.value = res.data.list.map((item) => {
    return {
      id: item.address_id,
      name: item.name,
      tel: item.phone,
      address:
        item.region.province +
        ' ' +
        item.region.city +
        ' ' +
        item.region.region +
        ' ' +
        item.detail,
    }
  })
  console.log(addressList.value)
}
import { onMounted } from 'vue'
import router from '@/router'
import { useAddressStore } from '@/stores/index'
onMounted(() => {
  getAddress()
  const addressStore = useAddressStore()
  chosenAddressId.value = addressStore.chosenAddressId
  console.log(chosenAddressId.value)
})

const handleSelect = (val) => {
  const addressStore = useAddressStore()
  addressStore.setAddress(val)
  console.log(addressStore.address)
  addressStore.setChosenAddressId(val.id)
}
const onAdd = () => router.push('/addAddress')

const onEdit = (addressList) => {
  router.push({
    path: '/addAddress',
    query: {
      addressId: addressList.id,
    },
  })
}
</script>
<template>
  <van-nav-bar class="nav-bar" title="地址管理" left-arrow @click-left="$router.push('/pay')" />
  <van-address-list
    @select="handleSelect"
    v-model="chosenAddressId"
    :list="addressList"
    @add="onAdd"
    @edit="onEdit"
  />
</template>

<style lang="less" scoped>
.van-nav-bar {
  background: linear-gradient(180deg, #fcd6d3, #fff3f3);
  z-index: 999;
  --van-nav-bar-icon-color: grey;
}
</style>
