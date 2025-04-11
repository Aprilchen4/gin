<template>
  <div class="top-whole">
    <div class="top-left">
      <el-image class="logo-vue" :src="require('@/assets/logo1.png')"></el-image>
      <div class="title-gin-vue-admin">Gin-Vue-Admin</div>
      <!-- v-model 会将组件中的 activeMenu 绑定到 <el-input> 的 value 属性 -->
      <el-breadCrumb-item class="bread-crumb">{{ breadCrumb }}</el-breadCrumb-item>
    </div>
    <div class="top-right">
      <!-- 右侧第一个按钮 -->
      <div class="iconSpace">
        <el-tooltip content="视频教程">
          <el-dropdown>
            <el-button class="right-head-Icons">
              <el-icon><Film /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  ><a href="https://www.bilibili.com/video/BV1jx4y1s7xx/" class="web" target="_blank"
                    >1.clone项目和安装依赖</a
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  ><a href="https://www.bilibili.com/video/BV1sr421K7sv/" class="web" target="_blank"
                    >2.初始化项目</a
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  ><a href="https://www.bilibili.com/video/BV1iH4y1c7Na/" class="web" target="_blank"
                    >3.开启调试工具+创建初始化包</a
                  ></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
      <!-- 右侧第一个按钮 -->
      <!-- 右侧第二个按钮，UI消息弹出框 -->
      <!-- 永远不要将用户提交的内容赋值给 message 属性 -->
      <el-tooltip content="搜索">
        <el-button class="right-head-Icons" @click="dialogVisible = true">
          <el-icon><Search /></el-icon>
        </el-button>
      </el-tooltip>
      <el-dialog v-model="dialogVisible" class="el-dialog" @close="resetForm" :close-on-click-modal="true">
        <div class="search-container">
          <el-input class="quick-input" placeholder="请输入你需要快捷到达的功能" v-model="searchQuery" />
          <!-- 样式写在span里面无效,<span> 是一个内联元素（display: inline）-->
          <!-- <div style="margin-top: 20px; margin-bottom: 10px; margin-left: 15px"><span>操作</span></div> -->
          <span style="margin: 20px 0 10px 15px; display: inline-block">操作</span>
          <el-menu>
            <!-- <el-menu-item @click="toggleMode('dayTime')" :disabled="mode === 'dayTime'">亮色主题</el-menu-item>
            <el-menu-item @click="toggleMode('nightTime')" :disabled="mode === 'nightTime'">暗色主题</el-menu-item>
            <el-menu-item @click="logOut">退出登录</el-menu-item> -->
            <el-menu-item
              v-for="menu in filteredMenus"
              :key="menu.label"
              @click="menu.action"
              :disabled="menu.disabled"
            >
              {{ menu.label }}
            </el-menu-item>
          </el-menu>
        </div>
        <template #footer>
          <!-- Vue 的模板编译器会自动识别 ref 变量，并在底层转换成 dialogVisible.value,
           仅在 <script> 部分 需要用value访问ref变量： -->
          <el-button @click="dialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
      <el-tooltip content="系统设置">
        <el-button class="right-head-Icons" @click="ToggleDrawer"
          ><el-icon><Setting /></el-icon
        ></el-button>
      </el-tooltip>
      <el-drawer v-model="drawer" title="I am the title" :with-header="false">
        <el-button color="pink">Smart!</el-button>
      </el-drawer>
      <el-tooltip content="刷新">
        <el-button class="right-head-Icons" @click="refresh"
          ><el-icon><Refresh /></el-icon
        ></el-button>
      </el-tooltip>
      <el-tooltip content="切换主题">
        <template v-if="mode === 'dayTime'">
          <el-button class="right-head-Icons" @click="toggleMode('nightTime')"
            ><el-icon><moon /></el-icon
          ></el-button>
        </template>
        <template v-else>
          <el-button class="right-head-Icons" @click="toggleMode('dayTime')"
            ><el-icon><Sunny /></el-icon
          ></el-button>
        </template>
      </el-tooltip>
      <el-dropdown>
        <div class="top">
          <el-image class="imgUser" :src="require('@/assets/girl.jpg')"></el-image>
          <div class="username">Aprilchen4</div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item><strong>当前角色:普通用户</strong></el-dropdown-item>
            <el-dropdown-item>切换为：普通用户子用户</el-dropdown-item>
            <el-dropdown-item>切换为：测试角色</el-dropdown-item>
            <el-dropdown-item
              ><el-icon><UserFilled /></el-icon>个人信息</el-dropdown-item
            >
            <el-dropdown-item @click="logOut"
              ><el-icon><ReadingLamp /></el-icon>登出</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div class="bottom-whole">
    <!-- 布局容器 -->
    <el-container direction="horizontal">
      <el-aside>
        <sideMenu />
      </el-aside>
      <!-- 布局容器，注意组件名称 -->
      <el-container class="bottom-right">
        <el-header>
          <tabMenu />
        </el-header>
        <!-- 这一行css必须加上。隐藏容器内超出其尺寸的内容（不显示滚动条）。 -->
        <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden">
          <el-main
            ><!-- 预留底部空间 -->
            <router-view />
          </el-main>
          <bottomIcon />
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<!-- // 一定要有setup,否则会提示函数未定义 -->
<!-- Action catch((action:Action)）只能用在ts里面 -->
<script setup>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElButton } from "element-plus";

