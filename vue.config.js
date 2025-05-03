const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  
  transpileDependencies: true,
  devServer: {
    host: '127.0.0.1',  // 此前端项目的IP地址
    port: 8080,  // 此前端项目的端口号
    open: true,  //表示在启动开发服务器时，会自动打开浏览器并访问指定的地址
    // proxy解决跨域,用于将前端请求代理到后端服务器;
    // 当你的 Vue.js 项目中的 JavaScript 代码尝试访问一个不同源(域名、协议或端口不同)的资源时,就会产生跨域问题；
    // 跨域资源共享（CORS）

    proxy: {
      // 把key的路径代理到target位置
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '': {
      // 需要代理的路径例如 '/api'
      target: `https://demo.gin-vue-admin.com`, // 被代理的对象,真实后端地址
      changeOrigin: true,
      // rewrite: (path) =>
      // path.replace(new RegExp('^' + process.env.VITE_BASE_API), '')
      // path.replace(/\/login2$/,'/login'),
      // pathRewrite: function (path) { return path.replace(/\/login2$/,'/login') },
      }
    }

    // proxy: {

    //   // ''部分是一个特殊的匹配规则；
    //   // 空字符串''表示匹配所有的请求路径，通常代表“所有请求”,即所有的请求都将经过代理。
    //   // 这意味着，当你访问任何路径时，都会被代理到目标地址。你可以将它看作是一个全局代理，即代理所有的请求。
    //   // 如果你指定了具体的前缀（比如 '/api'），则只有匹配该前缀的请求会被代理。

    //   '': {
    //     //  target: 'https://demo.gin-vue-admin.com:8888/api'
    //     target: 'https://demo.gin-vue-admin.com', //接口域名
    //     changeOrigin: true,       //是否跨域
    //     rewrite:(path) => path.replace(/\/login2$/,'/login'),
    //     //   pathRewrite: {
    //     //   '^/login2': '/login'  // 将请求路径中的 /login2 替换为 /login
    //     // }


    //     // pathRewrite 是一种配置，用于修改或重写请求 URL 的路径
    //     // pathRewrite 的作用是重写路径，而不是添加路径前缀
    //     // 如果你希望在 pathRewrite 中直接加 api，需要明确指定匹配规则和替换规则: '^/user': '/api/user' ;
    //     // 尤其是当前端请求的路径与后端服务的路径不完全一致
    //     // 假如后端 API 运行在 http://localhost:5000，当前端请求 /api/user 时，你希望将其转发到 http://localhost:5000/user。
    //     // 通过 pathRewrite，你可以修改请求路径，以确保后端能够正确接收到请求。
       

    //     // ^/ 是一个正则表达式，表示匹配路径的开头
    //     // pathRewrite: {
    //     //   '^/login2': '/login'  // 将请求路径中的 /login2 替换为 /login
    //     // }

    //     // pathRewrite只能替换（修改）重写请求路径；
    //     // { '^/':'/api/'}在所有路径前缀添加 /api的写法不对

    //     // pathRewrite: { '^/api':''} //前面’‘里面加api是可行的；
    //     // 不能在 pathRewrite 里面直接添加console.log();pathRewrite写成函数执行js;
    //   }
    // }
  }
 
})