<template>
  <!-- 滚动条 -->
  <!-- :default-active="1" 用于设置 el-menu [组件初始化时默认,不对]高亮选中的菜单项 ，需要引入activeMenu计算属性-->
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
import menuItems from "@/components/menuItems.vue";
import { emitter } from "@/utils/eventBus";
import { ref, onMounted, onUnmounted } from "vue";

const sideData = reactive({
  values: [], // 初始化 values 数组
});
const receivedMessage = ref("");

// const breadCrumbValue = ref("");
// 首先调用 getMenu() 函数,这是一个异步操作,所以代码不会等待它完成就继续执行。紧接着,打印 '数据信息', sideData.values。
getMenu().then((a) => {
  console.log("侧边栏数据:", a.data.menus);
  sideData.values = a.data.menus; // 将 a.data.menus 的内容添加到 sideData,使用 ... 将 a.data.menus 数组中的每个元素“展开”
  console.log("数据信息", sideData.values); //这里是异步函数,
});

// 监听事件
onMounted(() => {
  emitter.on("messageEvent", (msg) => {
    receivedMessage.value = msg;
    const { breadCrumbValue, tabNameValue } = breadMake(sideData.values, msg);
    store.commit("setBreadCrumb", breadCrumbValue);
    store.commit("settabNameValue", tabNameValue);
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
// import { useRouter } from "vue-router";
// const router = useRouter();

import Vrouter from "@/router/router";
const router = Vrouter;

const store = useStore();
// const tabs = computed(() => store.state.tabs); // 不需要计算属性，只需要vuex里的数据；
const activeMenu = computed(() => store.state.activeMenu);
// const breadCrumb = computed(() => store.state.breadCrumb);//这里使用breadCrumbValue，作为函数返回值；

const handleMenuSelect = (menuId) => {
  console.log("Menu Select Event Triggered", menuId); // 检查事件是否触发
  store.commit("setActiveMenu", menuId);
  console.log("Menu Select", activeMenu.value);

  // 调用面包屑函数
  const { breadCrumbValue, tabNameValue } = breadMake(sideData.values, menuId);
  store.commit("setBreadCrumb", breadCrumbValue);
  store.commit("settabNameValue", tabNameValue);

  console.log("生成的面包屑:", breadCrumbValue);
  console.log("标签页名称:", tabNameValue);

  // 调用路由生成函数
  const { routePath, routeName, routeComponent } = routeMake(
    sideData.values,
    menuId
  );
  store.commit("setRoutePath", routePath);
  store.commit("setRouteName", routeName);
  store.commit("setComponent", routeComponent);

  console.log("当前路由信息", routePath);
  console.log("当前路由名称", routeName);
  console.log("当前路由组件", routeComponent);

  // 点击跳转路由
  // router.push({ path: "/happy" });//可行
  // `/${routePath}`
  router.push({ path: `/menu/${routePath}` || "dashboard" });
  // router.push({ path: "/menu/test" });

  // 切换已有、新增时会调用watchEffect函数监测切换标签页
  // vuex取数
  if (store.state.tabs.some((tab) => tab.label === menuId)) {
    store.commit("setActiveMenu", menuId); //无顺序，保证切换
    console.log("Tab already exists:", activeMenu.value);
    // console.log("已有菜单tabs", tabs.value);
    console.log("点击菜单id", menuId);
  } else {
    console.log("Tab not exists:", activeMenu.value);
    store.commit("setActiveMenu", menuId);
    // 传参里面是一个对象，tabNameValue此时不是计算属性；
    store.commit("setAddTab", { activeMenu: menuId, tabName: tabNameValue }); //这个地方的参数可以是state之外的
  }
};

// 面包屑函数
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
      return { breadCrumbValue: "未找到指定节点", tabNameValue: null };
    }
    // 提取每个节点的 meta.title
    const breadCrumbValue = path.map((node) => node.meta.title).join(" / ");
    const tabNameValue = path[path.length - 1].meta.title;
    return { breadCrumbValue, tabNameValue };
  }

  const { breadCrumbValue, tabNameValue } = generatebreadCrumb(tree, targetId);
  // 在 JavaScript 中，使用 breadCrumb.value 作为对象的键是不合法的，因而导致语法错误。
  // 正确的做法是将 breadCrumbValue 作为一个对象的属性，然后将这个对象作为参数传递给 store.commit。
  // breadCrumb.value = breadCrumbValue;
  return { breadCrumbValue, tabNameValue };
};

// 路由函数
const routeMake = (tree, targetId) => {
  // 查找节点及其父节点
  function findNodeRoute(tree, targetId, path = []) {
    for (const node of tree) {
      const route = [...path, node];
      if (node.menuId === targetId) {
        return route;
      }
      if (node.children && node.children.length > 0) {
        const result = findNodeRoute(node.children, targetId, route);
        if (result) {
          return result;
        }
      }
    }
  }

  // 生成路由路径
  const generateRoutePath = (tree, targetId) => {
    // route
    const route = findNodeRoute(tree, targetId);
    if (!route) {
      return {
        routePath: "未找到指定节点",
        routeName: null,
        routeComponent: null,
      };
    }
    // 主逻辑
    const routePath = route.map((node) => node.path).join("/");
    const routeName = route[route.length - 1].name;
    const routeComponent = route[route.length - 1].component;
    return { routePath, routeName, routeComponent };
  };
  const { routePath, routeName, routeComponent } = generateRoutePath(
    tree,
    targetId
  );
  return { routePath, routeName, routeComponent };
};

watchEffect(() => {
  console.log("editableTabsValue changed:", activeMenu.value); //这里也是操作后端
  // console.log("监测标签页的tabs", tabs.value); //放到事件外面，没有触发事件时不会打印；但是这里逻辑也不对，打印都是操作后的，不管是删除还是切换；
});
</script>

<style>
.bottom-left {
  width: 280px;
  height: 680px;
}
</style>
