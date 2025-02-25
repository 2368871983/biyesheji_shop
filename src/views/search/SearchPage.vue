<script setup>
const onClickLeft = () => history.back()

import { useSearchStore } from '@/stores'
import { ref } from 'vue'
const inpValue = ref('')
const searchStore = useSearchStore()
const onClickButton = () => {
  if (inpValue.value == '') {
    // eslint-disable-next-line no-undef
    showToast('请输入搜索关键词')
  } else {
    if (searchList.value.length > 7) {
      searchList.value.shift()
    }

    searchList.value.unshift(inpValue.value)
    inpValue.value = ''

    searchList.value = new Array(...new Set(searchList.value))

    searchStore.getItem(searchList.value)
  }
}
const delHistory = () => {
  searchList.value = []
  searchStore.removeItem()
}
const searchList = ref([])
import { onMounted } from 'vue'
onMounted(() => {
  searchList.value = searchStore.searchList
})
</script>

<template>
  <div>
    <van-nav-bar title="商品搜索" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-search
      shape="round"
      v-model="inpValue"
      show-action
      placeholder="请输入搜索关键词"
      @search="onClickButton"
    >
      <template #action>
        <div @click="onClickButton">搜索</div>
      </template>
    </van-search>
  </div>
  <div class="recentSearch">
    <div>最近搜索</div>
    <van-icon @click="delHistory()" name="delete-o" />
  </div>
  <div v-if="searchList.length > 0" class="searchHistory">
    <div @click="$route.push(item)" v-for="(item, index) in searchList" :key="index" class="words">
      {{ item }}
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
.van-search {
  position: fixed;
  top: 45px;
  width: 100%;

  --van-search-content-background: rgb(244, 242, 242);
}
.recentSearch {
  display: flex;
  margin-top: 100px;
  margin: 100px 20px 10px 20px;
  justify-content: space-between;
}
.searchHistory {
  margin: 10px;
  margin-left: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .words {
    flex-basis: 30%;
    display: flex; /* 设置为弹性布局 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    text-align: center;
    background-color: rgb(244, 242, 242);
    border-radius: 10px;

    height: 30px;
    font-size: 14px;
  }
}
</style>
