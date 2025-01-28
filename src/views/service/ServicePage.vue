<template>
  <div>
    <!-- 客服 -->

    <h3 style="font-weight: normal">智识星神---博识尊</h3>
    <br />
    <br />
    <input type="text" placeholder="向博识尊发问吧" v-model="inputValue" />
    <button @click="getInp">确认</button>
    <br />
    <br />
    <div v-if="response && response.choices && response.choices.length > 0">
      <p>{{ response.choices[0].message.content }}</p>
    </div>

    <div v-else>
      <p>博识尊正在思考...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const response = ref(null)

const getInp = async () => {
  try {
    // eslint-disable-next-line no-undef
    showLoadingToast({
      message: '嘘，博识尊正在思考...',
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0,
    })
    const myHeaders = new Headers()
    myHeaders.append('Authorization', 'Bearer MC-353741EE7DA140A4AF5BC79F8336D72D')
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            '你是游戏崩坏星穹铁道设定中的博识尊，你是智识星神，宇宙中俯瞰众生，全知全能的存在。',
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
