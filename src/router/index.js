import { createRouter, createWebHashHistory } from 'vue-router';
// import store from '@/store/index';

// const routeP = store.state.rPath;
// const routeN = store.state.rName;

// path 主要是前端路由，决定了浏览器地址栏中的 URL 访问哪个前端页面组件
// 后端接口通常是 fetch 或 axios 请求时使用的 API 地址
const routes = [
  {
    path: '/', // 路由路径
    name: 'login', // 路由名称
    component:() => import('@/views/loginWeb.vue') , // 对应的组件
    // component:login, //也可以这么写,前面需要import
  },
  {
    path: '/ginmenu',
    name: 'ginmenu',
    component: () => import('@/views/ginMenu.vue'),
    // 'test'路由是相对路径 ginMenu/test, 而/test的绝对路径，路由是/test;
    children:[
      // {
      //   path: 'test',
      //   name: 'test',
      //   component: () => import('@/components/temptMode.vue'),
      // },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/view/dashboard/index.vue'),
        // component: () => {
        //   const componentName = store.state.rComponent; // 从 Vuex 获取组件名称
        //   return import(`@/${componentName}`);
      },
      {
        path: 'admin/authority',
        name: 'authority',
        component: () => import('@/view/superAdmin/authority/index.vue'),
        // component: () => {
        //   const componentName = store.state.rComponent; // 从 Vuex 获取组件名称
        //   return import(`@/${componentName}`);
        // }
      },
      {
        path: 'admin/menu',
        name: 'menu',
        component: () => import('@/view/superAdmin/menu/index.vue'),
      },
      {
        path: 'admin/api',
        name: 'api',
        component: () => import('@/view/superAdmin/api/index.vue'),
      },
      {
        path: 'admin/user',
        name: 'user',
        component: () => import('@/view/superAdmin/user/index.vue'),
      },
      {
        path: 'admin/dictionary',
        name: 'dictionary',
        component: () => import('@/view/superAdmin/dictionary/index.vue'),
      },
      {
        path: 'admin/operation',
        name: 'operation',
        component: () => import('@/view/superAdmin/operation/index.vue'),
      },
    ]
  },
];


// router是Vue Router 的实例对象
// 路由实例包含了所有和路由相关的属性和方法;
// 提供了一个集中管理和控制路由的入口;
// createRouter创建实例方法;
const router = createRouter({
  history: createWebHashHistory('/ginmenu/'), // 使用 HTML5 历史模式
  routes, // 路由配置
});

export default router;