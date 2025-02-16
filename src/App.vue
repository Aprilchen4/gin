<template>
  <div id="app">
    <router-view></router-view>  
    <!-- <div class="momo">hhhhhhh</div> -->
    <!-- App.vue的只会渲染一级子组件 -->
    <!-- Router-view也被称为路由的出口 -->
    <!-- 用于渲染显示当前路由匹配的组件 -->
    <!-- 将 router-view 放在 App.vue 中，能够实现 路由的集中管理，并且保持 全局布局的统一 -->
  </div> 
</template>

<!-- App.vue 是 Vue 应用的根组件， -->
<!-- Vue 应用的生命周期是从 App.vue 开始的。所有其他组件都是 App.vue 的子组件或通过路由加载的 -->

<script>
export default {
  name: 'App',
}
</script>

<style>
/* 可以在这里定义全局样式 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-top: 0px;
  /* 这里的margin-top直接影响登录页面的上边距，离谱 */
}
</style>