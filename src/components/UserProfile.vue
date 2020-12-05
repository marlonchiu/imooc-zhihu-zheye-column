<template>
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
      <img :src="fitUrl" :alt="user.nickName" class="rounded-circle img-thumbnail">
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{ user.nickName }}</h6>
        <span class="text-truncate text-muted d-block">{{ user.description }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { UserProps } from '../store/types'
import { addColumnAvatar } from '../libs/helper'

export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup (props) {
    const fitUrl = computed(() => {
      addColumnAvatar(props.user, 50, 50)
      const { avatar } = props.user
      return avatar && avatar.fitUrl
    })

    return {
      fitUrl
    }
  }
})
</script>

<style scoped>
</style>
