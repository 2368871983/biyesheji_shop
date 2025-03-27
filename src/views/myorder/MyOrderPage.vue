<script setup>
import OrderListItem from '@/components/OrderListItem.vue'
import router from '@/router'
import { onMounted, ref } from 'vue'
import { getMyOrder } from '@/api/user'

onMounted(() => {
  getMyOrderData()
  console.log(active.value)
})

const goodsList = ref([])
const active = ref(router.currentRoute.value.query.dataType || 'all')
// 处理标签切换的函数
const handleTabChange = (value) => {
  active.value = value
  // 重新获取订单数据
  getMyOrderData()
}
const page = ref(1)
const getMyOrderData = async () => {
  const res = await getMyOrder(active.value, page.value)
  console.log(res)
  goodsList.value = res.data.list.data
  console.log(goodsList.value)
}
</script>

<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-arrow @click-left="router.push('/user')" />
    <van-tabs @change="handleTabChange" v-model="active" sticky>
      <van-tab name="all" title="全部"></van-tab>
      <van-tab name="payment" title="待支付"></van-tab>
      <van-tab name="delivery" title="待发货"></van-tab>
      <van-tab name="received" title="待收货"></van-tab>
      <van-tab name="comment" title="待评价"></van-tab>
    </van-tabs>

    <OrderListItem
      v-for="item in goodsList"
      :key="item.order_id"
      :getMyOrderData="getMyOrderData"
      :goods="item"
    ></OrderListItem>
  </div>
</template>
<style lang="less" scoped>
.van-nav-bar {
  background: linear-gradient(180deg, #fcd6d3, #fff3f3);
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.order {
  background-color: #fafafa;
}
.van-tabs {
  position: sticky;
  top: 0;
  margin-top: 50px;
}
</style>
