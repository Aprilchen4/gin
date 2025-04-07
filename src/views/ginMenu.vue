<template>
  <div class="top">
    <div class="top-left">
      <el-image class="logo" :src="require('@/assets/logo1.png')"></el-image>
      <div class="title">Gin-Vue-Admin</div>
      <!-- v-model 会将组件中的 activeMenu 绑定到 <el-input> 的 value 属性 -->
      <el-breadCrumb-item class="titleInput">{{ breadCrumb }}</el-breadCrumb-item>
    </div>
    <div class="top-right">
      <!-- 右侧第一个按钮 -->
      <div class="iconSpace">
        <el-tooltip content="视频教程">
          <el-dropdown>
            <el-button class="icon">
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
        <el-button class="icon" @click="pump">
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
            <el-menu-item>亮色主题</el-menu-item>
            <el-menu-item>暗色主题</el-menu-item>
            <el-menu-item>退出登录</el-menu-item>
          </el-menu>
        </div>
        <template #footer>
          <el-button @click="debugClick">关闭</el-button>
        </template>
      </el-dialog>

      <el-tooltip content="系统设置">
        <el-button class="icon" @click="ToggleDrawer"
          ><el-icon><Setting /></el-icon
        ></el-button>
      </el-tooltip>
      <el-drawer v-model="drawer" title="I am the title" :with-header="false">
        <el-button color="pink">Smart!</el-button>
      </el-drawer>
      <el-tooltip content="刷新">
        <el-button class="icon" @click="refresh"
          ><el-icon><Refresh /></el-icon
        ></el-button>
      </el-tooltip>
      <el-tooltip content="切换主题">
        <template v-if="mode === 'dayTime'">
          <el-button class="icon" @click="toggleMode('nightTime')"
            ><el-icon><moon /></el-icon
          ></el-button>
        </template>
        <template v-else>
          <el-button class="icon" @click="toggleMode('dayTime')"
            ><el-icon><Sunny /></el-icon
          ></el-button>
        </template>
      </el-tooltip>
      <el-dropdown>
        <div class="top">
          <el-image class="Icon" :src="require('@/assets/girl.jpg')"></el-image>
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
            <el-dropdown-item
              ><el-icon><ReadingLamp /></el-icon>登出</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div class="bottom">
    <!-- 布局容器 -->
    <el-container direction="horizontal" class="main-container">
      <el-aside width="220px">
        <sideMenu />
      </el-aside>
      <!-- 布局容器，注意组件名称 -->
      <el-container style="margin-left: 10px">
        <el-header style="height: 60px">
          <tabMenu />
        </el-header>
        <el-main style="padding-top: 0px">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

// 一定要有setup,否则会提示函数未定义
<!-- Action catch((action:Action)）只能用在ts里面 -->
<script setup>
// import { ElMessageBox, ElDrawer, ElMessage } from "element-plus";
import { ElButton } from "element-plus";
import { ref } from "vue";
import { useRouter } from "vue-router";
import sideMenu from "@/components/sideMenu.vue";
import tabMenu from "@/components/tabMenu.vue";
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
const mode = ref("dayTime");
// const toggleMode = (newMode:string)需要在ts里面使用
const toggleMode = (newMode) => {
  mode.value = newMode;
};

const debugClick = () => {
  dialogVisible.value = false;
};
</script>

<style>
/* 全局样式 */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 顶部样式 */
.top {
  display: flex;
  justify-content: center; /* 左右居中 */
  align-items: center; /* 上下居中 */
  width: 100%;
  height: 40px; /* 或者设置成你需要的高度 */
  border-bottom: 1px solid #d3d3d3; /* 只有下边缘 */
  background-color: none; /* 设置背景色 */
}

.top-left {
  left: 10px;
  position: absolute;
  display: flex;
  align-items: center; /* 上下居中 */
}

.logo {
  margin: 0px;
  width: 42px;
  height: 42px;
}

.title {
  margin-left: 5px;
  font-size: 22px;
  font-weight: bold;
}

.titleInput {
  margin-left: 8px;
  border-color: transparent;
  width: 300px;
}

.top-right {
  right: 10px;
  display: inline-flex;
  position: absolute;
  align-items: center; /* 上下居中 */
}

.icon {
  width: 25px;
  height: 30px;
  border-radius: 50%;
  border-color: none;
  margin-left: 12px;
  background-color: #f5f5f500;
}

.Icon {
  margin-left: 12px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border-color: none;
}

.searchInput {
  border-color: none;
  width: 100%;
  height: 200px;
}

.el-dialog {
  width: 500px;
  height: 350px;
}

.el-dialog .el-menu-item {
  padding: 8px 10px; /* 默认可能是 20px 上下，调整为更小的值 */
  margin: 0; /* 移除可能的默认外边距 */
  line-height: 1.5; /* 这个最重要，减小菜单项间距*/
  height: auto; /* 确保高度自适应内容 */
}

.quick-input {
  color: #666;
  border-radius: 4px 4px 0 0;
  border: none; /* 外层无边框 */
  padding: 8px 8px 8px 8px; /* 将内边距设置为 5 像素 */
  box-sizing: border-box;
  width: 100%;
  font-size: 16px;
  border-bottom: 1px solid #ddd; /* 只保留底部边框 */
  --el-input-bg-color: #f5f7facb; /* 设置背景色 */
}

/* 底部样式 */
.bottom {
  height: calc(100% - 40px); /* 占满剩余高度 */
  display: flex;
  width: 100%;
}

.bottom-left {
  width: 280px;
  height: 680px;
}

.bottom-right {
  display: flex;
}

/* 其他通用样式 */
.web {
  text-decoration: none; /* 去掉下划线 */
  color: #000; /* 字体颜色 */
}

/* 选项卡样式 */
.el-tabs__header.is-top {
  margin-bottom: 5px !important; /* 或外部可能导致的问题,泽丽tab是引入的 */
}

/* 主容器 */
.main-container {
  height: 100%; /* 确保容器占满父元素高度 */
}

/* 侧边栏样式 */
.el-aside {
  width: 280px !important; /* 固定侧边栏宽度 */
  height: 100%;
  background-color: #f5f5f5; /* 可选：添加背景色以便调试 */
}

/* 头部样式 */
.el-header {
  padding: 0;
  height: 60px !important; /* 固定头部高度 */
  line-height: 60px;
  background-color: #fff; /* 可选：添加背景色 */
}

/* 主体样式 */
.el-main {
  padding: 0; /* 移除默认内边距 */
  overflow: auto; /* 如果内容溢出，允许滚动 */
}
</style>
