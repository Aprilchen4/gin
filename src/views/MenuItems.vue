<template>
    <div class="navMenu">
   
      <label v-for="navMenu in navMenus" :key="navMenu.menuId">
          <!--只有一级菜单-->
        <el-menu-item 
            v-if="navMenu.children==null"
            :key="navMenu.menuId" 
            :data="navMenu" 
            :index="navMenu.meta.title" 
            :route="navMenu.parameters.path"
        >
            <!--图标-->
          <i :class="navMenu.meta.icon"></i>
          <!--标题-->
          <template #title>{{navMenu.meta.title}}</template>
          <!-- {{ console.log('子菜单:', navMenu.meta.title) }} -->
        </el-menu-item>

        <!--有多级菜单-->
        <el-sub-menu 
            v-if="navMenu.children"
            :key="navMenu.menuId" 
            :data="navMenu" 
            :index="navMenu.meta.title"
        >
            <i :class="navMenu.meta.icon"></i>
            <template #title>
               {{navMenu.meta.title}}
            </template>
            <!-- {{ console.log('一级菜单:', navMenu.meta.title) }} -->
          <MenuItems :navMenus="navMenu.children"/>
        </el-sub-menu>
      </label>
    </div>
</template>
   
<script setup>
import { defineProps, toRefs } from 'vue'
// import { onMounted } from 'vue'

const props = defineProps({
navMenus:  Array,
})
const{navMenus} =toRefs(props)

// 查看渲染顺序,通过 onMounted 钩子打印,打印每次组件挂载时的 navMenu 数据
// onMounted(() => {
//   console.log('MenuItems mounted with navMenus:', props.navMenus)
// })

</script>
   
<style scoped>

</style>