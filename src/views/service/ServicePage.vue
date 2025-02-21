<template>
  <van-nav-bar title="智慧客服" left-text="返回" left-arrow @click-left="onClickLeft" />
  <div>
    <!-- 客服 -->

    <br />
    <input type="text" placeholder="向客服发问吧" v-model="inputValue" />
    <button @click="getInp">确认</button>
    <br />
    <br />
    <div v-if="response && response.choices && response.choices.length > 0">
      <p>{{ response.choices[0].message.content }}</p>
    </div>

    <div v-else>
      <p>您好，这里是您的专属客服！</p>
    </div>
  </div>
</template>

<script setup>
const onClickLeft = () => history.back()
import { ref } from 'vue'

const inputValue = ref('')
const response = ref(null)

const getInp = async () => {
  try {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', 'Bearer MC-353741EE7DA140A4AF5BC79F8336D72D')
    myHeaders.append('Content-Type', 'application/json')

    // 确保输入框非空
    if (!inputValue.value) {
      console.error('请输入问题！')
      return
    } else {
      // eslint-disable-next-line no-undef
      showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0,
      })
    }

    const raw = JSON.stringify({
      model: 'deepseek-reasoner',
      messages: [
        {
          role: 'system',
          content: '你是移动购物app的客服',
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
    }
    const apiResponse = await fetch(
      'https://api.mindcraft.com.cn/v1/chat/completions',
      requestOptions,
    )
    response.value = await apiResponse.json()
    // 隐藏加载中的提示框
    // eslint-disable-next-line no-undef
    closeToast()
  } catch (error) {
    console.error('Error fetching response:', error)
    response.value = null
  }
  inputValue.value = ''
}
</script>

<style lang="scss" scoped></style>
