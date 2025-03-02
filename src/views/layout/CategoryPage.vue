<script setup>
import { ref } from 'vue'
const active = ref(1)
console.log(active.value)
const emit = defineEmits(['updateActive'])
import { onMounted } from 'vue'
const activeIndex = ref(0)
const items = ref([])
const children = ref([])
const list = ref([])

onMounted(() => {
  emit('updateActive', active.value)
  lodaCategory()
})
// 渲染
const lodaCategory = () => {
  const res = getCategoryList()
  console.log(res)
}
import { getCategoryData } from '@/api/category'
const getCategoryList = async () => {
  const res = await getCategoryData()
  console.log(res)
  items.value = res.data.list.map((item) => ({
    text: item.name,
  }))
  list.value = res.data.list
  children.value = res.data.list.map((item) => (children.value = item.children))
  console.log(children.value)
}
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
      :items="items"
    >
      <template #content>
        <div v-if="list[activeIndex]?.children && list[activeIndex].children.length > 0">
          <van-grid :border="false" :column-num="3">
            <van-grid-item
              @click="$router.push(`/prodetail/${item.category_id}`)"
              v-for="(item, index) in list[activeIndex]?.children"
              :key="index"
            >
              <van-image :src="item.image.external_url" />
              <div style="margin-top: 5px">{{ item?.name }}</div>
            </van-grid-item>
          </van-grid>
        </div>
        <div v-else>
          <van-grid :border="false" :column-num="3">
            <van-skeleton-image v-for="value in 6" :key="value" />
          </van-grid>
        </div>
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
