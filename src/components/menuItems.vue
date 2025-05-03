<template>
  <div class="navMenu">
    <label v-for="navMenu in props.navMenus" :key="navMenu.menuId">
      <!--只有一级菜单-->
      <!-- key是唯一标识符，index唯一索引值，index也是select函数返回的值 -->
      <!--el-menu-item是最小菜单项  -->
      <el-menu-item
        v-if="navMenu.children == null"
        :title="navMenu.meta.title"
        :key="navMenu.menuId"
        :data="navMenu"
        :index="navMenu.menuId"
        :route="navMenu.parameters.path"
      >
        <!--图标-->
        <i :class="navMenu.meta.icon"></i>
        <!--标题-->
        <template #title>{{ navMenu.meta.title }}</template>
        <!-- {{ console.log('子菜单:', navMenu.meta.title) }} -->
      </el-menu-item>

      <!--有多级菜单-->
      <el-sub-menu v-if="navMenu.children" :key="navMenu.menuId" :data="navMenu" :index="navMenu.menuId">
        <i :class="navMenu.meta.icon"></i>
        <template #title>
          {{ navMenu.meta.title }}
        </template>
        <!-- {{ console.log('一级菜单:', navMenu.meta.title) }} -->
        <!-- 这里把子菜单项递归到label 的v-for里面 -->
        <menuItems :navMenus="navMenu.children" />
      </el-sub-menu>
    </label>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
// import { toRefs } from "vue";

const props = defineProps({
  navMenus: Array,
});
// 1、const { navMenus } = toRefs(props);
// 2、const navMenus = computed(() => props.navMenus);
// 3、console.log(props.navMenus);
// 4、const navMenus = ref(props.navMenus);
// 如果需要同步外部 props 变化
// watch(() => props.navMenus, (newVal) => {
//   navMenus.value = newVal;
// });

// 查看渲染顺序,通过 onMounted 钩子打印,打印每次组件挂载时的 navMenu 数据
// onMounted(() => {
//   console.log('menuItems mounted with navMenus:', props.navMenus)
// })
</script>

<style scoped>
.el-menu-item {
  line-height: 1.5; /* 这个最重要，减小菜单项间距*/
}

.el-dialog .el-menu-item {
  padding: 8px 10px; /* 默认可能是 20px 上下，调整为更小的值 */
  margin: 0; /* 移除可能的默认外边距 */
  line-height: 1.5; /* 这个最重要，减小菜单项间距*/
  height: auto; /* 确保高度自适应内容 */
}
</style>
