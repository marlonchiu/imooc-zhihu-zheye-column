import axios from 'axios'

// axios.defaults.baseURL = 'http://localhost:7001/api/'
axios.defaults.baseURL = 'http://api.imooc.com/'
// interceptors 发送请求的拦截器
axios.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    icode: 'C6A6C4086133360B'
  }
  return config
})

// http://api.imooc.com/api/columns?currentPage=1&pageSize=5 icode={codeName}

axios.get('/columns?currentPage=1&pageSize=5').then(res => {
  console.log(res)
})
