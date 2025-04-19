<script setup>
const { goods, getMyOrderData } = defineProps({
  goods: {
    type: Object,
    default: () => {
      return {}
    },
  },
  getMyOrderData: {
    type: Function,
    default: () => {
      return () => {}
    },
  },
})

import { cancelOrder } from '@/api/user'

import { computed } from 'vue'
// 计算商品总数量
const totalNum = computed(() => {
  if (Array.isArray(goods?.goods)) {
    return goods.goods.reduce((sum, item) => sum + (item.total_num || 0), 0)
  }
  return 0
})

const handleCancelOrder = async (id) => {
  const res = await cancelOrder(id)
  console.log(res)

  // eslint-disable-next-line no-undef
  showToast({
    type: 'success',
    message: res.message,
  })
  
  setTimeout(() => {
    getMyOrderData()
  }, 1000)
}
</script>

<template>
  <div v-for="item in goods.goods" :key="item.goods_id" class="order-list-item">
    <div class="tit">
      <div class="time">{{ goods.create_time }}</div>
      <div class="status">
        <span>{{ goods.state_text }}</span>
      </div>
    </div>
    <div v-for="item in goods.goods" :key="item.goods_id" class="list">
      <div class="list-item">
        <div class="goods-img">
          <img :src="item.goods_image" alt="" />
        </div>
        <div class="goods-content text-ellipsis-2">
          {{ item.goods_name }}
        </div>
        <div class="goods-trade">
          <p>¥ {{ item.goods_price }}</p>
          <p>x {{ item.total_num }}</p>
        </div>
      </div>
    </div>
    <div class="total">共{{ totalNum }}件商品，总金额 ¥{{ goods.total_price }}</div>
    <div class="actions">
      <span v-if="false">立刻付款</span>
      <span v-if="true" @click="handleCancelOrder(item.order_id)">申请取消</span>
      <span v-if="false">确认收货</span>
      <span v-if="false">评价</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.order-list-item {
  margin: 10px auto;
  width: 94%;
  padding: 15px;
  background-color: #ffffff;
  box-shadow: 0 0.5px 2px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  color: #333;
  font-size: 13px;

  .tit {
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .status {
      color: #fa2209;
    }
  }

  .list-item {
    display: flex;
    .goods-img {
      width: 90px;
      height: 90px;
      margin: 0px 10px 10px 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .goods-content {
      flex: 2;
      line-height: 18px;
      max-height: 36px;
      margin-top: 8px;
    }
    .goods-trade {
      flex: 1;
      line-height: 18px;
      text-align: right;
      color: #b39999;
      margin-top: 8px;
    }
  }

  .total {
    text-align: right;
  }
  .actions {
    text-align: right;
    span {
      display: inline-block;
      height: 28px;
      line-height: 28px;
      color: #383838;
      border: 0.5px solid #a8a8a8;
      font-size: 14px;
      padding: 0 15px;
      border-radius: 5px;
      margin: 10px 0;
    }
  }
}
</style>
