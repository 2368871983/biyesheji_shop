<script setup>
import { ref } from 'vue'
const chosenAddressId = ref('1')

import { getAddressList, setAddress } from '@/api/address'

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

const handleSelect = async (val) => {
  const addressStore = useAddressStore()
  const convertAddress = (data) => {
    const [province, city, county, addressDetail] = data.address.split(' ')
    return {
      addressDetail,
      areaCode: '000000',
      city,
      country: '',
      county,
      isDefault: false,
      name: data.name,
      province,
      tel: data.tel,
    }
  }
  addressStore.setAddress(convertAddress(val))
  addressStore.setChosenAddressId(val.id)
  await setAddress(val.id)
  console.log(await setAddress(val.id))
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
  <van-nav-bar class="nav-bar" title="地址管理" left-arrow @click-left="$router.back()" />

  <van-address-list
    v-if="addressList.length"
    @select="handleSelect"
    v-model="chosenAddressId"
    :list="addressList"
    @add="onAdd"
    @edit="onEdit"
  />
  <div v-else>
    <van-empty description="暂无地址" />
    <van-button @click="onAdd" size="large" round type="primary">新增地址</van-button>
  </div>
</template>

<style lang="less" scoped>
.van-nav-bar {
  background: linear-gradient(180deg, #fcd6d3, #fff3f3);
  z-index: 999;
  --van-nav-bar-icon-color: grey;
}
.van-button {
  position: fixed;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%) scale(0.9);
}
</style>
