<script setup>
import { ref } from 'vue'
const current = ref(0)
const images = ref([])
const onClickLeft = () => history.back()
const goodsDataList = ref({})
const goods_name = ref('')
const goods_price_max = ref('')
const goods_sales = ref('')
const line_price_max = ref('')
const goods_price_min = ref('')
const content = ref('')
const commentList = ref([])
const commenttotal = ref(0)
const score = ref(0)
const stock = ref(0)
const defaultList = ref([])
const barrage = ref()
const danmulist = ref([...defaultList.value])
const proserviceList = ref([])
const total = ref(1)
import { watch } from 'vue'
watch(total, (newValue) => {
  console.log(newValue)
})
// 轮播
const onChange = (index) => {
  current.value = index
}
// 图片预览
const showPic = (index) =>
  // eslint-disable-next-line no-undef
  showImagePreview({
    images: images.value,
    startPosition: index,
    closeable: true,
  })
// 获取商品详情数据
import { onMounted } from 'vue'
import { getProdetailData, getProComment, getProService } from '@/api/prodetail'
import { useRoute } from 'vue-router'

import defaultImg from '@/assets/default-avatar.png'

// 获取路由对象
const route = useRoute()
// 从路由参数中获取 goodsId
const goodsId = ref(route.params.id)
onMounted(async () => {
  await loadData(goodsId.value)
  await loadProComment(goodsId.value)
  await loadProService(goodsId.value)
})
// 商品数据
const loadData = async (id) => {
  const {
    data: { detail },
  } = await getProdetailData(id)
  console.log({
    data: { detail },
  })
  goodsDataList.value = detail
  console.log(goodsDataList.value)

  images.value = detail.goods_images.map((item) => item.external_url)
  goods_name.value = detail.goods_name
  goods_price_max.value = detail.goods_price_max
  goods_price_min.value = detail.goods_price_min
  line_price_max.value = detail.line_price_max
  goods_sales.value = detail.goods_sales
  content.value = detail.content

  stock.value = detail.stock_total
}
// 评论数据
const loadProComment = async (id) => {
  const {
    data: { list, total },
  } = await getProComment(id, 5)

  commenttotal.value = total
  commentList.value = list
  // 弹幕
  defaultList.value = [
    ...list.map((item, index) => ({
      id: 100 + index,
      text: item.content.length > 10 ? item.content.slice(0, 10) + '...' : item.content,
    })),
  ]

  danmulist.value = [...defaultList.value]

  score.value = list.map((item) => ({
    ...item,
    score: item.score / 2,
  }))
}

// 商品保障弹窗
const loadProService = async (id) => {
  const { data } = await getProService(id)

  proserviceList.value = data.list
}
const showService = ref(false)
const showServicePopup = () => {
  showService.value = true
}

// 购物车弹窗
const showmode = ref('')
const show = ref(false)
const showPopup = (mode) => {
  show.value = true
  showmode.value = mode
}

// 计数组件
import CountBox from '@/components/CountBox.vue'

