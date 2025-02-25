// store/index.js
// createStore 是 Vuex 提供的一个方法，用于创建一个 Vuex store 实例。
// Vuex 是一个 状态管理库,用于在 Vue.js 应用中集中管理状态，确保组件之间可以共享和管理状态。

import { createStore } from 'vuex'


// Vuex 的 state 本身就是响应式的
const store = createStore({
    state: {
      activeMenu: '仪表盘',  // 当前选中的菜单项
      activeTab: '',   // 当前选中的标签
    //   editableTabsValue:'2',
      tabs: [ {
        title: '首页',
        name: '1',
        content: 'Tab 1 content',
      },]         // 存储标签页的内容
    },

// 使用 mapGetters 映射 Vuex Store 中的 getters 到组件的计算属性中
// 将 Vuex Store 中的 `doubleCount` 映射到组件的 `doubleCount` 计算属性
    // getters: {
    //     doubleName(state) {
    //         return state.userName
    // },
    // },

// actions 来处理异步操作
// 每个 action 都是一个函数，接收一个 context 对象作为参数，
// context 包含 commit、state、getters 等方法。
// 1、可以包含异步操作（如 API 请求）。2、通过 dispatch 方法触发。
// 当调用 dispatch('increment') 时，action 会触发 commit('increment')，从而调用 mutation 修改状态。
    actions: {
        updateActiveMenu({ commit }, menu) {
        commit('setActiveMenu', menu);
        },
        updateActiveTab({ commit }, tab) {
        commit('setActiveTab', tab);
        },
        // updateEditableTabsValue({ commit },  editableTabsValue) {
        //     commit('setEditableTabsValu', editableTabsValue);
        //     },
        addNewTab({ commit }, tab) {
        commit('addTab', tab);
        },
        removeTab({ commit }, tabIndex) {
        commit('removeTab', tabIndex);
        }
    },
    // actions 和 mutations 的关系
        // actions 负责处理逻辑（可以是异步的），然后通过 commit 调用 mutations。
        // mutations 负责直接修改状态（必须是同步的）。
    
    // 协作流程：
        // 组件通过 dispatch 调用 action。
        // action 执行逻辑（如异步请求），然后通过 commit 调用 mutation。
        // mutation 修改状态。
        // 状态更新后，视图自动重新渲染。

// mutations 用于修改状态的同步操作
// 每个 mutation 都是一个函数，接收 state 作为第一个参数，用于直接修改状态。
// 1、必须是同步的。2、通过 commit 方法触发。
// 当调用 commit('increment') 时，state.count 的值会增加 1
    mutations: {
        setActiveMenu(state, menu) {
        state.activeMenu = menu;
        },
        setActiveTab(state, tab) {
        state.activeTab = tab;
        },
        // setEditableTabsValue(state, editableTabsValue) {
        //     state.editableTabsValue = editableTabsValue;
        //     },
        addTab(state, tab) {
        state.tabs.push(tab);
        },
        removeTab(state, tabIndex) {
        state.tabs.splice(tabIndex, 1);
        }
    },
});

export default store
