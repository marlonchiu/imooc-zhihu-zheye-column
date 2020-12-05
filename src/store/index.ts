import { createStore, Commit } from 'vuex'
import { GlobalDataProps, GlobalErrorProps } from './types'
import { axios, AxiosRequestConfig } from '../libs/http'
import { StorageHandler, storageType } from '../libs/storage'
import { arrToObj, objToArr } from '../libs/helper'
const storageHandler = new StorageHandler()

const asyncAndCommit = async (url: string, mutationName: string, commit: Commit,
  config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: storageHandler.getItem(storageType, 'token') || '',
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: {} },
    user: { isLogin: false }
  },
  mutations: {
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'marlon' }
    // },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      // console.log(rawData, columnId)
      const { data } = state.posts
      const { list, count, currentPage } = rawData.data
      state.posts.data = { ...data, ...arrToObj(list) }
      state.posts.loadedColumns[columnId] = {
        columnId: columnId,
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
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
      // console.log(rawData.data)
      state.user = { isLogin: true, ...rawData.data }
    },
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      storageHandler.remove(storageType, 'token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    // async fetchColumns ({ commit }) {
    //   const { data } = await axios.get('/api/columns')
    //   commit('fetchColumns', data)
    // },
    // 一步封装优化实现
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/api/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts ({ state, commit }, params = {}) {
      const { columnId, currentPage = 1, pageSize = 3 } = params
      // console.log(params)
      const loadedPost = state.posts.loadedColumns[columnId]
      // 如果loadedPost存在 不为 undefined
      if (!loadedPost) {
        return asyncAndCommit(`/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, columnId)
      } else {
        const loadedPostCurrentPage = loadedPost.currentPage || 0
        if (loadedPostCurrentPage < currentPage) {
          return asyncAndCommit(`/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, columnId)
        }
      }
    },
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      // 没有获取过 或者 没有详细内容的话要发送请求
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/api/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/api/posts', 'createPost', commit, { method: 'post', data: payload })
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/api/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/api/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/api/user/login', 'login', commit, { method: 'post', data: payload })
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    // 登录并获取用户信息
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    register ({ commit }, payload) {
      return asyncAndCommit('/api/users', 'register', commit, { method: 'post', data: payload })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    },
    // 根据columnId 获得已加载的记录
    getLoadedPost: (state) => (id: string) => {
      return state.posts.loadedColumns[id]
    }
  }
})

export default store
