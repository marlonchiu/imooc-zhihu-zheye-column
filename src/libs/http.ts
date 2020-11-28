import axios from 'axios'
import store from '../store'

// 这里采用代理实现完成
// axios.defaults.baseURL = 'http://localhost:7001/api/'
// axios.defaults.baseURL = 'http://api.imooc.com/'

// interceptors 发送请求的拦截器
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})

// interceptors 响应的拦截器
axios.interceptors.response.use(resp => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 1000)
  return resp
}, e => {
  console.log(e.response)
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})

// http://api.imooc.com/api/columns?currentPage=1&pageSize=5 icode={codeName}

// 测试发送
// axios.get('/api/columns?currentPage=1&pageSize=5').then(res => {
//   console.log(res)
// })

export default axios
