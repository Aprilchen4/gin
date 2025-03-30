// main.ts 是Vue.js 应用的大脑所在
// main.js文件会引入 Vue.js 库，注册全局资源，引入和应用插件；
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue' //全局的
import router from './router' //main.js是全局注册，在app.vue是引用；
// import Vue from 'vue' Vue 3 项目不需要import Vue from 'vue'也可以正常运行
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文语言包
import store from './store'

const app = createApp(App)

//UI库
app.use(ElementPlus, {
  locale: zhCn, // 设置为中文
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

// 路由
app.use(router)

// Vuex全局状态管理
app.use(store)


// 将整个 Vue 应用（即 app）挂载到页面上一个特定的 DOM 元素中，
// 通常是 index.html 中的一个 div 元素
app.mount('#app')


// 解决报错：ResizeObserver loop completed with undelivered notifications.
const debounce = (fn, delay) => {
  let timer
   return (...args) => {
     if (timer) {
       clearTimeout(timer)
     }
     timer = setTimeout(() => {
       fn(...args)
     }, delay)
   }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
   constructor(callback) {
     callback = debounce(callback, 200);
     super(callback);
   }
}
// 解决报错：ResizeObserver loop completed with undelivered notifications.