import sideMenu from "@/components/sideMenu.vue";
import tabMenu from "@/components/tabMenu.vue";
import bottomIcon from "@/components/bottomIcon.vue";

const store = useStore();
const searchQuery = ref(""); // 搜索查询
const dialogVisible = ref(false); // 对话框可见性
const drawer = ref(false); // 抽屉状态
const breadCrumb = computed(() => store.state.breadCrumb); // 面包屑导航

// JavaScript 中，大部分情况下分号是可选的;

function ToggleDrawer() {
  drawer.value = !drawer.value;
}

// 刷新
const router = useRouter();

const refresh = () => {
  router.push({ path: "/ginmenu" }); // 导航到当前路由，强制重新加载视图
  store.commit("setActiveMenu", 1);
  store.commit("setTabName", "首页");
  store.commit("setBreadCrumb", "仪表盘");
  store.commit("setFirstTab", [{ name: "首页", label: 1, content: "" }]);
};

// const定义，注意调用顺序
const logOut = () => {
  mode.value = "dayTime"; //重新登陆未sayTime模式
  router.push({ path: "/" });
};

// 搜索重置
const resetForm = () => {
  searchQuery.value = "";
};

// 定义菜单列表，使用函数返回以确保响应性【很重要】
// 这里响应式用computed 具有缓存机制，用于根据其他响应式数据计算衍生的只读数据。
// 天然支持动态计算，确保每次访问 menus.value 时都重新评估 disabled
// ref需要每次 mode.value 变化时，你必须手动更新 menus.value
const menus = computed(() => [
  { label: "亮色主题", action: () => toggleMode("dayTime"), disabled: mode.value === "dayTime" },
  { label: "暗色主题", action: () => toggleMode("nightTime"), disabled: mode.value === "nightTime" },
  { label: "退出登录", action: logOut, disabled: false },
]);

