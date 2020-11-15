<template>
  <div class="dropdown">
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
import { defineComponent, ref } from 'vue'

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
    return {
      isOpen,
      toggleOpen
    }
  }
})
</script>

<style scoped>
</style>
