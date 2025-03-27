<template>
  <van-nav-bar title="智慧客服" left-text="返回" left-arrow @click-left="onClickLeft" />
  <!-- 给聊天容器添加 ref -->
  <div ref="chatContainer" class="chat-container">
    <!-- 客服欢迎语 -->
    <div class="system-message">
      <p>您好，这里是您的专属客服！</p>
    </div>
    <!-- 合并展示用户消息和客服回复 -->
    <div
      v-for="(item, index) in chatMessages"
      :key="index"
      :class="item.type === 'user' ? 'user-message' : 'response-message'"
    >
      <p>{{ item.content }}</p>
    </div>
  </div>
  <!-- 用户输入区域 -->
  <div class="input-area">
    <select v-model="selectedModel" class="model-select">
      <option v-for="option in modelOptions" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
    <van-field v-model="inputValue" placeholder="向客服发问吧" clearable class="input-field" />
    <van-button type="primary" @click="getInp" class="send-button">发送</van-button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

// 定义聊天容器的 ref
const chatContainer = ref(null)

const onClickLeft = () => history.back()

const inputValue = ref('')
const response = ref(null)
// 合并存储聊天消息
const chatMessages = ref([])

// 定义所有 model 选项
const modelOptions = [
  { text: 'qwen-plus-latest', value: 'qwen-plus-latest' },
  { text: 'qwen-max-latest', value: 'qwen-max-latest' },
  { text: 'qwen-turbo-latest', value: 'qwen-turbo-latest' },
  // 其他模型选项...
]

// 初始化选中的 model
const selectedModel = ref('qwen-plus-latest')

const getInp = async () => {
  try {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', 'Bearer MC-353741EE7DA140A4AF5BC79F8336D72D')
    myHeaders.append('Content-Type', 'application/json')

    // 确保输入框非空
    if (!inputValue.value) {
      // eslint-disable-next-line no-undef
      showToast('请输入问题！')
      return
    }

    // 将用户输入的消息添加到聊天记录中
    chatMessages.value.push({
      type: 'user',
      content: inputValue.value,
    })

    // 预先添加一个空的响应消息到聊天记录
    const responseMessage = {
      type: 'response',
      content: '',
    }
    chatMessages.value.push(responseMessage)

    const raw = JSON.stringify({
      model: selectedModel.value,
      messages: [
        {
          role: 'system',
          content: '你是购物商城的客服',
        },
        {
          role: 'user',
          content: inputValue.value,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
      stream: true,
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
    const reader = apiResponse.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      let txt = decoder.decode(value)
      // 处理流式数据，去除可能的 'data: ' 前缀
      const lines = txt.split('\n').filter((line) => line.trim().startsWith('data:'))
      for (const line of lines) {
        const dataStr = line.replace('data:', '').trim()
        if (dataStr && dataStr !== '[DONE]') {
          try {
            const data = JSON.parse(dataStr)
            if (data.choices && data.choices.length > 0) {
              const deltaContent = data.choices[0].delta?.content
              if (deltaContent) {
                responseMessage.content += deltaContent
                chatMessages.value = [...chatMessages.value]
                // 使用 nextTick 确保 DOM 更新后滚动
                await nextTick(() => {
                  if (chatContainer.value) {
                    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
                  }
                })
              }
            }
          } catch (error) {
            console.error('解析响应数据出错:', error)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching response:', error)
    response.value = null
  }
  inputValue.value = ''
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background: linear-gradient(180deg, #fcd6d3, #fff3f3);
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.chat-container {
  padding: 15px;
  margin-top: 40px;
  padding-bottom: 70px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 46px);
  /* 添加滚动属性 */
  overflow-y: auto;
}

.system-message {
  background-color: #e6f7ff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: fit-content;
  max-width: 70%;
}

.input-area {
  display: flex;
  gap: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 15px;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
  z-index: 998;
}

.van-dropdown-menu {
  z-index: 1000;
}

.input-field {
  flex: 1;
}

.send-button {
  width: 80px;
}

.response-message {
  background-color: #e6e3e3;
  padding: 10px;
  border-radius: 8px;
  border-top-left-radius: 0;
  margin-bottom: 15px;
  max-width: 70%;
  align-self: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-message {
  background-color: #9eea6a;
  color: #333;
  padding: 10px;
  border-radius: 8px;
  border-top-right-radius: 0;
  margin-bottom: 15px;
  max-width: 50%;
  margin-left: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.model-select {
  width: 100px;
  flex: 0 0 auto;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #409eff;
  }
}
</style>
