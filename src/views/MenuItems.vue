<template>
    <div class="navMenu">
   
      <label v-for="navMenu in navMenus" :key="navMenu.menuId">
          <!--只有一级菜单-->
        <el-menu-item v-if="navMenu.children==null"
                      :key="navMenu.menuId" :data="navMenu" :index="navMenu.meta.title" :route="navMenu.parameters.path"
                      >
            <!--图标-->
          <i :class="navMenu.meta.icon"></i>
          <!--标题-->
          <template #title>{{navMenu.meta.title}}</template>
        </el-menu-item>
        <!--有多级菜单-->
        <el-submenu v-if="navMenu.children"
                    :key="navMenu.menuId" :data="navMenu" :index="navMenu.parameters.path">
          <template #title>
            <i :class="navMenu.meta.icon"></i>
            <span> {{navMenu.meta.title}}</span>
          </template>
          <!--递归组件，把遍历的值传回子组件，完成递归调用-->
          <nav-menu :navMenus="navMenu.children"></nav-menu>
        </el-submenu>
      </label>
   
    </div>
  </template>
   
  <script>
    export default {
      name: 'NavMenu', //使用递归组件必须要有
      props: ['navMenus'], // 传入子组件的数据
      data() {
        return {}
      },
      methods: {}
    }
  </script>
   
  <style scoped>
   
  </style>