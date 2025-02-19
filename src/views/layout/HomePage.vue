<script setup>
import { onMounted } from 'vue'
import { getHomeData } from '@/api/home'
import { ref } from 'vue'
import Goods_item from '@/components/Goods_item.vue'

const bannerList = ref([])
const navList = ref([])
const goodsList = ref([])
const isLoading = ref(false) // 加载状态
const page = ref(0) // 当前页码
onMounted(async () => {
  await loadData()
})
const loadData = async () => {
  isLoading.value = true

  const {
    data: { pageData },
  } = await getHomeData(page.value)
  bannerList.value = pageData.items[1].data
  navList.value = pageData.items[3].data
  goodsList.value = [...goodsList.value, ...pageData.items[6].data]

  isLoading.value = false
}
</script>

<template>
  <van-nav-bar title="购物商城" />

  <van-search @click="$router.push('/search')" shape="round" placeholder="请输入搜索关键词" />

  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="item in bannerList" :key="item.imgUrl"
      ><img :src="item.imgUrl" alt=""
    /></van-swipe-item>
  </van-swipe>
  <van-grid column-num="5" icon-size="40">
    <van-grid-item
      v-for="item in navList"
      :key="item.imgUrl"
      :icon="item.imgUrl"
      text="新品首发"
      @click="$router.push('/category')"
    />
  </van-grid>
  <!-- 主会场 -->
  <div class="main">
    <img src="@/assets/main.png" alt="" />
  </div>
  <!-- 猜你喜欢 -->
  <div class="guess">
    <p class="guess-title">—— 猜你喜欢 ——</p>

    <div class="goods-list">
      <Goods_item v-for="item in goodsList" :key="item.goods_id" :item="item"></Goods_item>
    </div>
    <!-- 加载提示 -->
    <div v-if="isLoading">加载中...</div>
  </div>
</template>

<style lang="less" scoped>
.van-nav-bar {
  background: linear-gradient(180deg, #fcd6d3, #fff3f3);
  z-index: 999;
}
.van-search {
  border-radius: 100px;
  z-index: 999;

  --van-search-content-background: rgb(244, 242, 242);
}
.my-swipe .van-swipe-item {
  height: 185px;
  color: #fff;
  font-size: 20px;
  text-align: center;
}
.my-swipe .van-swipe-item img {
  width: 100%;
  height: 185px;
}
.main img {
  display: block;
  width: 100%;
}
// 猜你喜欢
.guess .guess-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
}

// 商品样式
.goods-list {
  background: linear-gradient(180deg, #ffd8d6, #fff3f3);
  margin-bottom: 40px;
}
</style>
