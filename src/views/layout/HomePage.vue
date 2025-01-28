<template>
  <div></div>
  <van-floating-bubble
    @click="onClick"
    axis="xy"
    icon="chat"
    magnetic="x"
    @offset-change="onOffsetChange"
  />
</template>

<script setup>
const onOffsetChange = (offset) => {
  // eslint-disable-next-line no-undef
  showToast(`x: ${offset.x.toFixed(0)}, y: ${offset.y.toFixed(0)}`)
}
const onClick = () => {
  location.href = '/service'
}
</script>

<style lang="scss" scoped></style>
