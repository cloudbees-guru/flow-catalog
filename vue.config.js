// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '^/plugins': {
        target: 'http://downloads.electric-cloud.com',
        ws: true,
        changeOrigin: true
      }
    }
  }
}