// 过滤菜单项，将 menu.label 和 searchQuery 都转为小写，以确保过滤时不区分大小写
// filteredMenus 绑定el-menu-item,是根据搜索关键字 searchQuery 过滤后的菜单列表。
const filteredMenus = computed(() => {
  if (!searchQuery.value) return menus.value;
  return menus.value.filter((menu) => menu.label.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// 从本地存储中获取主题模式，如果没有，初始化为 "dayTime"
const mode = ref(localStorage.getItem("theme") || "dayTime");
// 切换主题
const toggleMode = (newMode) => {
  mode.value = newMode;
  // 将新主题写入本地存储，覆盖之前的值确保在页面刷新或重新打开时能保持用户的主题选择
  localStorage.setItem("theme", newMode);

  // Element Plus 的约定：当 <html> 元素添加 dark 类时，Element Plus 会自动启用其内置的暗黑主题组件样式。
  // 所以没有定义dark类的具体内容

  // [两套系统]
  // 1、控制 Element 主题，CSS 类的添加classList.add/remove 和移除(theme.css)
  document.documentElement.classList.toggle("dark", newMode === "nightTime");

  // 2、切换自定义主题([data-theme="dark"])
  document.documentElement.setAttribute("data-theme", newMode === "nightTime" ? "dark" : "light");
};

// 初始化主题，Vue 会在初始化时主动触发一次 toggleMode，确保存储的主题立即生效。
watch(
  () => mode.value,
  (newVal) => {
    toggleMode(newVal);
  },
  { immediate: true }
);
</script>

<style>
/* ========== 全局基础样式 ========== */
html,
body,
#app {
  height: 100vh !important;
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

/* ========== 布局样式 ========== */
.top-whole {
  display: flex;
  justify-content: space-between; /* 改为 space-between，确保左右两侧合理分配空间 */
  align-items: center;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--header-bg);
  padding: 0 10px; /* 添加内边距，避免内容紧贴边缘 */
  box-sizing: border-box; /* 确保边框和内边距不影响宽度 */
}

.top-left {
  display: flex;
  align-items: center; /* 垂直居中 */
}

.top-right {
  display: flex; /* 改为 flex，确保图标横向排列 */
  align-items: center;
  gap: 10px; /* 添加间距，避免图标挤在一起 */
}

.bottom-whole {
  height: calc(100vh - 60px) !important; /* 会受控制台影响 */
  width: 100%;
  min-height: 0;
}

.bottom-right {
  position: relative;
  margin-left: 10px;
}

/* ========== 主题变量定义 ========== */
:root {
  /* 白天主题变量 */
  --bg-color: #f4f2f2;
  --table-bg: #ffffff;
  --text-color: #333333;
  --border-color: #e4e7ed;
  --sidebar-bg: #ffffff;
  --header-bg: #ffffff;
  --menu-hover-bg: #d0def4;
  --table-header-bg: #ffffff;
  --table-border-color: #ebeef5;
  --dialog-bg: #ffffff;
  --menu-width: 16%; /* 默认宽度为外部容器宽度的 15% */
}

/* 一个属性选择器，表示当元素具有 data-theme="dark" 属性时应用样式 */
[data-theme="dark"] {
  /* 黑夜主题变量 */
  --bg-color: #121212;
  --text-color: #e0e0e0;
  --border-color: #444444;
  --sidebar-bg: #1a1a1a;
  --header-bg: #1a1a1a;
  --menu-hover-bg: #4eafd3;
  --table-header-bg: #1a1a1a;
  --table-border-color: #444444;
  --table-bg: #000000;
  --dialog-bg: #1a1a1a;
}
/* ========== 输入框 ========== */
input,
select {
  font-family: "微软雅黑", sans-serif; /* 设置字体为微软雅黑 */
}
.english-font {
  font-family: "Times New Roman", serif; /* 使用 Times New Roman */
}
/* ========== 侧边栏样式 ========== */
.el-aside {
  /* 这里是el-aside占全部页面宽度的70% */
  width: var(--menu-width) !important;
  height: 80%; /* 这里是el-aside占全部页面高度的80% */
  background-color: var(--sidebar-bg) !important;
  flex-shrink: 0; /* 禁止收缩 */
  overflow-y: auto; /* 允许内容滚动 */
}

/* ========== 菜单样式 ========== */
.el-menu {
  /* 这里是菜单占el-aside的100% */
  width: 100% !important;
  background-color: var(--sidebar-bg) !important; /* root定义 */
  border-right: none !important;
}

.el-menu-item {
  color: var(--text-color) !important;
  background-color: var(--sidebar-bg) !important;
  /* 设置菜单的高度 /* 直接控制菜单项高度 */
  height: 50px; /* 设定每个菜单项的固定高度为50像素 */
  padding: 10px; /* 添加内边距可以增加视觉效果 */
}

/* 悬浮颜色 */
.el-menu-item:hover {
  background-color: var(--menu-hover-bg) !important;
}

/* 带有子菜单的顶级菜单项的悬浮样式 */
.el-sub-menu__title:hover {
  background-color: var(--menu-hover-bg) !important;
}

/* ========== 表格样式 ========== */
.el-table {
  --el-table-header-bg-color: var(--table-header-bg) !important;
  --el-table-tr-bg-color: var(--table-bg) !important;
  --el-table-text-color: var(--text-color) !important;
  --el-table-border-color: var(--table-border-color) !important;
}

.el-table th {
  background-color: var(--table-header-bg) !important;
  color: var(--text-color) !important;
}

.el-table__header-row {
  font-size: 12px;
  font-weight: bold;
}
.el-table {
  margin-top: 20px;
}
/* ========== 对话框样式 ========== */
.el-dialog {
  background-color: var(--dialog-bg) !important;
  color: var(--text-color) !important;
}

.el-dialog__title {
  color: var(--text-color) !important;
}

/* ========== 表单样式 ========== */

.el-form {
  margin-top: 20px;
}

/* ========== 组件样式 ========== */
/* 固定头部 */
.el-header {
  height: 50px !important; /* 元素本身高度 ,决定了距离warning的距离*/
  line-height: 40px; /* 定义了元素内文本的行高 */
  background-color: var(--header-bg);
  flex-shrink: 0; /* 禁止收缩 */
}

/* 全局 */
.placeholder-text {
  color: rgba(0, 0, 0, 0.409);
}

.el-drawer {
  background-color: white !important; /* 设置为不透明的白色 */
}

.el-container {
  height: 100% !important;
  display: flex;
  /* flex: 1; 空间分配；其实是 flex-grow、flex-shrink 和 flex-basis 三个属性的简写 */
  flex: 1;
  min-height: 0;
}

.el-main {
  height: calc(100% - 60px) !important;
  overflow: auto;
  flex: 1;
  padding: 0 0 55px;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* ========== 组件样式 ========== */
.logo-vue {
  margin: 0;
  width: 42px;
  height: 42px;
}

.title-gin-vue-admin {
  margin-left: 5px;
  font-size: 22px;
  font-weight: bold;
  color: var(--text-color);
}

.bread-crumb {
  margin-left: 8px;
  border-color: transparent;
  width: 300px;
  color: var(--text-color);
}

.right-head-Icons {
  width: 25px;
  height: 30px;
  border-radius: 50%;
  border: none;
  margin-left: 12px;
  background-color: transparent;
  color: var(--text-color);
}

.imgUser {
  margin-left: 12px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: none;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
/* ========== 其他样式 ========== */
.web {
  text-decoration: none;
  color: var(--text-color);
}

/* ========== 过渡效果 ========== */
/* * {
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
} */
</style>
