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
      <el-drawer v-model="drawer" :with-header="true">
        <template #header>
          <div class="drawer-header">
            <el-title>系统配置</el-title>
            <el-button type="primary" @click="saveConfig">保存配置</el-button>
          </div>
        </template>
        <div class="sys-setting-drawer">
          <span class="sys-title">默认主题 </span>
          <el-segmented v-model="theme" :options="themeOptions">
            <template #default="scope">
              <div>{{ scope.item.label }}</div>
            </template>
          </el-segmented>
        </div>
        <div class="sys-setting-drawer">
          <span class="sys-title">主题色 </span>
          <!--:class="{ selected: item.selected }"提示Cannot create property 'selected' on string '#2FEB54'-->
          <div class="color-grid">
            <div
              v-for="color in colors"
              :key="color"
              class="color-block"
              :style="{ backgroundColor: color }"
              @click="changePrimaryColor(color)"
            >
              <el-icon v-if="primaryColor === color" class="color-check">
                <Select />
              </el-icon>
            </div>
            <el-color-picker v-model="customColor" @change="togglePrimaryColor(color)" class="color-select" />
          </div>
        </div>
        <span class="sys-title">主题配置</span>
        <div>
          <div class="theme-setting">
            <div>展示水印</div>
            <el-switch v-model="show_watermark" @change="toggleConfigWatermark" />
          </div>
          <div class="theme-setting">
            <div>灰色模式</div>
            <el-switch v-model="grey" @change="toggleGrey" />
          </div>
          <div class="theme-setting">
            <div>色弱模式</div>
            <el-switch v-model="weakness" @change="toggleWeakness" />
          </div>
          <div class="theme-setting">
            <div>菜单模式</div>
            <el-segmented v-model="side_mode" :options="sideModes" size="default" @change="toggleSideMode" />
          </div>

          <div class="theme-setting">
            <div>显示标签页</div>
            <el-switch v-model="showTabs" @change="toggleTabs" />
          </div>
          <div class="theme-setting">
            <div class="flex-shrink-0">页面切换动画</div>
            <el-select v-model="transition_type" @change="toggleTransition" style="width: 100px">
              <el-option value="fade" label="淡入淡出" />
              <el-option value="slide" label="滑动" />
              <el-option value="zoom" label="缩放" />
              <el-option value="none" label="无动画" />
            </el-select>
          </div>
        </div>
        <div>
          <div class="sys-setting-drawer">layuut 大小配置</div>
          <div>
            <div class="theme-setting">
              <div>侧边栏展开宽度</div>
              <el-input-number v-model="layout_side_width" :min="150" :max="400" :step="10"></el-input-number>
            </div>
            <div class="theme-setting">
              <div>侧边栏收缩宽度</div>
              <el-input-number v-model="layout_side_collapsed_width" :min="60" :max="100"></el-input-number>
            </div>
            <div class="theme-setting">
              <div>侧边栏子项高度</div>
              <el-input-number v-model="layout_side_item_height" :min="30" :max="50"></el-input-number>
            </div>
          </div>
        </div>
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
import { ref, watch, computed, onMounted } from "vue";
import { emitter } from "@/utils/eventBus";
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
const weakness = ref(true);
const layout_side_width = ref(250);
const layout_side_collapsed_width = ref(80);
const layout_side_item_height = ref(40);

// 监听 layout_side_width 变化，CSS 无法直接读取 JavaScript 变量
watch(
  layout_side_width,
  (newWidth) => {
    document.documentElement.style.setProperty("--sidebar-width", `${newWidth}px`);
  },
  { immediate: true }
); // 立即执行一次

watch(
  layout_side_item_height,
  (newWidth) => {
    document.documentElement.style.setProperty("--el-menu-item-height", `${newWidth}px`);
  },
  { immediate: true }
); // 立即执行一次

// JavaScript 中，大部分情况下分号是可选的;
function ToggleDrawer() {
  drawer.value = !drawer.value;
}

const theme = ref("auto");

// 从本地存储中获取主题模式，如果没有，初始化为 "dayTime"
const mode = ref(localStorage.getItem("theme") || "dayTime");

// 监听 theme 变化，同步 mode
watch(theme, (newVal) => {
  mode.value = newVal === "dark" ? "nightTime" : "dayTime"; // 同步 mode
  if (newVal === "auto") {
    mode.value = "dayTime";
    primaryColor.value = "#3b82f6";
  }
});

const themeOptions = [
  {
    label: "dark",
    value: "dark",
  },
  {
    label: "light",
    value: "light",
  },
  {
    label: "auto",
    value: "auto",
  },
];

const primaryColor = ref("");

const customColor = ref(""); // 颜色选择器
const colors = ["#EB2F96", "#3b82f6", "#2FEB54", "#EBEB2F", "#EB2F2F", "#2FEBEB"];

const changePrimaryColor = (color) => {
  primaryColor.value = color; //赋值给上一个抽屉的表单
};

const togglePrimaryColor = (color) => {
  customColor.value = color;
  primaryColor.value = color;
};

// 初始化时从 localStorage 读取
onMounted(() => {
  const savedColor = localStorage.getItem("primaryColor");
  if (savedColor) {
    primaryColor.value = savedColor; // 赋值给 ref
    document.documentElement.style.setProperty("--primary-color", savedColor); // 应用到 CSS 变量
  }
});

// 在 mounted 生命周期钩子中设置样式变量
watch(primaryColor, (newColor) => {
  document.documentElement.style.setProperty("--primary-color", newColor);
  localStorage.setItem("primaryColor", newColor);
});

const side_mode = ref("正常模式");
const sideModes = [
  {
    label: "正常模式",
    value: "正常模式",
  },
  {
    label: "顶部菜单栏模式",
    value: "顶部菜单栏模式",
  },
  {
    label: "组合模式",
    value: "组合模式",
  },
];

// 刷新
const router = useRouter();
const receivedRoutePath = ref("");

onMounted(() => {
  emitter.on("routeMessageEvent", (msg) => {
    receivedRoutePath.value = msg;
  });
});

const refresh = () => {
  // router.push({ path: "/ginmenu" }); //导航到当前路由，强制重新加载视图
  router.push({ path: `/ginmenu/${receivedRoutePath.value}` || "dashboard" });

  store.commit("setActiveMenu", store.state.activeMenu);
  // store.commit("setTabName", store.state.tabName);
  store.commit("setBreadCrumb", store.state.breadCrumb);
  // store.commit("setFirstTab", [{ name: "首页", label: 1, content: "" }]);
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

// // 从本地存储中获取主题模式，如果没有，初始化为 "dayTime"
// const mode = ref(localStorage.getItem("theme") || "dayTime");
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
