<script setup></script>

<template>
  <van-nav-bar title="购物商城" />

  <van-search @click="$router.push('/search')" shape="round" placeholder="请输入搜索关键词" />

  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item><img src="@/assets/banner1.jpg" alt="" /></van-swipe-item>
    <van-swipe-item><img src="@/assets/banner2.jpg" alt="" /></van-swipe-item>
    <van-swipe-item><img src="@/assets/banner3.jpg" alt="" /></van-swipe-item>
  </van-swipe>
  <van-grid column-num="5" icon-size="40">
    <van-grid-item
      v-for="item in 10"
      :key="item"
      icon="@/assets/nav1.png"
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
      <GoodsItem v-for="item in 10" :key="item"></GoodsItem>
    </div>
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
  background-color: #f6f6f6;
}
</style>
