<script setup>
const onOffsetChange = (offset) => {
  // eslint-disable-next-line no-undef
  showToast(`x: ${offset.x.toFixed(0)}, y: ${offset.y.toFixed(0)}`)
}
import { useRouter } from 'vue-router'
const router = useRouter()
const onClick = () => {
  router.push('/service')
}
</script>
<template>
  <div>
    UserPage
    <van-floating-bubble
      @click="onClick"
      axis="xy"
      icon="chat"
      magnetic="x"
      @offset-change="onOffsetChange"
    />
  </div>
</template>

<style lang="scss" scoped></style>
