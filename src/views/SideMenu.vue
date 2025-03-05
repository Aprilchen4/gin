<template>
  <!-- 滚动条 -->
  <!-- :default-active="1" 用于设置 el-menu [组件初始化时默认,不对]高亮选中的菜单项 -->
  <el-scrollbar height="400px">
    <el-menu
      class="bottom-left"
      :default-active="activeMenu"
      @select="handleMenuSelect"
      @open="menuOpenEvent"
      @click="sendData"
    >
      <!-- 递归组件，把遍历的值传回子组件，完成递归调用 -->
      <menuItems :navMenus="sideData.values" />
    </el-menu>
  </el-scrollbar>
  <!-- 布局容器，注意组件名称 -->
</template>

<script setup>
// 侧边栏相关,编写一个递归函数，将扁平数据转换为树形结构
import { getMenu } from "@/api/user";
import { reactive } from "vue";
import menuItems from "@/views/menuItems.vue";
import { emitter } from "@/utils/eventBus";

// const sideData = reactive([]);
const sideData = reactive({
  values: [], // 初始化 values 数组
});

// 首先调用 getMenu() 函数,这是一个异步操作,所以代码不会等待它完成就继续执行。紧接着,打印 '数据信息', sideData.values。
getMenu().then((a) => {
  console.log("侧边栏数据:", a.data.menus);
  sideData.values = a.data.menus; // 将 a.data.menus 的内容添加到 sideData,使用 ... 将 a.data.menus 数组中的每个元素“展开”
  emitter.emit("messageEvent", sideData.values);
  console.log("数据信息", sideData.values); //这里是异步函数,
});

const menuOpenEvent = (key, keyPath) => {
  console.log("Menu Open Event Triggered", key, keyPath);
};

// 标签页相关
import { computed } from "vue";
import { useStore } from "vuex";
// import {defineEmits} from 'vue';
import { watchEffect } from "vue";
// import { defineExpose } from 'vue'

const store = useStore();
const tabs = computed(() => store.state.tabs); // 获取 Vuex 中的状态
const activeMenu = computed(() => store.state.activeMenu);
const breadCrumb = computed(() => store.state.breadCrumb);
// const breadCrumbValue = ref("");

// 用于传递数据,这里居然不需要定义是响应式；
// let会造成全局变量污染
// const实际实际上是修改了包装对象的属性，而不是重新赋值变量本身。
// let breadCrumbValue = "";
// let tabName = "";
// activeMenu 实际上是 el-menu 组件的 @select 事件的第一个参数，即当前选中菜单项的 index 值,通常是菜单的唯一标识，如菜单名字或路径;
const handleMenuSelect = (menuId) => {
  console.log("Menu Select Event Triggered", menuId); // 检查事件是否触发
  store.commit("setActiveMenu", menuId);
  console.log("Menu Select", activeMenu.value);

  // 遍历数据
  function findNodeAndParents(tree, targetId, path = []) {
    for (const node of tree) {
      // 将当前节点加入路径
      const currentPath = [...path, node];
      // 如果找到目标节点，返回路径
      if (node.menuId === targetId) {
        return currentPath;
      }
      // 如果有子节点，递归查找
      if (node.children && node.children.length > 0) {
        const result = findNodeAndParents(node.children, targetId, currentPath);
        if (result) {
          return result;
        }
      }
    }
    // 如果未找到，返回 null
    return null;
  }

  // 生成面包屑，注意代码书写逻辑(先定义后调用，后更新vuex)
  function generatebreadCrumb(tree, targetId) {
    // 查找节点及其父节点
    const path = findNodeAndParents(tree, targetId);
    if (!path) {
      return { breadCrumbValue: "未找到指定节点", tabName: null };
    }
    // 提取每个节点的 meta.title
    const breadCrumbValue = path.map((node) => node.meta.title).join(" / ");
    const tabName = path[path.length - 1].meta.title;
    console.log("里标签页名称:", tabName);
    console.log("生成面包屑", breadCrumbValue);
    return { breadCrumbValue, tabName };
  }

  // 调用 generatebreadCrumb 获取计算结果
  const { breadCrumbValue, tabName } = generatebreadCrumb(
    sideData.values,
    menuId
  );

  // 更新 Vuex 状态
  if (breadCrumbValue !== "未找到指定节点") {
    store.dispatch("updateBreadCrumb", breadCrumbValue);
    console.log("里标签页名称:", tabName);
    console.log("生成面包屑", breadCrumbValue);
  }

  // 如果需要，将结果赋值给 breadCrumb.value，引入全局变量会提示未使用
  breadCrumb.value = breadCrumbValue;

  // // 自定义事件
  // console.log('外面生成面包屑',breadCrumb);
  // const emit = defineEmits(['send-data']); // 定义自定义事件
  // const sendData = () => {
  // emit('send-data', breadCrumb); // 触发事件并传递数据
  // };

  // 切换已有、新增时会调用watchEffect函数监测切换标签页
  if (tabs.value.some((tab) => tab.label === menuId)) {
    store.commit("setActiveMenu", menuId); //无顺序，保证切换
    console.log("Tab already exists:", activeMenu.value);
    console.log("已有菜单tabs", tabs.value);
  } else {
    console.log("Tab not exists:", activeMenu.value);
    console.log("面包屑名称:", breadCrumbValue); //函数外调用显示未定义
    // console.log('外标签页名称1:',tabNameComputed);
    console.log("外标签页名称:", tabName);
    store.commit("setActiveMenu", menuId);

    // 传参里面是一个对象；
    store.commit("setAddTab", { activeMenu: menuId, tabName: tabName }); //这个地方的参数可以是state之外的
    console.log("New Tab added:", activeMenu.value);
    console.log("新增菜单tabs", tabs.value);
  }
  console.log("Updated Tabs:", tabs.value); // 打印全部的tab值，检查 tabs 是否正确更新；
};

watchEffect(() => {
  console.log("editableTabsValue changed:", activeMenu.value); //这里也是操作后端
  console.log("监测标签页的tabs", tabs.value); //放到事件外面，没有触发事件时不会打印；但是这里逻辑也不对，打印都是操作后的，不管是删除还是切换；
});
</script>

<style>
.bottom-left {
  width: 280px;
  height: 680px;
}
</style>
