import { createRouter, createWebHistory } from 'vue-router';
// import login from '@/login.vue';
// import GinMenu from '@/views/GinMenu.vue';

// path 主要是前端路由，决定了浏览器地址栏中的 URL 访问哪个前端页面组件
// 后端接口通常是 fetch 或 axios 请求时使用的 API 地址
const routes = [
  {
    path: '/', // 路由路径
    name: 'login', // 路由名称
    component:() => import('@/views/LoginWeb.vue') , // 对应的组件
    // component:login, //也可以这么写,前面需要import
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('@/views/GinMenu.vue'),
    children:[
      {
        path: '/test',
        name: 'test',
        component: () => import('@/views/HelloTest.vue'),
      },
      {
        path: '/tab',
        name: 'tab',
        component: () => import('@/views/TabMenu.vue'),
      },
    ]
  },
];


// router是Vue Router 的实例对象
// 路由实例包含了所有和路由相关的属性和方法;
// 提供了一个集中管理和控制路由的入口;
// createRouter创建实例方法;
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 历史模式
  routes, // 路由配置
});

export default router;