// 加入购物车
import { useUserStore } from '@/stores'
const userStore = useUserStore()
console.log(userStore.token)
import router from '@/router'
import { addCartData } from '@/api/cart'
const addCart = async () => {
  if (!userStore.token) {
    router.push({
      path: '/login',
      query: {
        backUrl: 'notoken',
      },
    })
  }

  const res = await addCartData({
    goodsId: goodsDataList.value.goods_id,
    goodsNum: total.value,
    goodsSkuId: goodsDataList.value.skuList[0].goods_sku_id,
  })
  // eslint-disable-next-line no-undef
  showToast({ duration: 800, message: '成功加入购物车！' })
  console.log(res)
}
</script>
<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="onClickLeft" />

    <div class="danmu">
      <van-barrage rows="5" ref="barrage" v-model="danmulist">
        <div class="video" delay="300" duration="3000" style="width: 100%; height: 150px"></div>
      </van-barrage>
    </div>

    <div style="position: relative; z-index: 0">
      <van-swipe lazy-render :autoplay="3000" @change="onChange">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img @click="showPic(current)" :src="image" />
        </van-swipe-item>

        <template #indicator>
          <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
        </template>
      </van-swipe>
    </div>

    <div style="position: relative">
      <!-- 商品说明 -->
      <div class="info">
        <div class="title">
          <div class="price">
            <span class="now">￥{{ goods_price_min }}</span>
            <span class="oldprice">￥{{ goods_price_max }}</span>
          </div>
          <div class="sellcount">已售{{ goods_sales }}件</div>
        </div>
        <div class="msg text-ellipsis-2">
          {{ goods_name }}
        </div>

        <div @click="showServicePopup" class="service">
          <div class="left-words">
            <span v-for="item in proserviceList" :key="item.service_id"
              >{{ item.name }}<van-icon name="passed" />
            </span>
          </div>
          <div class="right-icon">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <van-action-sheet
        style="
          background-image: linear-gradient(to bottom left, #f9db8d 15%, #fff 50%, #f9db8d 85%);
        "
        v-model:show="showService"
        title="服务安心保障"
      >
        <div style="display: flex; justify-content: center; align-items: center">
          <div style="margin: 10px; border-radius: 10px" class="serviceContent">
            <div v-for="item in proserviceList" :key="item.service_id" class="serviceWords">
              <van-icon name="award" />"{{ item.summary }}"
            </div>
          </div>
        </div>
      </van-action-sheet>

      <!-- 商品评价 -->
      <div class="comment">
        <div class="comment-title">
          <div class="left">商品评价 ({{ commenttotal }}条)</div>
          <div class="right">查看更多 <van-icon name="arrow" /></div>
        </div>
        <div class="comment-list">
          <div class="comment-item" v-for="item in commentList" :key="item.comment_id">
            <div class="top">
              <img :src="item.user.avatar_url || defaultImg" alt="" />
              <div class="name">{{ item.user.nick_name }}</div>
              <van-rate
                v-model="item.score"
                :size="16"
                color="#ffd21e"
                void-icon="star"
                void-color="#eee"
              />
            </div>
            <div class="content">
              {{ item.content.length > 10 ? item.content.slice(0, 10) + '......' : item.content }}
            </div>
            <div class="time">{{ item.create_time }}</div>
          </div>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="desc" v-html="content"></div>
      <!-- 购物车弹窗 -->
      <van-action-sheet v-model:show="show" title="加入购物车">
        <div class="content">
          <div class="product">
            <div class="left">
              <img :src="goodsDataList.goods_image" alt="" />
            </div>
            <div class="right">
              <div class="price">
                <span class="rmb">¥</span>
                <span class="num">{{ goods_price_min }}</span>
              </div>
              <div class="count">
                <span>库存 {{ stock }}</span>
              </div>
            </div>
          </div>
          <div class="count-box">
            <span>数量:</span>
            <CountBox v-model:total="total" />
          </div>
          <div class="btn">
            <div class="showbtn" v-if="stock > 0">
              <div @click="addCart" class="cartbtn" v-if="showmode == 'cart'">加入购物车</div>
              <div class="buybtn" v-if="showmode == 'buy'">立即购买</div>
            </div>

            <div class="hidebtn" v-else>
              <div>该商品已售罄</div>
            </div>
          </div>
        </div>
      </van-action-sheet>
      <!-- 底部 -->
      <div class="footer">
        <div class="icon-home">
          <van-icon name="wap-home-o" />
          <span @click="$router.push('/home')">首页</span>
        </div>
        <div class="icon-cart">
          <van-icon name="shopping-cart-o" />
          <span @click="$router.push('/cart')">购物车</span>
        </div>
        <div class="btn-add" @click="showPopup('cart')">加入购物车</div>
        <div class="btn-buy" @click="showPopup('buy')">立刻购买</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.van-nav-bar {
  background: linear-gradient(180deg, #fcd6d3, #fff3f3);
  z-index: 999;
  --van-nav-bar-icon-color: grey;
}
.prodetail {
  padding-top: 46px;
  :v-deep(.van-icon-arrow-left) {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .danmu {
    width: 100%;
    position: absolute;
    z-index: 2;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    :v-deep(img) {
      display: block;
      width: 100% !important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .time {
      color: #999;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-home,
    .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
    }
    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
  }
}

.tips {
  padding: 10px;
}
.product {
  display: flex;
  .left {
    width: 150px;
    height: 150px;
    padding: 10px;
    margin-left: 20px;
    .img {
      width: 90px;
      height: 90px;
    }
  }
  .right {
    flex: 1;
    padding: 10px;
    .rmb {
      color: #fe560a;
    }
    .num {
      color: #fe560a;
      font-size: 24px;
      margin: 5px;
    }
    .count {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      color: grey;
    }
  }
}
.count-box {
  display: flex;
  margin: 10px 10px 10px 20px;
  justify-content: space-between;
  align-items: center;
}
.showbtn {
  height: 40px;
  line-height: 40px;
  margin: 20px;

  text-align: center;
  color: rgb(255, 255, 255);
  .cartbtn {
    background-color: rgb(255, 148, 2);
    border-radius: 20px;
  }
  .buybtn {
    background-color: #fe5630;
    border-radius: 20px;
  }
}

.hidebtn {
  height: 40px;
  line-height: 40px;
  margin: 20px;
  border-radius: 20px;
  text-align: center;
  color: rgb(255, 255, 255);
  background-color: rgb(167, 167, 167);
}
.serviceContent {
  display: flex;
  width: 80%;
  height: 200px;
  flex-direction: column;
  .serviceWords {
    display: flex;

    align-items: center; /* 垂直居中 */
    margin: 10px;
    font-size: 18px;
    flex: 1;
    color: #9a4b00; /* 调整字体颜色 */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 添加文字阴影 */
  }
}
</style>
