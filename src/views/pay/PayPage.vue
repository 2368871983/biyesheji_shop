<script setup>
import { getAddressList } from '@/api/address'

import { getBuyNowPay, getCartPay } from '@/api/pay'
import router from '@/router'
import { useAddressStore } from '@/stores'
import { ref } from 'vue'
const goodsList = ref([])
const address = ref({})
const getAddress = async () => {
  await getAddressList()

  const addressStore = useAddressStore()
  address.value = addressStore.address
  console.log(addressStore.address)
}
const order = ref({})
import { onMounted } from 'vue'
onMounted(async () => {
  await getAddress()

  const cartIds = router.currentRoute.value.query.cartIds

  const goodsId = router.currentRoute.value.query.goodsId
  const goodsNum = router.currentRoute.value.query.goodsNum
  const goodsSkuId = router.currentRoute.value.query.goodsSkuId

  const mode = router.currentRoute.value.query.mode
  console.log(mode)

  if (mode === 'buyNow') {
    const res = await getBuyNowPay(mode, goodsId, goodsNum, goodsSkuId)
    console.log(res)
    goodsList.value = res.data.order.goodsList
    console.log(goodsList.value)
    order.value = res.data.order
  } else if (mode === 'cart') {
    const res = await getCartPay(mode, cartIds)
    console.log(res)
    goodsList.value = res.data.order.goodsList
    order.value = res.data.order
  }
})
</script>

<template>
  <div class="pay">
    <van-nav-bar fixed title="订单结算台" left-arrow @click-left="$router.back()" />

    <!-- 地址相关 -->
    <div class="address" @click="router.push('/address')">
      <div class="left-icon">
        <van-icon name="logistics" />
      </div>

      <div class="info" v-if="Object.keys(address).length > 0">
        <div class="info-content">
          <span style="margin-right: 10px" class="name">{{ address.name }}</span>
          <span class="mobile">{{ address.tel }}</span>
        </div>
        <div class="info-address">
          {{ address.province }} {{ address.city }} {{ address.county }} {{ address.addressDetail }}
        </div>
      </div>

      <div class="info" v-else>请选择配送地址</div>

      <div class="right-icon">
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 订单明细 -->
    <div class="pay-list">
      <div class="list">
        <div class="goods-item" v-for="item in goodsList" :key="item.goods_id">
          <div class="left">
            <img :src="item.goods_image" alt="" />
          </div>
          <div class="right">
            <p class="tit text-ellipsis-2">
              {{ item.goods_name }}
            </p>
            <p class="info">
              <span class="count">x{{ item.total_num }}</span>
              <span class="price">¥{{ item.goods_price }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="flow-num-box">
        <span>共 {{ order.orderTotalNum }} 件商品，合计：</span>
        <span class="money">￥{{ order.orderTotalPrice }}</span>
      </div>

      <div class="pay-detail">
        <div class="pay-cell">
          <span>订单总金额：</span>
          <span class="red">￥{{ order.orderTotalPrice }}</span>
        </div>

        <div class="pay-cell">
          <span>优惠券：</span>
          <span>无优惠券可用</span>
        </div>

        <div class="pay-cell">
          <span>配送费用：</span>
          <span v-if="false">请先选择配送地址</span>
          <span v-else class="red">+￥0.00</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="pay-way">
        <span class="tit">支付方式</span>
        <div class="pay-cell">
          <span><van-icon name="balance-o" />余额支付（可用 ¥ 999919.00 元）</span>
          <!-- <span>请先选择配送地址</span> -->
          <span class="red"><van-icon name="passed" /></span>
        </div>
      </div>

      <!-- 买家留言
      <div class="buytips">
        <textarea
          placeholder="选填：买家留言（50字内）"
          name=""
          id=""
          cols="30"
          rows="10"
        ></textarea>
      </div> -->
    </div>

    <!-- 底部提交 -->
    <div class="footer-fixed">
      <div class="left">实付款：<span>￥999919</span></div>
      <div class="tipsbtn">提交订单</div>
    </div>
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
.pay {
  padding-top: 46px;
  padding-bottom: 46px;
  ::v-deep {
    .van-nav-bar__arrow {
      color: #333;
    }
  }
}
.address {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  color: #666;
  position: relative;
  background: url(@/assets/border-line.png) bottom repeat-x;
  background-size: 60px auto;
  .left-icon {
    margin-right: 20px;
  }
  .right-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-7px);
  }
}
.goods-item {
  height: 100px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 100px;
    img {
      display: block;
      width: 80px;
      margin: 10px auto;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    padding-right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #333;
    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;

      .price {
        color: #fa2209;
      }
    }
  }
}

.flow-num-box {
  display: flex;
  justify-content: flex-end;
  padding: 10px 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  .money {
    color: #fa2209;
  }
}

.pay-cell {
  font-size: 14px;
  padding: 10px 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  .red {
    color: #fa2209;
  }
}
.pay-detail {
  border-bottom: 1px solid #efefef;
}

.pay-way {
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #efefef;
  color: #333;
  .tit {
    line-height: 30px;
  }
  .pay-cell {
    padding: 10px 0;
  }
  .van-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}

.buytips {
  display: block;
  textarea {
    display: block;
    width: 100%;
    border: none;
    font-size: 14px;
    padding: 12px;
    height: 100px;
  }
}

.footer-fixed {
  position: fixed;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  display: flex;
  .left {
    flex: 1;
    padding-left: 12px;
    color: #666;
    span {
      color: #fa2209;
    }
  }
  .tipsbtn {
    width: 121px;
    background: linear-gradient(90deg, #f9211c, #ff6335);
    color: #fff;
    text-align: center;
    line-height: 46px;
    display: block;
    font-size: 14px;
  }
}
</style>
