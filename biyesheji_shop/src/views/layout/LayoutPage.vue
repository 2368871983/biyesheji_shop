<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'
const router = useRouter()
const active = ref(0)
const activeChange = () => {
  switch (router.currentRoute.value.path) {
    case '/home':
      active.value = 0
      break
    case '/category':
      active.value = 1
      break
    case '/cart':
      active.value = 2
      break
    case '/user':
      active.value = 3
      break
  }
}
onMounted(() => {
  // 根据当前路由路径设置 active 的初始值
  activeChange()
})
watch(
  () => router.currentRoute.value.path,
  () => {
    activeChange()
  },
)
</script>
<template>
  <div>
    <router-view></router-view>

    <van-tabbar v-model="active">
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类页</van-tabbar-item>
      <van-tabbar-item to="/cart" icon="cart-o">购物车</van-tabbar-item>
      <van-tabbar-item to="/user" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped></style>
