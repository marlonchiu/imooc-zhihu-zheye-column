import { createApp } from 'vue'
import { createStore } from 'vuex'
import router from './router'
import App from './App.vue'
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    add (state) {
      state.count++
    }
  }
})
console.log(store.state.count)
store.commit('add')
console.log(store.state.count)
const app = createApp(App)
app.use(router)
app.mount('#app')
