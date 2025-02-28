<script setup>
import { ref } from 'vue'
const active = ref(1)
console.log(active.value)
const emit = defineEmits(['updateActive'])
import { onMounted } from 'vue'
const activeIndex = ref(0)
const items = [
  { text: '分组 1' },
  { text: '分组 2' },
  { text: '分组 1' },
  { text: '分组 2' },
  { text: '分组 1' },
  { text: '分组 2' },
  { text: '分组 1' },
  { text: '分组 2' },
  { text: '分组 1' },
  { text: '分组 2' },
  { text: '分组 1' },
  { text: '分组 2' },
  { text: '分组 1' },
  { text: '分组 2' },
  { text: '分组 1' },
  { text: '分组 2' },
  { text: '分组 1' },
  { text: '分组 2' },
  { text: '分组 1' },
  { text: '分组 2' },
]
onMounted(() => {
  emit('updateActive', active.value)
})
</script>
<template>
  <div>
    <van-nav-bar class="nav-bar" title="商品分类" />
    <van-search @click="$router.push('/search')" shape="round" placeholder="请输入搜索关键词" />
  </div>
  <div class="list-box">
    <van-tree-select
      v-model:main-active-index="activeIndex"
      height="100vh
      "
      style="overflow: auto"
      :items="items"
    >
      <template #content>
        <van-grid :border="false" :column-num="3">
          <van-grid-item>
            <van-image src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg" />
          </van-grid-item>
          <van-grid-item>
            <van-image src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg" />
          </van-grid-item>
          <van-grid-item>
            <van-image src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg" />
          </van-grid-item>
        </van-grid>
      </template>
    </van-tree-select>
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
.van-search {
  z-index: 1;
  position: fixed;
  top: 45px;
  width: 100%;

  --van-search-content-background: rgb(244, 242, 242);
}
.list-box {
  position: fixed;
  top: 100px;
  height: 100%;
  display: flex;
}
</style>
