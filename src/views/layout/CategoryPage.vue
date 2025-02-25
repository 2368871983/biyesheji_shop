<script setup>
import { ref } from 'vue'
const active = ref(1)
console.log(active.value)
const emit = defineEmits(['updateActive'])
import { onMounted } from 'vue'
onMounted(() => {
  emit('updateActive', active.value)
})
</script>
<template>
  <div>category</div>
</template>

<style lang="scss" scoped></style>
