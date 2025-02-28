<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
const inpValue = ref('')
const searchList = ref([])
const querykey = ref('')
const historyList = ref([])
const priceRanktag = ref('0')
import { useSearchStore } from '@/stores'
const searchStore = useSearchStore()
historyList.value = searchStore.getSearchList()
// 获取当前路由实例
const route = useRoute()

// 获取路由参数
querykey.value = route.query.key
import { onMounted } from 'vue'
// 渲染
import { getSearchlist } from '@/api/searchlist'
onMounted(async () => {
  await loadSearchlist()
})
const loadSearchlist = async () => {
  const {
    data: {
      list: { data },
    },
  } = await getSearchlist({
    goodsName: querykey.value,
    sortPrice: priceRanktag.value,

    page: 1,
  })
  console.log(data)
  searchList.value = data
  if (data.length == 0) {
    // eslint-disable-next-line no-undef
    showToast('暂无商品数据')
  }
}
import { useRouter } from 'vue-router'
const router = useRouter()
const goToSearhlist = async () => {
  router.push({
    path: '/searchlist',
    query: {
      key: inpValue.value,
    },
  })
  if (inpValue.value == '') {
    // eslint-disable-next-line no-undef
    showToast('请输入搜索关键词')
    return
  } else {
    historyList.value = searchStore.getSearchList()
    historyList.value.unshift(inpValue.value)

    historyList.value = new Array(...new Set(historyList.value))

    if (historyList.value.length > 8) {
      historyList.value.pop()
    }

    searchStore.getItem(historyList.value)
    querykey.value = inpValue.value
    await loadSearchlist()
    inpValue.value = ''
  }
}
// 价格排序

const priceRank = async () => {
  priceRanktag.value = priceRanktag.value === '0' ? '1' : '0'
  await loadSearchlist()
}
const onClickLeft = () => router.push('/search')
</script>

<template>
  <div>
    <van-nav-bar title="商品列表" left-text="返回" left-arrow @click-left="onClickLeft" />

    <van-search
      @search="goToSearhlist"
      shape="round"
      show-action
      v-model="inpValue"
      :placeholder="querykey"
    >
      <template #action>
        <van-icon size="30" @click="$router.push('/category')" name="list-switching" />
      </template>
    </van-search>
  </div>
  <div class="choose">
    <div class="tag">综合</div>
    <div class="tag">销量</div>
    <div class="tag">
      售价<van-icon @click="priceRank" v-if="priceRanktag == '0'" name="ascending" />
      <van-icon @click="priceRank" v-if="priceRanktag == '1'" name="descending" />
    </div>
  </div>
  <div class="goods-list">
    <Goods_item v-for="item in searchList" :key="item.goods_id" :item="item"></Goods_item>
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
.choose {
  display: flex;
  margin: 110px 5px 5px 5px;

  .tag {
    flex: 1;
    text-align: center;
  }
}
.goods-list {
  background: linear-gradient(180deg, #ffd8d6, #fff3f3);
  margin-bottom: 40px;
  margin-top: 20px;
}
</style>
