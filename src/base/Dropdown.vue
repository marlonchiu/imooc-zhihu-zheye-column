<template>
  <div class="dropdown" ref="dropdownRef">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
      {{ title }}
    </a>
    <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
      <slot></slot>
      <!-- <li class="dropdown-item"><a href="#">新建文章</a></li>
      <li class="dropdown-item"><a href="#">编辑资料</a></li> -->
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    const isOpen = ref(false)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }

    const dropdownRef = ref<null | HTMLElement>(null)

    // 点击事件
    const handler = (e: MouseEvent) => {
      if (dropdownRef.value) {
        if (!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value) {
          isOpen.value = false
        }
      }
    }
    onMounted(() => {
      document.addEventListener('click', handler)
    })
    onUnmounted(() => {
      document.addEventListener('click', handler)
    })
    return {
      isOpen,
      toggleOpen,
      // 返回和 ref 同名的响应式对象，就可以拿到对应的 dom 节点
      dropdownRef
    }
  }
})
</script>

<style scoped>
</style>
