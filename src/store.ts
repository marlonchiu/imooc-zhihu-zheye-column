import { createStore } from 'vuex'
import { currentUser, ColumnProps, PostProps, UserProps } from './testData'
import axios from './libs/http'

export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: [],
    posts: [],
    user: currentUser
  },
  mutations: {
    login (state) {
      state.user = { ...state.user, isLogin: true, name: 'marlon' }
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      console.log(rawData.data.list)
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      console.log(rawData.data)
      state.columns = [rawData.data]
    },
    fetchPosts (state, rawData) {
      console.log(rawData.data.list)
      state.posts = rawData.data.list
    }
  },
  actions: {
    fetchColumns (context) {
      axios.get('/api/columns').then(resp => {
        context.commit('fetchColumns', resp.data)
      })
    },
    fetchColumn ({ commit }, cid) {
      axios.get(`/api/columns/${cid}`).then(resp => {
        commit('fetchColumn', resp.data)
      })
    },
    fetchPosts ({ commit }, cid) {
      axios.get(`/api/columns/${cid}/posts`).then(resp => {
        commit('fetchPosts', resp.data)
      })
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    }
  }
})

export default store
