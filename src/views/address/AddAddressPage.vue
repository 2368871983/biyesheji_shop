<template>
  <van-nav-bar class="nav-bar" title="地址管理" left-arrow @click-left="$router.push('/address')" />
  <van-address-edit
    :address-info="addressInfo"
    :area-list="areaList"
    show-delete
    show-search-result
    :area-columns-placeholder="['请选择省份', '请选择市', '请选择区']"
    @save="onSave"
    @delete="onDelete"
    @change-detail="onChangeDetail"
  />
</template>

<script setup>
import { addAddressList, deleteAddressList, getAddressDetail } from '@/api/address'
import { areaList } from '@vant/area-data'
import { all } from '@/api/address'
import { onMounted } from 'vue'

// 存储 all 方法返回的数据
import { ref } from 'vue'
import { useRoute } from 'vue-router' // 导入 useRoute 函数
import router from '@/router' // 导入 router 对象
const route = useRoute()
const allData = ref({})
// 在组件挂载时调用函数
const addressId = ref(0)
onMounted(async () => {
  if (route.query.addressId) {
    addressId.value = route.query.addressId

    const res = await getAddressDetail(addressId.value)
    console.log(res.data.detail)
    addressInfo.value = {
      name: res.data.detail.name,
      tel: res.data.detail.phone,
      province: res.data.detail.region.province,
      addressDetail: res.data.detail.detail,
    }
  }

  // 调用 all 函数获取所有地区数据
  all()
    .then((response) => {
      allData.value = response.data.list

      console.log('所有地区数据:', response)
    })
    .catch((error) => {
      console.error('获取所有地区数据失败:', error)
    })
})

const addressInfo = ref({
  name: '',
  tel: '',
  province: '',
  city: '',
  county: '',
  addressDetail: '',
})
const onSave = async (address) => {
  let cityCode = null
  let countyCode = null
  let provinceCode = null
  const idNameMap = []
  console.log(address)

  for (const key in allData.value) {
    const item = allData.value[key]
    idNameMap[item.name] = item.id
  }

  // 查找名称对应的 id
  provinceCode = idNameMap[address.province]
  cityCode = idNameMap[address.city]
  countyCode = idNameMap[address.county]

  const county = address.county
  const city = address.city
  const province = address.province
  const detail = address.addressDetail

  const res = await addAddressList(
    address.name,
    address.tel,
    provinceCode,
    province,
    cityCode,
    city,
    countyCode,
    county,
    detail,
  )
  console.log(res)
  // eslint-disable-next-line no-undef
  showToast('已保存')
  setTimeout(() => {
    router.push('/address')
  }, 500)
}

const onDelete = async () => {
  if (addressId.value) {
    const res = await deleteAddressList(addressId.value)
    console.log(res)

    // eslint-disable-next-line no-undef
    showToast('已删除')
    setTimeout(() => {
      router.push('/address')
    }, 500)
  }
}
const onChangeDetail = (val) => {
  console.log(val)
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background: linear-gradient(180deg, #fcd6d3, #fff3f3);
  z-index: 999;
  --van-nav-bar-icon-color: grey;
}
</style>
