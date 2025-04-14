<template>
  <!-- :default-active="1" 用于设置 el-menu [组件初始化时默认,不对]高亮选中的菜单项 ，需要引入activeMenu计算属性-->
  <!--   unique-opened一次只打开一个菜单 -->
  <el-scrollbar class="scrollbar-container">
    <!-- 默认垂直菜单，可不写vertical -->
    <el-menu
      class="bottom-left"
      :default-active="activeMenu"
      unique-opened
      mode="vertical"
      @select="handleMenuSelect"
      @click="sendData"
    >
      <!-- 递归组件，把遍历的值传回子组件，完成递归调用 -->
      <!-- 加v-if有数据时才调用 -->
      <menuItems v-if="sideData.values" :navMenus="sideData.values" class="tight-menu" />
    </el-menu>
  </el-scrollbar>
  <!-- 布局容器，注意组件名称 -->
</template>

<script setup>
// 侧边栏相关,编写一个递归函数，将扁平数据转换为树形结构
// import { getMenu } from "@/api/user";
// import { reactive } from "vue";
import menuItems from "@/components/menuItems.vue";
import { emitter } from "@/utils/eventBus";
import { ref, onMounted, onUnmounted } from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
// import { watchEffect } from "vue";
import router from "@/router";
import { defineProps } from "vue";

const receivedMessage = ref("");
const deleteMessage = ref("");
const store = useStore();
const activeMenu = computed(() => store.state.activeMenu); //不需要计算属性，只需要vuex里的数据；
// 定义 props 接收父组件传递的数据
const props = defineProps({
  sideData: {
    type: Object,
    required: true,
    default: () => ({ values: [] }), // 保持和原来相同的默认结构
  },
});

// 挂载后执行。可在定义前调用（函数提升）
onMounted(() => {
  // 监听标签页切换事件
  emitter.on("messageEvent", (msg) => {
    receivedMessage.value = msg;
    // 面包屑
    const { breadCrumbValue, tabNameValue } = breadMake(props.sideData.values, msg);
    store.commit("setBreadCrumb", breadCrumbValue);
    store.commit("setTabName", tabNameValue);
    // 路由
    const { routePath, routeName, routeComponent } = routeMake(props.sideData.values, msg);
    console.log("当前路由信息", routePath, routeName, routeComponent);
    // store.commit("setRoute", { routePath, routeName, routeComponent });
    router.push({ path: `/ginmenu/${routePath}` || "dashboard" });
  });

  // 监听标签页删除事件
  emitter.on("deleteEvent", (msg) => {
    deleteMessage.value = msg;
    const { routePath, routeName, routeComponent } = routeMake(props.sideData.values, msg);
    console.log("当前路由信息", routePath, routeName, routeComponent);
    // store.commit("setRoute", { routePath, routeName, routeComponent });
    router.push({ path: `/ginmenu/${routePath}` || "dashboard" });
  });
});

// 组件卸载时清理监听器
onUnmounted(() => {
  emitter.off("messageEvent"); // 移除特定事件监听
  // 或者使用 emitter.all.clear() 移除所有监听
});

// 立即执行 + 依赖追踪，必须在使用前定义
// watchEffect(() => {
//   console.log("editableTabsValue changed:", activeMenu.value); //这里也是操作后端
//   // console.log("监测标签页的tabs", tabs.value); //放到事件外面，没有触发事件时不会打印；但是这里逻辑也不对，打印都是操作后的，不管是删除还是切换；
// });

const handleMenuSelect = (menuId) => {
  console.log("Menu Select Event Triggered", menuId); // 检查事件是否触发
  store.commit("setActiveMenu", menuId);
  console.log("Menu Select", activeMenu.value);

  // 调用面包屑函数
  const { breadCrumbValue, tabNameValue } = breadMake(props.sideData.values, menuId);
  store.commit("setBreadCrumb", breadCrumbValue);
  store.commit("setTabName", tabNameValue);

  // 调用路由生成函数
  const { routePath, routeName, routeComponent } = routeMake(props.sideData.values, menuId);
  emitter.emit("routeMessageEvent", routePath);
  console.log("trumpLoss", routePath);

  // 点击跳转路由
  addRouteOneByOne(routePath, routeName, routeComponent);
  router.push({ path: `/ginmenu/${routePath}` || "dashboard" });

  // 切换已有、新增时会调用watchEffect函数监测切换标签页
  // vuex取数
  if (store.state.tabs.some((tab) => tab.label === menuId)) {
    store.commit("setActiveMenu", menuId); //无顺序，保证切换
    console.log("Tab already exists:", activeMenu.value);
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
  // 查找节点及其父节点,return的数据也是节点全部信息，不是路径
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
    // 主逻辑，每个节点的path属性用/连接
    const routePath = route.map((node) => node.path).join("/");
    const routeName = route[route.length - 1].name;
    const routeComponent = route[route.length - 1].component;
    return { routePath, routeName, routeComponent };
  };
  const { routePath, routeName, routeComponent } = generateRoutePath(tree, targetId);
  return { routePath, routeName, routeComponent };
};

// 动态添加路由不能解决浏览器刷新加载页面的问题，后续可以尝试存储到本地(但没必要)
const addRouteOneByOne = (routePath, routeName, routeComponent) => {
  // 获取当前所有路由
  const existingRoutes = router.getRoutes();
  // 检查是否已存在相同的 routeName 或 routePath
  const routeExists = existingRoutes.some((route) => route.name === routeName || route.path === routePath);
  // 如果路由不存在，则添加
  if (!routeExists) {
    router.addRoute("ginmenu", {
      path: routePath,
      name: routeName,
      component: () => import(`@/${routeComponent}`),
    });
    console.log("Route added:", routePath);
  } else {
    console.log("Route already exists:", routePath, routeName);
  }
};
</script>

<style></style>
