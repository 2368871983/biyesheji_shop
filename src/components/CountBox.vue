<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'

const emits = defineEmits(['update:total', 'input'])
const props = defineProps({
  total: {
    type: Number,
    default: 1,
  },
})
const total = ref(props.total)

const handleSub = () => {
  if (total.value > 0) {
    total.value--
    emits('update:total', total.value)
    emits('input', total.value)
  }
}
const handleAdd = () => {
  total.value++
  emits('update:total', total.value)
  emits('input', total.value)
}
const handleChange = (e) => {
  const num = +e.target.value
  // 输入了不合法的文本 或 输入了负值，回退成原来的 value 值
  if (isNaN(num) || num < 1) {
    e.target.value = 1
    total.value = 1
    emits('update:total', total.value)
    emits('input', total.value)
    return
  }
}
</script>

<template>
  <div class="count-box">
    <div :disabled="total <= 0" class="minus" @click="handleSub">-</div>
    <input v-model="total" @change="handleChange" type="text" />
    <div class="add" @click="handleAdd">+</div>
  </div>
</template>

<style lang="less" scoped>
.count-box {
  width: 110px;
  display: flex;
  input {
    width: 40px;
    height: 30px;
    outline: none;
    border: none;
    margin: 0 5px;
    background-color: #efefef;
    text-align: center;
  }
  .minus,
  .add {
    width: 30px;
    height: 30px;
    outline: none;
    border: none;
    background-color: #efefef;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
