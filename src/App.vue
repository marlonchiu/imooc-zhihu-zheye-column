<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <!-- <message v-if="error.status" type="error" :message="error.message"></message> -->
    <loader v-if="isLoading" text="拼命加载中"  background="rgba(0, 0, 0, 0.8)"></loader>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>

  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
// import { useRouter } from 'vue-router'
import { GlobalDataProps } from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './base/Loader.vue'
// import Message from './base/Message.vue'
import createMessage from './base/createMessage'
import axios from './libs/http'
// import { currentUser } from './testData'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
    // Message
  },
  setup () {
    // const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)
    // console.log(token.value)
    onMounted(() => {
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
        // router.push('/')
      }
    })

    // watch 可以接收一个 getters
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })

    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
