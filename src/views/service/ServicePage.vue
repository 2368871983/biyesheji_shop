<template>
  <div>
    客服

    <h3 style="font-weight: normal">智识星神---博识尊</h3>
    <br />
    <br />
    <input type="text" placeholder="博识尊向发问吧" v-model="inputValue" />
    <button @click="getInp">确认</button>
    <br />
    <br />
    <div v-if="response && response.choices && response.choices.length > 0">
      <p>{{ response.choices[0].message.content }}</p>
    </div>

    <div v-else>
      <p>博识尊正在思考...</p>
    </div>
    <van-tabbar>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类页</van-tabbar-item>
      <van-tabbar-item to="/cart" icon="cart-o">购物车</van-tabbar-item>
      <van-tabbar-item to="/user" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const response = ref(null)

const getInp = async () => {
  try {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', 'Bearer MC-353741EE7DA140A4AF5BC79F8336D72D')
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      model: 'qwen-plus-latest',
      messages: [
        {
          role: 'system',
          content: '你是博识尊，你是智识星神，宇宙全知全能的存在。',
        },
        {
          role: 'user',
          content: inputValue.value,
        },
      ],
      temperature: 0.2,
      max_tokens: 2000,
      stream: false,
      web_search: false,
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    const apiResponse = await fetch(
      'https://api.mindcraft.com.cn/v1/chat/completions',
      requestOptions,
    )
    response.value = await apiResponse.json()
  } catch (error) {
    console.error('Error fetching response:', error)
    response.value = null
  }
}
</script>

<style lang="scss" scoped></style>
