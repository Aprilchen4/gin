<template>
    <div class="top">
        <div class="top-left">
            <el-image class='logo' :src="require('@/assets/logo1.png')"></el-image>
            <div class="title">Gin-Vue-Admin</div>
            <!-- v-model 会将组件中的 activeMenu 绑定到 <el-input> 的 value 属性 -->
            <el-input class='titleInput' v-model="activeMenu"></el-input>
        </div>
        <div class="top-right">
            <!-- 右侧第一个按钮 -->
            <div class="iconSpace">
                <el-tooltip content="视频教程">
                    <el-dropdown>
                        <el-button class="icon"> <el-icon><Film /></el-icon> </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item><a href="https://www.bilibili.com/video/BV1jx4y1s7xx/?vd_source=abd781886b1091b8ba70c44b62286857" class="web" target="_blank">1.clone项目和安装依赖</a></el-dropdown-item>
                                <el-dropdown-item><a href="https://www.bilibili.com/video/BV1sr421K7sv/" class="web" target="_blank">2.初始化项目</a></el-dropdown-item>
                                <el-dropdown-item><a href="https://www.bilibili.com/video/BV1iH4y1c7Na/" class="web" target="_blank">3.开启调试工具+创建初始化包</a></el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-tooltip>
            </div>
            <!-- 右侧第一个按钮 -->
            <!-- 右侧第二个按钮，UI消息弹出框 -->
                <!-- 永远不要将用户提交的内容赋值给 message 属性 -->
            <el-tooltip content="搜索">
                <el-button class="icon" @click="pump"><el-icon><Search /></el-icon></el-button>
            </el-tooltip>
            <el-tooltip content="系统设置">
                <el-button class="icon"  @click="ToggleDrawer"><el-icon><Setting /></el-icon></el-button> 
            </el-tooltip>
            <el-drawer v-model="drawer" title="I am the title" :with-header="false">
                    <el-button color="pink">Smart!</el-button>
            </el-drawer>
            <el-tooltip content="刷新">
                <el-button class="icon" @click="refresh"><el-icon><Refresh /></el-icon></el-button>
            </el-tooltip>
            <el-tooltip content="切换主题">
                <template v-if="mode==='dayTime'">
                    <el-button class="icon" @click="toggleMode('nightTime')"><el-icon><moon /></el-icon></el-button>
                </template>
                <template v-else>
                    <el-button class="icon" @click="toggleMode('dayTime')"><el-icon><Sunny /></el-icon></el-button>
                </template>
            </el-tooltip>
            <el-dropdown>
                <div class="top"><el-image class="Icon" :src="require('@/assets/girl.jpg')"></el-image><div class="username">Aprilchen4</div></div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item><strong>当前角色:普通用户</strong></el-dropdown-item>
                        <el-dropdown-item>切换为：普通用户子用户</el-dropdown-item>
                        <el-dropdown-item>切换为：测试角色</el-dropdown-item>
                        <el-dropdown-item><el-icon><UserFilled /></el-icon>个人信息</el-dropdown-item>
                        <el-dropdown-item><el-icon><ReadingLamp /></el-icon>登出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <div class="bottom">
        <!-- 布局容器 -->
        <el-container>
            <SideMenu/>
            <!-- 布局容器，注意组件名称 -->
            <el-container>
                 <!-- v-for是为每个标签页渲染一个组件  -->
                <el-header>
                    <TabMenu/>
                </el-header>
                <!-- 标签页 -->

                <el-main>
                    <!-- <router-view></router-view> -->
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

// 一定要有setup,否则会提示函数未定义
<!-- Action catch((action:Action)）只能用在ts里面 -->
<script setup>

import { ElMessageBox,ElDrawer} from 'element-plus'
import { ElButton} from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SideMenu from "@/views/SideMenu.vue"
import TabMenu from '@/views/TabMenu.vue'


// 搜索弹窗
const pump = () => {
  ElMessageBox.alert(
    // ElMessageBox不会自动解析和渲染 <el-input> 组件,在 HTML 字符串中使用原生的 <input> 标签
    // 将 <el-input> 组件放在一个独立的 Vue 组件中
    // '官方网站',
    '<div class="SearchInput"><input placeholder="请输入你需要快捷到达的功能"></input></div>',
    '<strong>跳转</strong>',
    {
      dangerouslyUseHTMLString: true,
      cancelButtonText: 'cancel',
      confirmButtonText: '关闭',
    }
  )
  .catch((action) => {
    // 判断 action 是否为 'cancel',即用户点击了取消按钮
    if (action === 'cancel') {
      // 什么也不做,保持在原来的路由地址
    } else {
      // 其他情况下可以执行一些其他操作
    //   console.log('其他操作');
    }
  })
}

// 系统设置侧边栏
// JavaScript 中不需要类型声明，ref<boolean>
// drawer 是一个布尔值，用于控制 <el-drawer> 的显示和隐藏。
// 当 drawer 为 true 时，<el-drawer> 会显示。当 drawer 为 false 时，<el-drawer> 会隐藏。
// JavaScript 中，大部分情况下分号是可选的;
const drawer = ref(false);
console.log(drawer.value);

function ToggleDrawer(){
    drawer.value=!drawer.value
    console.log(drawer.value);
}

// 刷新
const router = useRouter()

const refresh = () => {
  router.push({ path: '/menu' })  // 导航到当前路由，强制重新加载视图
}

// 切换主题
const mode = ref("dayTime")
// const toggleMode = (newMode:string)需要在ts里面使用
const toggleMode = (newMode) => {
    mode.value = newMode
}

// 标签页
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
// 还是得导入，不然无法读取vuex的状态
const activeMenu = computed(() => store.state.activeMenu);
// const activeTab = computed(() => store.state.activeTab);
</script>


<style>
.top{
    display: flex;
    justify-content: center;/* 左右居中 */
    align-items: center; /* 上下居中 */
    width: 100%;
    height: 60px; /* 或者设置成你需要的高度 */
    border-bottom: 1px solid #D3D3D3;  /* 只有下边缘 */
    background-color:none; /* 设置背景色 */
}

.top-left{
    /* 和左侧距离 */
   left:10px;
   /* 保证左侧 */
   position: absolute; 
   display: flex;
   align-items: center; /* 上下居中 */
   
}
.logo{
    width: 42px;
    height: 42px;
}
.title{
    margin-left: 5px;
    font-size: 22px;
    font-weight: bold;
}

.titleInput{
    margin-left: 5px;
    border-color: transparent;
    width:100px;
}
.top-right{
    left: 920px;
    display: inline-flex;
    position: absolute; 
    align-items: center; /* 上下居中 */
}


.icon{
    width: 25px;
    height: 30px;
    border-radius: 50%;
    border-color: none; 
    margin-left: 12px;
    background-color: #f5f5f500; 
}


.Icon{
    margin-left:12px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border-color: none; 
}

.SearchInput{
    border-color:none ;
    width: 100%;
    height: 200px;
}

.username{
    font-family: 'Microsoft YaHei', sans-serif;
    margin-left: 12px;
    border: none;
}

.bottom{
    display: flex;
}

.bottom-left{
    width: 280px;
    height: 680px;
}

.web{
/* 去掉下划线 */
    text-decoration: none; 
    color: #000;
    /* target="_blank"表示让超链接在新页面中打开 */
}

.bottom-rght{
    display: flex;
}
</style>

