<script setup>
import { onUnmounted, ref } from 'vue'
import request from '@/utils/request'
import router from '@/router'
import { useUserStore } from '@/stores'
// 下拉刷新
const count = ref(0)
const loading = ref(false)
const onRefresh = () => {
  setTimeout(() => {
    loading.value = false
    count.value++
    location.reload()
  }, 1000)
}

// 表单数据
const tel = ref('')
const pic = ref('')
const test = ref('')
const picdata = ref({
  picUrl: '',
  picKey: '',
})

// 获取图形验证码
const getPicData = async () => {
  const res = await request.get('/captcha/image')
  picdata.value.picUrl = res.data.base64
  picdata.value.picKey = res.data.key
  // console.log(res)
}
getPicData()

// 左上角返回
const onClickLeft = () => history.back()

// 校验规则
const pattern = /^1[3-9]\d{9}$/
const onSubmit = (values) => {
  console.log('submit', values)
}

// 获取短信验证码
let totalSecond = ref('10') // 总秒数
let second = ref('10') // 倒计时的秒数
let timer = null // 定时器 id
const getCode = async () => {
  if (!tel.value) {
    // eslint-disable-next-line no-undef
    return showToast({ duration: 1000, message: '请输入手机号！' })
  }
  const res = await request.get('/captcha/sendSmsCaptcha', {
    form: {
      tel: tel.value,
      captchaCode: picdata.value,
      captchaKey: picdata.value.picKey,
      mobile: tel.value,
    },
  })
  const code = res.message.split('测试环境验证码为: ')[1]
  test.value = ''
  if (!timer && second.value === totalSecond.value) {
    // 开启倒计时
    timer = setInterval(() => {
      second.value--
      if (second.value < 1) {
        clearInterval(timer)
        timer = null
        second.value = totalSecond.value
      }
    }, 1000)

    // 发送请求，获取验证码
    // eslint-disable-next-line no-undef
    showDialog({ message: '发送成功，请注意查收' })
  }
  setTimeout(() => {
    // eslint-disable-next-line no-undef
    showNotify({ type: 'success', message: '验证码为' + code })
  }, 1000)
}

onUnmounted(() => {
  clearInterval(timer)
})

// 登录
const getLogin = async () => {
  const res = await request.post('/passport/login', {
    form: {
      isParty: false,
      mobile: tel.value,
      partyData: {},
      smsCode: test.value,
    },
  })
  const userStore = useUserStore()
  userStore.setToken(res.data.token)

  // eslint-disable-next-line no-undef
  showToast({ duration: 800, message: '登录成功！' })
  router.push('/')
}
</script>

<template>
  <van-pull-refresh v-model="loading" @refresh="onRefresh" success-text="刷新成功">
    <div>
      <div>
        <van-nav-bar title="用户登录" left-text="返回" left-arrow @click-left="onClickLeft" />
      </div>
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>
      <div class="form">
        <van-cell-group inset>
          <van-form @submit="onSubmit">
            <van-field
              @submit="onSubmit"
              v-model="tel"
              size="large"
              type="tel"
              maxlength="11"
              label="手机号："
              placeholder="请输入手机号"
              :rules="[{ pattern, message: '请输入正确的手机号' }]"
            />

            <van-field
              v-model="pic"
              center
              size="large"
              type="text"
              maxlength="4"
              label="图形验证码："
              placeholder="请输入图形验证码"
              :rules="[{ required: true, message: '请填写图形验证码' }]"
            >
              <template #right-icon>
                <img @click="getPicData" :src="picdata.picUrl" alt="" />
              </template>
            </van-field>

            <van-field
              size="large"
              v-model="test"
              center
              clearable
              label="短信验证码："
              maxlength="6"
              placeholder="请输入短信验证码"
            >
              <template #button>
                <button :disabled="timer" @click="getCode">
                  {{ second === totalSecond ? '获取验证码' : second + `秒后重新发送` }}
                </button>
              </template>
            </van-field>
          </van-form>
        </van-cell-group>
      </div>
      <div @click="getLogin" class="login-btn">登录</div>
    </div>
  </van-pull-refresh>
</template>

<style lang="less" scoped>
.van-nav-bar {
  --van-nav-bar-height: 60px;
  --van-nav-bar-title-text-color: #323233;
  --van-nav-bar-title-font-size: 20px;
}

.title {
  margin: 30px 0 0 30px;

  h3 {
    font-size: 26px;
    font-weight: normal;
  }

  p {
    font-size: 14px;
    color: grey;
    line-height: 40px;
  }
}
.form {
  margin: 30px -10px 10px 0;
  .van-input-text-size {
    font-size: 20px;
  }
  .van-cell {
    padding: 20px 20px;
  }
  img {
    width: 80px;
    height: 30px;
  }
  button {
    height: 31px;
    border: none;
    font-size: 13px;
    color: #cea26a;
    background-color: transparent;
    padding-right: 9px;
  }
}
.login-btn {
  margin: 0 auto;
  width: 40%;
  height: 42px;
  margin-top: 50px;
  background: linear-gradient(90deg, #7ec2fd, #087ef5);
  color: #fff;
  border-radius: 39px;

  letter-spacing: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
