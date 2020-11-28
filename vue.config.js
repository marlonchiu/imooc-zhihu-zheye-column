module.exports = {
  lintOnSave: false,
  // 服务项配置
  devServer: {
    host: 'localhost',
    port: 8080,
    https: false,
    open: false,
    proxy: {
      '/api': {
        target: 'http://api.vikingship.xyz/api',
        // 是否允许跨域,在本地会创建一个虚拟服务端，然后发送请求的数据
        changeOrigin: true,
        // 并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
