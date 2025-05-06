import { createApp } from 'vue';
import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css'; 
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';
import { beforeAll} from '@jest/globals'; 

// 模拟 Vuex store
const store = createStore({
  state: {
    activeMenu: '1',
    breadCrumb: '',
    tabName: '',
    tabs: []
  },
  mutations: {
    setActiveMenu(state, menuId) {
      state.activeMenu = menuId;
    },
    setBreadCrumb(state, value) {
      state.breadCrumb = value;
    },
    setTabName(state, value) {
      state.tabName = value;
    },
    setAddTab(state, { activeMenu, tabName }) {
      state.tabs.push({ label: activeMenu, name: tabName });
    }
  }
});

// 模拟 Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/ginmenu/:path', name: 'ginmenu', component: { render: () => null } },
    { path: '/dashboard', name: 'dashboard', component: { render: () => null } }
  ]
});

// 全局配置
beforeAll(() => {
  const app = createApp({});
  app.use(ElementPlus);
  app.use(store);
  app.use(router);
});