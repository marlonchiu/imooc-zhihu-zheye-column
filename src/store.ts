import { createStore, Commit } from 'vuex'
import { currentUser, ColumnProps, PostProps, UserProps } from './testData'
import axios from './libs/http'
import { StorageType, StorageHandler } from './libs/storage'
// 使用 localStorage
const storageType = StorageType.Local
const storageHandler = new StorageHandler()

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface GlobalDataProps {
  token: string;
  error: GlobalErrorProps;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: storageHandler.getItem(storageType, 'token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: currentUser
  },
  mutations: {
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'marlon' }
    // },
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
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      storageHandler.setItem(storageType, 'token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchCurrentUser (state, rawData) {
      console.log(rawData.data)
      state.user = { isLogin: true, ...rawData.data }
    }
  },
  actions: {
    // async fetchColumns ({ commit }) {
    //   const { data } = await axios.get('/api/columns')
    //   commit('fetchColumns', data)
    // },
    // 一步封装优化实现
    fetchColumns ({ commit }) {
      getAndCommit('/api/columns', 'fetchColumns', commit)
    },
    // async fetchColumn ({ commit }, cid) {
    //   const { data } = await axios.get(`/api/columns/${cid}`)
    //   commit('fetchColumn', data)
    // },
    fetchColumn ({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    // async fetchPosts ({ commit }, cid) {
    //   const { data } = await axios.get(`/api/columns/${cid}/posts`)
    //   commit('fetchPosts', data)
    // }
    fetchPosts ({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/api/user/login', 'login', commit, payload)
    },
    fetchCurrentUser ({ commit }) {
      return getAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    // 登录并获取用户信息
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
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
