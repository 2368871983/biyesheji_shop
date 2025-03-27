<script setup>
import { ref, onMounted } from 'vue'
import { getHomeData } from '@/api/home'
import Goods_item from '@/components/Goods_item.vue'
import router from '@/router'

const bannerList = ref([])
const navList = ref([])
const goodsList = ref([])
const isLoading = ref(false)
const finished = ref(false)
const page = ref(0)
const refreshing = ref(false)

const searchValue = ref('')
const showSearchSuggestions = ref(false)
const searchSuggestions = ref(['手机', '电脑', '衣服', '鞋子'])

onMounted(async () => {
  await loadData()
  console.log(navList.value)
})

const loadData = async () => {
  try {
    const {
      data: { pageData },
    } = await getHomeData(page.value)
    if (pageData.items[6].data.length === 0) {
      finished.value = true
    } else {
      bannerList.value = pageData.items[1].data
      navList.value = pageData.items[3].data
      goodsList.value = [...goodsList.value, ...pageData.items[6].data]
      page.value++
    }
  } catch (error) {
    console.error('数据加载失败:', error)
  } finally {
    isLoading.value = false
    refreshing.value = false
  }
}

const onRefresh = () => {
  refreshing.value = true
  page.value = 0
  goodsList.value = []
  finished.value = false
  loadData()
}

const onLoad = () => {
  isLoading.value = true
  loadData()
}

const onSearch = () => {
  console.log('搜索关键词:', searchValue.value)
  showSearchSuggestions.value = false
}

const selectSuggestion = (suggestion) => {
  searchValue.value = suggestion
  onSearch()
}
</script>

<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="isLoading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 导航栏 -->
      <van-nav-bar class="nav-bar" title="购物商城" />
      <!-- 搜索框 -->
      <van-search
        v-model="searchValue"
        @click="router.push('/search')"
        @search="onSearch"
        @focus="showSearchSuggestions = true"
        shape="round"
        placeholder="请输入搜索关键词"
      >
      </van-search>
      <van-popup v-model="showSearchSuggestions" position="top">
        <van-cell-group>
          <van-cell
            v-for="suggestion in searchSuggestions"
            :key="suggestion"
            :title="suggestion"
            @click="selectSuggestion(suggestion)"
          />
        </van-cell-group>
      </van-popup>
      <!-- 轮播图 -->
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in bannerList" :key="item.imgUrl">
          <img :src="item.imgUrl" alt="" />
        </van-swipe-item>
      </van-swipe>
      <!-- 导航网格 -->
      <van-grid column-num="5" icon-size="40">
        <van-grid-item
          v-for="item in navList"
          :key="item.imgUrl"
          :icon="item.imgUrl"
          :text="item.text"
          @click="$router.push('/category')"
        />
      </van-grid>
      <!-- 主会场 -->
      <div class="main">
        <img src="@/assets/main.png" alt="" />
      </div>
      <!-- 猜你喜欢 -->
      <div class="guess">
        <p class="guess-title">— — 猜你喜欢 — —</p>
        <div class="goods-list">
          <Goods_item v-for="item in goodsList" :key="item.goods_id" :item="item"></Goods_item>
        </div>
      </div>
      <van-loading v-if="isLoading" type="spinner" size="20px">加载中...</van-loading>
    </van-list>
  </van-pull-refresh>
  <!-- 一键回到顶部组件 -->
  <van-back-top
    style="position: fixed; right: 40px; bottom: 100px"
    class="custom-back-top"
    :visibility-height="200"
  />
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
.van-search {
  z-index: 1;
  position: fixed;
  top: 45px;
  width: 100%;
  --van-search-content-background: rgb(244, 242, 242);
}
.my-swipe .van-swipe-item {
  height: 185px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  margin-top: 100px;
}
.my-swipe .van-swipe-item img {
  width: 100%;
  height: 185px;
}
.main img {
  display: block;
  width: 100%;
}
.guess .guess-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.goods-list {
  background: linear-gradient(180deg, #ffd8d6, #fff3f3);
  margin-bottom: 40px;
}
</style>
