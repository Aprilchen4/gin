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
import { ref, onMounted, onUnmounted } from "vue";

// const sideData = reactive([]);
const sideData = reactive({
  values: [], // 初始化 values 数组
});

// const breadCrumbValue = ref("");
// 首先调用 getMenu() 函数,这是一个异步操作,所以代码不会等待它完成就继续执行。紧接着,打印 '数据信息', sideData.values。
getMenu().then((a) => {
  console.log("侧边栏数据:", a.data.menus);
  sideData.values = a.data.menus; // 将 a.data.menus 的内容添加到 sideData,使用 ... 将 a.data.menus 数组中的每个元素“展开”
  // emitter.emit("messageEvent", sideData.values);
  console.log("数据信息", sideData.values); //这里是异步函数,
});

const receivedMessage = ref("");
// 监听事件
onMounted(() => {
  emitter.on("messageEvent", (msg) => {
    receivedMessage.value = msg;
    const { breadCrumbValue, tabName } = breadMake(sideData.values, msg);
    store.commit("setBreadCrumb", breadCrumbValue);
    store.commit("setTabName", tabName);
  });
});

// 组件卸载时清理监听器
onUnmounted(() => {
  emitter.off("messageEvent"); // 移除特定事件监听
  // 或者使用 emitter.all.clear() 移除所有监听
});

const menuOpenEvent = (key, keyPath) => {
  console.log("Menu Open Event Triggered", key, keyPath);
};

// 标签页相关
import { computed } from "vue";
import { useStore } from "vuex";
import { watchEffect } from "vue";

const store = useStore();
const tabs = computed(() => store.state.tabs); // 获取 Vuex 中的状态
const activeMenu = computed(() => store.state.activeMenu);
// const breadCrumb = computed(() => store.state.breadCrumb);
// const tabName = computed(() => store.state.tabName);

const handleMenuSelect = (menuId) => {
  console.log("Menu Select Event Triggered", menuId); // 检查事件是否触发
  store.commit("setActiveMenu", menuId);
  console.log("Menu Select", activeMenu.value);
  const { breadCrumbValue, tabName } = breadMake(sideData.values, menuId);
  store.commit("setBreadCrumb", breadCrumbValue);
  store.commit("setTabName", tabName);

  console.log("生成的面包屑:", breadCrumbValue);
  console.log("标签页名称:", tabName);

  // 切换已有、新增时会调用watchEffect函数监测切换标签页
  if (tabs.value.some((tab) => tab.label === menuId)) {
    store.commit("setActiveMenu", menuId); //无顺序，保证切换
    console.log("Tab already exists:", activeMenu.value);
    console.log("已有菜单tabs", tabs.value);
    console.log("点击菜单id", menuId);
  } else {
    console.log("Tab not exists:", activeMenu.value);
    store.commit("setActiveMenu", menuId);
    // 传参里面是一个对象，tabName此时不是计算属性；
    store.commit("setAddTab", { activeMenu: menuId, tabName: tabName }); //这个地方的参数可以是state之外的
  }
  console.log("Updated Tabs:", tabs.value); // 打印全部的tab值，检查 tabs 是否正确更新；
};

// 生成面包屑
const breadMake = (tree, targetId) => {
  // 生成路径
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
    return { breadCrumbValue, tabName };
  }

  const { breadCrumbValue, tabName } = generatebreadCrumb(tree, targetId);
  // breadCrumb.value = breadCrumbValue;
  return { breadCrumbValue, tabName };
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
