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
import mitt, { Emitter } from 'mitt'
// 实例化 mitt
// export const emitter = mitt()
export const emitter: Emitter = mitt()
type ValidateFunc = () => boolean
// interface ValidateFunc{
//   (): boolean;
// }

export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: ValidateFunc[] = []
    const submitForm = (): void => {
      // 循环执行数组 得到最后的验证结果
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
    }
    // 将监听得到的验证函数都存到一个数组中
    // TODO  错误临时处理 https://github.com/developit/mitt/issues/112
    const callback = (func?: ValidateFunc) => {
      if (func) funcArr.push(func)
    }
    // 添加监听
    emitter.on('form-item-created', callback)
    // 卸载监听
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })

    return {
      submitForm
    }
  }
})
</script>

<style scoped>

</style>
