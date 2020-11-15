<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
// 实例化 mitt
export const emitter = mitt()
type ValidateFunc = () => boolean

export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup (props, context) {
    const submitForm = (): void => {
      context.emit('form-submit', true)
    }

    const callback = (test: string | undefined) => {
      console.log(test)
    }
    // 添加监听
    emitter.on('form-item-created', callback)
    // 卸载监听
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
    })

    return {
      submitForm
    }
  }
})
</script>

<style scoped>

</style>
