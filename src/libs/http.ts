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
  store.commit('setLoading', false)
  return resp
})

// http://api.imooc.com/api/columns?currentPage=1&pageSize=5 icode={codeName}

// 测试发送
// axios.get('/api/columns?currentPage=1&pageSize=5').then(res => {
//   console.log(res)
// })

export default axios
