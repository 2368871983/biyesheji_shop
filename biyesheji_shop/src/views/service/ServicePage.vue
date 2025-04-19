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
    <van-dropdown-menu direction="up">
      <van-dropdown-item v-model="value1" :options="option1" />
    </van-dropdown-menu>
    <!-- <van-field v-model="inputValue" placeholder="" clearable class="input-field" /> -->
    <van-field
      v-model="inputValue"
      rows="2"
      autosize
      type="textarea"
      maxlength="30"
      placeholder="向客服发问吧"
      show-word-limit
    />
    <van-cell-group inset> </van-cell-group>
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
// 初始化选中的 model
const value1 = ref('qwen-plus-latest')
// 定义所有 model 选项
const option1 = [
  { text: 'qwen-plus-latest - 综合商品咨询、订单处理', value: 'qwen-plus-latest' },
  { text: 'qwen-max-latest - 复杂商品疑问解答、客户投诉处理', value: 'qwen-max-latest' },
  { text: 'qwen-turbo-latest - 快速商品信息查询、简单订单查询', value: 'qwen-turbo-latest' },
  {
    text: 'qwen2.5-14b-instruct-1m - 多轮对话商品推荐、个性化服务',
    value: 'qwen2.5-14b-instruct-1m',
  },
  { text: 'qwen-math-plus-latest - 价格计算、促销优惠核算', value: 'qwen-math-plus-latest' },
  { text: 'qwen-coder-plus-latest - 系统故障反馈、技术支持咨询', value: 'qwen-coder-plus-latest' },
  {
    text: 'qwen2.5-vl-32b-instruct - 多媒体商品展示咨询、虚拟试用指导',
    value: 'qwen2.5-vl-32b-instruct',
  },
  {
    text: 'qwen2.5-vl-72b-instruct - 高端商品详细介绍、定制服务咨询',
    value: 'qwen2.5-vl-72b-instruct',
  },
  { text: 'qwen-vl-max-latest - 全方位商品对比、竞品分析', value: 'qwen-vl-max-latest' },
  { text: 'qwen-vl-plus-latest - 商品视觉效果咨询、包装设计建议', value: 'qwen-vl-plus-latest' },
  { text: 'qvq-max - 客户满意度调查、售后评价分析', value: 'qvq-max' },
  { text: 'qwq-32b - 常规商品库存查询、补货提醒', value: 'qwq-32b' },
  { text: 'qwq-plus - 会员服务咨询、积分兑换指导', value: 'qwq-plus' },
  { text: 'GLM-4-Plus - 跨境商品咨询、国际物流查询', value: 'GLM-4-Plus' },
  { text: 'GLM-4-Air - 基础商品信息获取、物流状态查询', value: 'GLM-4-Air' },
  { text: 'GLM-4-Flash - 紧急订单处理、限时促销解答', value: 'GLM-4-Flash' },
  { text: 'GLM-Z1-Air - 商品分类导航、搜索建议', value: 'GLM-Z1-Air' },
  { text: 'GLM-Z1-AirX - 新商品上架预告、预售咨询', value: 'GLM-Z1-AirX' },
  { text: 'GLM-Z1-Flash - 秒杀活动咨询、抢购帮助', value: 'GLM-Z1-Flash' },
  { text: 'GLM-4-Long - 长期订单跟踪、大客户服务', value: 'GLM-4-Long' },
  { text: 'GLM-4V-Plus - 商品视频介绍咨询、直播购物指导', value: 'GLM-4V-Plus' },
  { text: 'GLM-4V-Flash - 视频商品快速查询、优惠活动介绍', value: 'GLM-4V-Flash' },
  { text: 'Doubao-1.5-pro-32k - 商品推荐算法咨询、精准营销分析', value: 'Doubao-1.5-pro-32k' },
  { text: 'Doubao-1.5-pro-256k - 大规模客户数据处理、市场趋势分析', value: 'Doubao-1.5-pro-256k' },
  { text: 'Doubao-1.5-lite-32k - 简单商品问答、常见问题解答', value: 'Doubao-1.5-lite-32k' },
  {
    text: 'Doubao-1.5-vision-pro-32k - 商品图片识别咨询、视觉搜索帮助',
    value: 'Doubao-1.5-vision-pro-32k',
  },
  {
    text: 'Doubao-pro-32k-character - 特色商品介绍、文化背景讲解',
    value: 'Doubao-pro-32k-character',
  },
  { text: 'deepseek-chat - 日常客户交流、购物引导', value: 'deepseek-chat' },
  { text: 'deepseek-reasoner - 退货原因分析、纠纷处理建议', value: 'deepseek-reasoner' },
  { text: 'deepseek-v3-free - 基础免费商品服务咨询', value: 'deepseek-v3-free' },
  { text: 'deepseek-r1-free - 免费售后服务咨询、退换货流程指导', value: 'deepseek-r1-free' },
  { text: 'deepseek-v3-aliyun - 基于阿里云平台的商城服务咨询', value: 'deepseek-v3-aliyun' },
  { text: 'deepseek-r1-aliyun - 阿里云相关售后技术支持', value: 'deepseek-r1-aliyun' },
  { text: 'deepseek-v3-baiduyun - 基于百度云平台的商城服务咨询', value: 'deepseek-v3-baiduyun' },
  { text: 'deepseek-r1-baiduyun - 百度云相关售后技术支持', value: 'deepseek-r1-baiduyun' },
  { text: 'deepseek-v3-tencent - 基于腾讯云平台的商城服务咨询', value: 'deepseek-v3-tencent' },
  { text: 'deepseek-r1-tencent - 腾讯云相关售后技术支持', value: 'deepseek-r1-tencent' },
  { text: 'deepseek-v3-volcengine - 基于火山引擎的商城服务咨询', value: 'deepseek-v3-volcengine' },
  { text: 'deepseek-r1-volcengine - 火山引擎相关售后技术支持', value: 'deepseek-r1-volcengine' },
  {
    text: 'deepseek-v3-siliconflow - 基于硅基流动平台的商城服务咨询',
    value: 'deepseek-v3-siliconflow',
  },
  {
    text: 'deepseek-r1-siliconflow - 硅基流动平台相关售后技术支持',
    value: 'deepseek-r1-siliconflow',
  },
  { text: 'deepseek-r1-minimax - 基于MiniMax合作的商城服务咨询', value: 'deepseek-r1-minimax' },
  { text: 'MiniMax-Text-01 - 文本类商品描述优化、文案撰写建议', value: 'MiniMax-Text-01' },
  { text: 'abab7-chat-preview - 新功能试用咨询、用户反馈收集', value: 'abab7-chat-preview' },
  { text: 'abab6.5s-chat - 稳定版基础聊天服务、常规问题解答', value: 'abab6.5s-chat' },
  { text: 'hunyuan-lite - 轻量级商品咨询、快速响应服务', value: 'hunyuan-lite' },
  { text: 'hunyuan-turbos-latest - 高速订单处理、快速咨询响应', value: 'hunyuan-turbos-latest' },
  { text: 'hunyuan-t1-latest - 特色商品服务、专属客户咨询', value: 'hunyuan-t1-latest' },
  {
    text: 'hunyuan-large-longcontext - 复杂购物流程指导、长对话服务',
    value: 'hunyuan-large-longcontext',
  },
  { text: 'hunyuan-vision - 商品视觉设计咨询、图片优化建议', value: 'hunyuan-vision' },
  { text: 'ernie-4.5-8k-preview - 新功能预览咨询、8K 商品展示说明', value: 'ernie-4.5-8k-preview' },
  {
    text: 'ernie-x1-32k-preview - 32K 数据量商品分析咨询、新功能预览',
    value: 'ernie-x1-32k-preview',
  },
  { text: 'ernie-4.0-turbo-128k - 超大规模订单处理、128K 数据咨询', value: 'ernie-4.0-turbo-128k' },
  { text: 'ernie-3.5-128k - 128K 数据量商品管理咨询、稳定服务', value: 'ernie-3.5-128k' },
  { text: 'ernie-speed-128k - 128K 数据快速查询、极速服务', value: 'ernie-speed-128k' },
  { text: 'yi-large - 大规模商品分类管理、全局商品咨询', value: 'yi-large' },
  { text: 'yi-lightning - 闪电式商品咨询、快速响应', value: 'yi-lightning' },
  { text: 'yi-medium-200k - 200K 数据量商品分析、中等规模服务', value: 'yi-medium-200k' },
  { text: 'yi-vision - 商品视觉识别咨询、图像搜索服务', value: 'yi-vision' },
  { text: 'Baichuan4-Turbo - 高性能商品咨询、快速决策支持', value: 'Baichuan4-Turbo' },
  { text: 'Baichuan4-Air - 轻量级商品服务、基础咨询', value: 'Baichuan4-Air' },
  { text: 'Baichuan3-Turbo-128k - 128K 数据量的高性能订单处理', value: 'Baichuan3-Turbo-128k' },
  { text: 'Lite - 简洁商品咨询、基础服务', value: 'Lite' },
  { text: 'Max-32K - 32K 数据量商品服务、高级咨询', value: 'Max-32K' },
  { text: '4.0Ultra - 超高级商品服务、极致体验咨询', value: '4.0Ultra' },
  { text: 'kimi-latest - 特色商品互动咨询、个性化服务', value: 'kimi-latest' },
  { text: 'gpt-4o-mini - 小型商品咨询、简洁问答', value: 'gpt-4o-mini' },
  { text: 'gpt-4.1 - 综合购物咨询、智能决策支持', value: 'gpt-4.1' },
  { text: 'gpt-4.1-mini - 轻量级商品问答、快速反馈', value: 'gpt-4.1-mini' },
  { text: 'gpt-4.1-nano - 极小型商品咨询、简短问答', value: 'gpt-4.1-nano' },
  { text: 'gpt-4o - 常规购物咨询、通用服务', value: 'gpt-4o' },
  { text: 'gpt-4o-free - 免费购物咨询、基础服务', value: 'gpt-4o-free' },
  { text: 'gpt-4o-image - 商品图片相关咨询、图像识别服务', value: 'gpt-4o-image' },
  { text: 'gpt-4.5-preview - 新功能预览咨询、前沿购物服务', value: 'gpt-4.5-preview' },
  { text: 'o3-mini - 小型商城功能咨询、基础服务', value: 'o3-mini' },
  { text: 'o1 - 基础商城服务咨询、通用问答', value: 'o1' },
  { text: 'Claude-3.5-Sonnet - 商品文案创作、诗意化商品介绍', value: 'Claude-3.5-Sonnet' },
  { text: 'claude-3.7-sonnet - 高级商品文案创作、深度商品解读', value: 'claude-3.7-sonnet' },
  {
    text: 'claude-3.7-sonnet-thinking - 商品战略思考、市场分析建议',
    value: 'claude-3.7-sonnet-thinking',
  },
  { text: 'claude-3.7-sonnet-free - 免费商品文案创作、基础解读', value: 'claude-3.7-sonnet-free' },
  {
    text: 'claude-3.7-sonnet-thinking-free - 免费市场分析建议、基础思考',
    value: 'claude-3.7-sonnet-thinking-free',
  },
  { text: 'gemini-1.5-pro - 专业商品咨询、高级服务', value: 'gemini-1.5-pro' },
  {
    text: 'gemini-2.5-pro-preview-03-25 - 2025 年 3 月 25 日新功能预览专业商品咨询',
    value: 'gemini-2.5-pro-preview-03-25',
  },
  {
    text: 'gemini-2.0-flash-exp-image-generation - 商品图片快速生成、实验性服务',
    value: 'gemini-2.0-flash-exp-image-generation',
  },
  { text: 'gemini-2.0-flash-001 - 版本 001 快速商品服务、高效咨询', value: 'gemini-2.0-flash-001' },
  { text: 'gemini-2.0-flash-lite - 轻量级快速商品服务、基础咨询', value: 'gemini-2.0-flash-lite' },
  { text: 'grok-3 - 综合购物洞察、智能分析服务', value: 'grok-3' },
  { text: 'grok-3-reasoning - 购物决策推理、问题解决建议', value: 'grok-3-reasoning' },
  { text: 'grok-3-deepsearch - 深度商品搜索、隐藏信息挖掘', value: 'grok-3-deepsearch' },
  { text: 'grok-3-search - 商品搜索优化、高效查询服务', value: 'grok-3-search' },
]

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
      model: value1.value,
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
    inputValue.value = ''
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
  width: 80px;
}

.input-field {
  flex: 1;
}

.send-button {
  width: 100px;
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
  word-wrap: break-word;
  max-width: 50%;
  margin-left: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
}

.model-select {
  position: relative;
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
  .option {
    position: absolute;
    top: -100%;
    left: 0;
  }
  &:focus {
    outline: none;
    border-color: #409eff;
  }
}
</style>
