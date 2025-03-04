// axios是一个基于Promise的 HTTP客户端,用于浏览器和Node.js中发送HTTP请求
// Promise js里面用于处理异步操作的对象;
// Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境。



//创建axios实例，并进行基本的配置
// 在 Vue 文件中，你可以创建 任意多个 Axios 实例，不同配置；
//这里没有二次封装，在某些小型项目或简单的应用中，直接使用 axios 可能会更直接和高效
import axios from 'axios';
 
// https://demo.gin-vue-admin.com/api/base/login ,这是接口，接口本来就不能这样（在浏览器地址栏）打开呀
// API 前缀是指 API 的访问路径或 URL 前缀https://api.example.com/v1/products。这里的 https://api.example.com/v1/
// 接口是后端地址，前端地址是路由path；
// 本地无env.development文件就设置这里的baseURL；
const service = axios.create({
  baseURL:'/api', // 这里设置请求本地地址如’http://127.0.0.1:8080/‘，而不是https://demo.gin-vue-admin.com
  timeout: 5000, // 请求超时时间
});
 

// 请求拦截器：在发送请求之前做些什么：例如：添加token到header中
// 拦截器方法，接受两个回调函数config 和 error（都是箭头函数）;
// 调用 Axios 请求之后,执行回调函数；
service.interceptors.request.use(


  // config 对象就是请求拦截器中最重要的一个参数；
  // config 包含了请求的各种信息，比如 URL，method，headers，data，timeout，withCredentials。
  config => {
    
    // if (token)一个条件判断语句，用于检查变量 token 是否存在且为真值
    // 标准字段：‘Authorization: <认证方案> <凭证>’
      // if (token) {
      //   config.headers['Authorization'] = `Bearer ${token}`;
      // }

    // 如何从 localStorage 中获取 token，并将其添加到请求头中
  const token = localStorage.getItem('userToken')? localStorage.getItem('userToken'): null


    //在后续请求中将token放在请求头里发送,这样后端才能验证你的token
    config.headers = {
      //表示请求体是 JSON 格式 
      'Content-Type': 'application/json',
      // 'x-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiOTg0Y2JjYmEtMGU4Zi00OTQ4LWFkMzQtNjE3YWZmODQwMWZiIiwiSUQiOjEsIlVzZXJuYW1lIjoiYWRtaW4iLCJOaWNrTmFtZSI6Ik1yLuWlh-a3vCIsIkF1dGhvcml0eUlkIjo4ODgsIkJ1ZmZlclRpbWUiOjg2NDAwLCJpc3MiOiJxbVBsdXMiLCJhdWQiOlsiR1ZBIl0sImV4cCI6MTczOTg0NTM1NSwibmJmIjoxNzM5MjQwNTU1fQ.ED2nQU0XdXwii93zfvJk8rX8h6HTgM0XijMOXj8wJTE' ,
      // 使用反引号是为了定义 模板字符串，它允许你在字符串中直接嵌入变量或表达式。
      // 完全可以将 x-token 改成 Authorization，只要后端能够正确解析 Authorization 头部中的 Bearer Token
      // Bearer 是身份验证方案,动态插入字符串；
       
      'x-token':`${token}`,
      'x-user-id': ''
    }
    // 在修改完 config 后，必须返回 config 对象，执行config函数，否则请求将无法正常发送。
    // 若你不返回 config，请求将不会继续。
    return config;
  },
  error => {
    // 对请求错误做些什么
    // 因为 HTTP 请求和响应是异步操作，通常需要通过回调或者 Promise 来处理响应数据和错误
    // Promise 确保我们在请求完成后执行相应的操作
    return Promise.reject(error);
  }
);
 
// 响应拦截器
// response 不需要定义，只需要在回调函数中使用 response
// 后端返回的 HTTP 响应会被 Axios 封装成一个 response 对象
service.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    // response 是 Axios 请求成功后的响应对象。
    // 对应登录页面组件登录请求里的response；

    //将响应数据（response.data）返回给调用方（程序-loginWeb.vue）。
    //程序-loginWeb.vue可以通过 then 方法获取到 response.data

    // console.log(response.data)在 return 之后，因此永远不会执行。
    // 如果需要打印响应数据，应该将 console.log 放在 return 之前：
    // 请求失败时不会打印，response函数不会执行；
    console.log('miemiemie')
    return response.data; 
  },
  error => {
    // 对响应错误做些什么
    if (error.response) {
      switch (error.response.status) {

        // 状态码是由 IETF (Internet Engineering Task Force) 这个标准化组织定义

        // HTTP 状态码一共分为5类,每类都有自己的含义:
        // 1xx (Informational)：表示请求已被接受,需要继续处理。
        // 2xx (Successful)：表示请求已成功被服务器接收、理解、并接受。常见的有200 OK。
        // 3xx (Redirection)：表示要完成请求,需要进一步的操作。常见的有302 Found。
        // 4xx (Client Error)：表示客户端看起来有问题。常见的有404 Not Found、401 Unauthorized。
        // 5xx (Server Error)：表示服务器在处理请求的过程中有错误或异常发生。常见的有500 Internal Server Error。

        case 401:
          // 处理未授权的错误
          console.error('未授权，请重新登录');
          break;
        case 404:
          // 处理资源不存在的错误
          console.error('请求的资源不存在');
          break;
        default:
          console.error('请求失败，请稍后再试');
      }
    } else if (error.request) {
      console.error('请求失败，请检查网络连接');
    } else {
      console.error('请求配置错误');
    }

    // 错误处理逻辑
    // 第一步：捕获"错误'：调用请求函数（loginWeb.vue），try/catch到错误 （前端）
    // 第二步：判断错误：错误返回给响应拦截器，错误分类，打印错误；（后端）
    // 第三步：反馈错误：（loginWeb.vue）打印（如显示提示、记录日志等）（前端）

    // promise js里面用于处理异步操作的对象
    // promise 发生在第二步：错误被捕获后，但尚未被最终处理（（loginWeb.vue）catch部分）之前。
    // 将错误向上抛出,"向上"指的是返回到 Axios 请求的调用者（程序-loginWeb.vue）
    // 请求成功时不会打印，error函数不会执行；
    console.log('uuu');
    return Promise.reject(error);
  }
);
 
export default service;