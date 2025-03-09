// store/index.js
// createStore 是 Vuex 提供的一个方法，用于创建一个 Vuex store 实例。
// Vuex 是一个 状态管理库,用于在 Vue.js 应用中集中管理状态，确保组件之间可以共享和管理状态。

import { createStore } from 'vuex'

// Vuex 的 state 本身就是响应式的
//state 是只读的，必须通过 mutations 来修改
const store = createStore({
    state: {
      activeMenu:1,  // 当前选中的菜单项
      tabName:'',
    // nextTab:'',
      breadCrumb:'仪表盘',
      rPath:'',
      rComponent:'',
      rName:'',
    //   activeTab: '',   // 当前选中的标签
    //  这里label是数字，不是字符串，同理activeMenu是数字，点击仪表盘才不会新增仪表盘标签；
      tabs: [ {
        name: '首页',
        label: 1,
        content: '',
      },]   // 存储标签页的内容

    },

    // state的衍生状态
    getters:{
        getActiveMenu(state){
            return state.activeMenu;
        },
    },

// actions 来处理异步操作(如api请求），通过dispatch触发,dispatch;
// 每个 action 都是一个函数，接收一个 context 对象作为参数，context 包含 commit、state、getters 等方法。
    actions: {
        updateActiveMenu({ commit }, menuId) {
        commit('setActiveMenu',menuId);
        },
    },

    // action和dispatch的关系
        // store.dispatch('updateActiveMenu', activeMenu); 
        // 'updateActiveMenu' 是要触发的 action 的名称。
        // activeMenu 是要传给 action 的参数。
   

    // actions 和 mutations 的关系
        // actions 负责处理逻辑（可以是异步的），然后通过 commit 调用 mutations（commit 是 Vuex 提供的一个方法，用于调用 mutation）。
        // mutations 负责直接修改状态（必须是同步的）。
    

    // 协作流程：
        // 组件通过 dispatch 调用 action。
        // action 执行逻辑（如异步请求），然后通过 commit 调用 mutation。
        // mutation 同步修改状态。
        // 状态更新后，视图自动重新渲染。

    // 参数相关
        // dispatch（”action 的名称“，payload：传递给 action 的数据（可选））
        // action（‘context’，payload：通过 dispatch 传递的数据。）
        // commit（”mutation 的名称“，payload：传递给 mutation 的数据（可选））
        // mutation（state，payload：通过 dispatch 传递的数据。），mutation 接收 state 和 payload，并修改状态
        // mutation 的参数不需要和 action 的参数完全一致，只要逻辑上能够正确传递数据即可

// mutations 用于修改状态的同步操作，commit;
// 每个 mutation 都是一个函数，接收 state 作为第一个参数，用于直接修改状态。
    mutations: {
        setActiveMenu(state, menuId) {
            state.activeMenu = menuId;
        },
        setTabName(state, tabName) {
            state.tabName = tabName;
        },
        setClickTab(state, name) {
            state.activeMenu = name;//还是得这么写，才能改变activeMenu
        },

        // 修改 state.tabs，通过mutation。
        setAddTab(state,{activeMenu,tabName}) {
            state.tabs.push({
                name: tabName,
                label: activeMenu,
                content: '',
                });
            },
        setNextTab(state, nextTab) {
            state.activeMenu =nextTab.label;
        },

        setRemoveTab(state, targetName) {
            state.tabs = state.tabs.filter((tab) => tab.label !== targetName);
          },
          
        setBreadCrumb(state,breadCrumb) {
        state.breadCrumb = breadCrumb
        },
        setRoutePath(state,rPath) {
            state.rPath = rPath 
            },
        
        setComponent(state,rComponent ) {
        state.rComponent = rComponent 
        },
    
        setRouteName(state,rName) {
        state.rName = rName 
        },
    },
})

export default store
