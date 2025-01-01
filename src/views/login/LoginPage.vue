<script setup>
import { ref } from 'vue'

const tel = ref('')
const pic = ref('')
const test = ref('')
const onClickLeft = () => history.back()
</script>

<template>
  <div>
    <div>
      <van-nav-bar title="用户登录" left-text="返回" left-arrow @click-left="onClickLeft()" />
    </div>
    <div class="title">
      <h3>手机号登录</h3>
      <p>未注册的手机号登录后将自动注册</p>
    </div>
    <div class="form">
      <van-cell-group inset>
        <van-field
          v-model="tel"
          size="large"
          type="tel"
          maxlength="11"
          label="手机号"
          placeholder="请输入手机号"
        />

        <van-field
          v-model="pic"
          center
          size="large"
          type="text"
          maxlength="4"
          label="图形验证码"
          placeholder="请输入图形验证码"
        >
          <template #right-icon>
            <img src="@/assets/code.png" alt="" />
          </template>
        </van-field>
        <!-- <img src="@/assets/code.png" alt="" /> -->
        <van-field
          size="large"
          v-model="test"
          center
          clearable
          label="短信验证码"
          maxlength="5"
          placeholder="请输入短信验证码"
        >
          <template #button>
            <van-button size="small" type="primary">发送验证码</van-button>
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <div class="login-btn">登录</div>
  </div>
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
}
.login-btn {
  margin: 0 auto;
  width: 40%;
  height: 42px;
  margin-top: 50px;
  background: linear-gradient(90deg, #7bb7ec, #1989fa);
  color: #fff;
  border-radius: 39px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  letter-spacing: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
