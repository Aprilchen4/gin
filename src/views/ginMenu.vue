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
                  ><a
                    href="https://www.bilibili.com/video/BV1jx4y1s7xx/?vd_source=abd781886b1091b8ba70c44b62286857"
                    class="web"
                    target="_blank"
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
        <el-button class="right-head-Icons" @click="pump">
          <el-icon><Search /></el-icon>
        </el-button>
      </el-tooltip>
      <el-dialog v-model="dialogVisible" class="el-dialog" @close="resetForm" :close-on-click-modal="true">
        <div class="search-container">
          <el-input class="quick-input" placeholder="请输入你需要快捷到达的功能" v-model="searchQuery" />
          <!-- 样式写在span里面无效,<span> 是一个内联元素（display: inline）-->
          <!-- <div style="margin-top: 20px; margin-bottom: 10px; margin-left: 15px"><span>操作</span></div> -->
          <span style="margin-top: 20px; margin-bottom: 10px; margin-left: 15px; display: inline-block">操作</span>
          <el-menu>
            <el-menu-item @click="toggleMode('dayTime')">亮色主题</el-menu-item>
            <el-menu-item @click="toggleMode('nightTime')">暗色主题</el-menu-item>
            <el-menu-item @click="logOut">退出登录</el-menu-item>
          </el-menu>
        </div>
        <template #footer>
          <el-button @click="debugClick">关闭</el-button>
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
// import { ElMessageBox, ElDrawer, ElMessage } from "element-plus";
import { ElButton } from "element-plus";
import { ref } from "vue";
import { watch } from "vue";
import { useRouter } from "vue-router";
import sideMenu from "@/components/sideMenu.vue";
import tabMenu from "@/components/tabMenu.vue";
import bottomIcon from "@/components/bottomIcon.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const dialogVisible = ref(false);
const breadCrumb = computed(() => store.state.breadCrumb);
// 搜索弹窗
const pump = () => {
  dialogVisible.value = true;
};

// 系统设置侧边栏
// JavaScript 中不需要类型声明，ref<boolean>
// JavaScript 中，大部分情况下分号是可选的;
const drawer = ref(false);
console.log(drawer.value);

function ToggleDrawer() {
  drawer.value = !drawer.value;
  console.log(drawer.value);
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

// 切换主题
// const mode = ref("dayTime");
const mode = ref(localStorage.getItem("theme") || "dayTime");
// const toggleMode = (newMode:string)需要在ts里面使用
const toggleMode = (newMode) => {
  mode.value = newMode;
  // 保存主题到本地存储，确保在页面刷新或重新打开时能保持用户的主题选择
  localStorage.setItem("theme", newMode);
  // 判断检查传入的新模式是否为 "nightTime"。如果是，则将 dark 类添加到 <html> 根元素（document.documentElement）
  // 用于控制 CSS 类的添加和移除
  if (newMode === "nightTime") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // 切换自定义主题，直接设置 <html> 元素的 data-theme 属性
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

// 关闭搜索弹窗
const debugClick = () => {
  dialogVisible.value = false;
};

const logOut = () => {
  mode.value = "dayTime"; //重新登陆未sayTime模式
  router.push({ path: "/" });
};
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
  display: flex;
  flex: 1;
  min-height: 0;
}

.bottom-right {
  position: relative;
  margin-left: 10px;
}

/* ========== 主题变量定义 ========== */
:root {
  /* 白天主题变量 */
  --bg-color: #ffffff;
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
  --dialog-bg: #1a1a1a;
}

/* ========== 侧边栏样式 ========== */
.el-aside {
  /* 这里是el-aside占全部页面的70% */
  width: var(--menu-width) !important;
  height: 80%;
  background-color: var(--sidebar-bg) !important;
  transition: background-color 0.3s; /* 背景色变化时过渡效果 */
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
}

/* 悬浮颜色 */
.el-menu-item:hover {
  background-color: var(--menu-hover-bg) !important;
}

/* 带有子菜单的顶级菜单项的悬浮样式 */
.el-sub-menu__title:hover {
  background-color: var(--menu-hover-bg) !important;
}

/* 设置菜单的高度 /* 直接控制菜单项高度 */
.el-menu-item {
  height: 50px; /* 设定每个菜单项的固定高度为50像素 */
  padding: 10px; /* 添加内边距可以增加视觉效果 */
}
/* ========== 表格样式 ========== */
.el-table {
  --el-table-header-bg-color: var(--table-header-bg) !important;
  --el-table-tr-bg-color: var(--bg-color) !important;
  --el-table-text-color: var(--text-color) !important;
  --el-table-border-color: var(--table-border-color) !important;
}

.el-table th {
  background-color: var(--table-header-bg) !important;
  color: var(--text-color) !important;
}

/* ========== 对话框样式 ========== */
.el-dialog {
  background-color: var(--dialog-bg) !important;
  color: var(--text-color) !important;
}

.el-dialog__title {
  color: var(--text-color) !important;
}

/* ========== 组件样式 ========== */
.el-container {
  height: 100% !important;
  display: flex;
  /* flex: 1; 空间分配；其实是 flex-grow、flex-shrink 和 flex-basis 三个属性的简写 */
  flex: 1;
  min-height: 0;
}

/* 固定头部 */
.el-header {
  height: 60px !important; /* 元素本身高度 */
  line-height: 60px; /* 定义了元素内文本的行高 */
  background-color: var(--header-bg);
  padding: 0;
  flex-shrink: 0; /* 禁止收缩 */
}

.el-main {
  height: calc(100% - 60px) !important;
  overflow: auto;
  padding: 0;
  flex: 1;
  min-height: 0;
  padding-bottom: 55px;
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
