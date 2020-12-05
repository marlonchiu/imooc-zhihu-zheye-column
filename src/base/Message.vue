<template>
  <teleport to="#message">
    <div
      v-if="isVisible"
      class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
      :class="classObject"
    >
      <span>{{ message }}</span>
      <button type="button" class="close btn-close" aria-label="Close" @click.prevent="hide">
        <!-- <span aria-hidden="true">&times;</span> -->
      </button>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { MessageType } from '../store/types'
import useDOMCreate from '../hooks/useDOMCreate'

export default defineComponent({
  name: 'Message',
  props: {
    message: String,
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  emits: ['close-message'],
  setup (props, context) {
    useDOMCreate('message')
    const isVisible = ref(true)
    const classObject = {
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
    }
    const hide = () => {
      isVisible.value = false
      context.emit('close-message', true)
    }

    return {
      isVisible,
      classObject,
      hide
    }
  }
})
</script>

<style scoped>
</style>
