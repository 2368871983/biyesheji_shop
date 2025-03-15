<script setup>
import CountBox from '@/components/CountBox.vue'

import { onMounted } from 'vue'
onMounted(() => {
  getCartList()
})

import { getCartData, updateCartData } from '@/api/cart'
import { useCartStore } from '@/stores/index'
import { ref } from 'vue'
const cartList = ref([])
const totalCount = ref(0)
const totalPrice = ref(0)
const cartStore = useCartStore()

const isAllChecked = ref(true)
const getCartList = async () => {
  const {
    data: { list },
  } = await getCartData()
  console.log({ data: { list } })
  list.forEach((item) => {
    item.isChecked = true
  })

  cartStore.setCartList(list)
  cartList.value = cartStore.cartList

  totalCount.value = cartList.value.reduce((pre, item) => {
    return pre + item.goods_num
  }, 0)
  totalPrice.value = cartList.value.reduce((pre, item) => {
    return pre + item.goods_num * item.goods.goods_price_max
  }, 0)

  console.log(totalCount.value)
}
// 更新选中商品的数量和总价
const updateTotal = () => {
  const checkedItems = cartList.value.filter((item) => item.isChecked)

  totalCount.value = checkedItems.reduce((pre, item) => pre + item.goods_num, 0)
  totalPrice.value = checkedItems.reduce(
    (pre, item) => pre + item.goods_num * item.goods.goods_price_max,
    0,
  )
}

// 单个商品选中状态改变
const handleItemCheck = () => {
  updateTotal()
  // 更新全选状态
  isAllChecked.value = cartList.value.every((item) => item.isChecked)
}

// 全选状态改变
const handleAllCheck = () => {
  cartList.value.forEach((item) => {
    item.isChecked = isAllChecked.value
  })
  updateTotal()
}

const isEdit = ref(false)
const handleEdit = () => {
  isEdit.value = !isEdit.value
}
import { delCartData } from '@/api/cart'
const delCart = async () => {
  if (totalCount.value === 0) return
  const checkedIds = cartList.value.map((item) => {
    if (item.isChecked) {
      return item.id
    }
  })

  await delCartData(checkedIds)
  getCartList()
}

const updateCart = async (goodsId, goodsNum, goodsSkuId) => {
  console.log(goodsId, goodsNum, goodsSkuId)
  const res = await updateCartData({ goodsId, goodsNum, goodsSkuId })
  getCartList()
  console.log(res)
}
</script>

<template>
  <div class="cart">
    <van-nav-bar title="购物车" fixed />
    <div v-if="cartList.length > 0">
      <!-- 购物车开头 -->
      <div class="cart-title">
        <span class="all"
          >共<i>{{ totalCount }}</i
          >件商品</span
        >
        <span class="edit">
          <van-icon @click="handleEdit" name="edit" />
          编辑
        </span>
      </div>

      <!-- 购物车列表 -->
      <div class="cart-list">
        <div class="cart-item" v-for="(item, index) in cartList" :key="index">
          <van-checkbox
            checked-color="#ee0a24"
            icon-size="18px"
            v-model="item.isChecked"
            @change="handleItemCheck"
          ></van-checkbox>
          <div class="show">
            <img :src="item.goods.goods_image" alt="" />
          </div>
          <div class="info">
            <span class="tit text-ellipsis-2">{{ item.goods.goods_name }}</span>
            <span class="bottom">
              <div class="price">
                ¥ <span>{{ item.goods.goods_price_max }}</span>
              </div>
              <CountBox
                @input="(value) => updateCart(item.goods.goods_id, value, item.goods_sku_id)"
                :total="item.goods_num"
              ></CountBox>
            </span>
          </div>
        </div>
      </div>

      <div class="footer-fixed">
        <div class="all-check">
          <van-checkbox
            checked-color="#ee0a24"
            v-model="isAllChecked"
            @click="handleAllCheck"
            icon-size="18"
          ></van-checkbox>
          全选
        </div>

        <div class="all-total">
          <div v-if="isEdit === false" class="price">
            <span>合计：</span>
            <span
              >¥ <i class="totalPrice"> {{ totalPrice }}</i></span
            >
          </div>
          <div v-if="isEdit === false" class="goPay">结算({{ totalCount }})</div>
          <div v-else @click="delCart" class="delete">删除({{ totalCount }})</div>
        </div>
      </div>
    </div>
    <div class="empty-cart" v-else>
      <img src="@/assets/empty.png" alt="" />
      <div class="tips">您的购物车是空的, 快去逛逛吧</div>
      <div class="btn" @click="$router.push('/')">去逛逛</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.van-nav-bar {
  background: linear-gradient(180deg, #fcd6d3, #fff3f3);
  z-index: 999;
  --van-nav-bar-icon-color: grey;
}
// 主题 padding
.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #ffffff;
  min-height: 100vh;
  .cart-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    .all {
      i {
        font-style: normal;
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
      }
    }
    .edit {
      .van-icon {
        font-size: 18px;
      }
    }
  }

  .cart-item {
    margin: 0 10px 10px 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #f5f5f5;
    border-radius: 5px;

    .show img {
      width: 100px;
      height: 100px;
    }
    .info {
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bottom {
        display: flex;
        justify-content: space-between;
        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;
          span {
            font-size: 16px;
          }
        }
        .count-box {
          display: flex;
          width: 110px;
          .add,
          .minus {
            width: 30px;
            height: 30px;
            outline: none;
            border: none;
          }
          .inp {
            width: 40px;
            height: 30px;
            outline: none;
            border: none;
            background-color: #efefef;
            text-align: center;
            margin: 0 5px;
          }
        }
      }
    }
  }
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .all-check {
    display: flex;
    align-items: center;
    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;
    .price {
      font-size: 14px;
      margin-right: 10px;
      .totalPrice {
        color: #fa2209;
        font-size: 18px;
        font-style: normal;
      }
    }

    .goPay,
    .delete {
      min-width: 100px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #fa2f21;
      color: #fff;
      border-radius: 18px;
      &.disabled {
        background-color: #ff9779;
      }
    }
  }
}
.empty-cart {
  padding: 80px 30px;
  img {
    width: 140px;
    height: 92px;
    display: block;
    margin: 0 auto;
  }
  .tips {
    text-align: center;
    color: #666;
    margin: 30px;
  }
  .btn {
    width: 110px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #fa2c20;
    border-radius: 16px;
    color: #fff;
    display: block;
    margin: 0 auto;
  }
}
</style>
