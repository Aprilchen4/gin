<template>
<!-- 滚动条 -->
 <!-- :default-active="1" 用于设置 el-menu 组件初始化时默认选中的菜单项 -->
    <el-scrollbar height="400px">
        <el-menu class="bottom-left" :default-active=1 @select="handleMenuSelect" @open="MenuOpenEvent" @click="sendData">
            <!-- 递归组件，把遍历的值传回子组件，完成递归调用 -->
            <MenuItems :navMenus=" sideData.values"/>
        </el-menu>      
    </el-scrollbar>
    <!-- 布局容器，注意组件名称 -->
</template>

<script setup>
// 侧边栏相关,编写一个递归函数，将扁平数据转换为树形结构
import { getMenu } from '@/api/user'
import {reactive} from 'vue'
import MenuItems from "@/views/MenuItems.vue"

// const sideData = reactive([]);
const sideData = reactive({
  values: []  // 初始化 values 数组
});

// 首先调用 getMenu() 函数,这是一个异步操作,所以代码不会等待它完成就继续执行。紧接着,打印 '数据信息', sideData.values。
getMenu().then(a => {
        console.log('侧边栏数据:',a.data.menus)
        sideData.values = a.data.menus// 将 a.data.menus 的内容添加到 sideData,使用 ... 将 a.data.menus 数组中的每个元素“展开”
        console.log('数据信息', sideData.values)//这里是异步函数,
        })

const MenuOpenEvent = (key,keyPath) => {
  console.log('Menu Open Event Triggered', key, keyPath)
}


// 标签页相关
import { computed } from 'vue';
import { useStore } from 'vuex';
import {defineEmits} from 'vue';
// import { defineExpose } from 'vue'

const store = useStore();
const tabs = computed(()=>store.state.tabs);// 获取 Vuex 中的状态
// const activeMenu = computed(() => store.state.activeMenu);


// 用于传递数据,这里居然不需要定义是响应式；
// let会造成全局变量污染
// const实际实际上是修改了包装对象的属性，而不是重新赋值变量本身。
let TabName = '';


// activeMenu 实际上是 el-menu 组件的 @select 事件的第一个参数，即当前选中菜单项的 index 值,通常是菜单的唯一标识，如菜单名字或路径;
const handleMenuSelect = (activeMenu) => {
  console.log('Menu Select Event Triggered',activeMenu); // 检查事件是否触发
  store.commit('setActiveMenu', activeMenu); 

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

  // 生成面包屑
  function generateBreadcrumb(tree, targetId) {
    // 查找节点及其父节点
    const path = findNodeAndParents(tree, targetId);

    if (!path) {
      return '未找到指定节点';
    }
    // 提取每个节点的 meta.title
    const breadcrumb = path.map((node) => node.meta.title).join(' / ');
    emit('send-data', breadcrumb);
    // return breadcrumb;
    //  提起最后一个节点的meta.title
    TabName =  path[path.length - 1].meta.title;
    console.log('里标签页名称:',TabName);
    // TabName.value=TabName;//报错
    console.log('生成面包屑',breadcrumb);
  }

  console.log('菜单的生成面包屑', activeMenu)
  // const breadcrumb = ref('');
  const breadcrumb = generateBreadcrumb(sideData.values, activeMenu);
  // console.log('生成面包屑',breadcrumb);
  // console.log('生成面包屑价值',breadcrumb.value);，显示未定义

  // // 自定义事件
  // console.log('外面生成面包屑',breadcrumb);
  // const emit = defineEmits(['send-data']); // 定义自定义事件
  // const sendData = () => {
  // emit('send-data', breadcrumb); // 触发事件并传递数据
  // };

  // 遍历数组，找到与 activeMenu 匹配的对象，只能找到一级；
  // const selectedMenu = sideData.values.find((menu) => menu.menuId === activeMenu)
  // if (selectedMenu) {
  //   TabName = selectedMenu.meta.title
  //   console.log('选中菜单的名称:', TabName);
  // }
  // store.commit('setActiveMenu', activeMenu); // 无顺序，保证切换。这里必须要写vuex更新,标签页动态绑定;

// 切换已有、新增时会调用watchEffect函数监测切换标签页
  if (tabs.value.some((tab)=>tab.label===activeMenu)){
    store.dispatch('updateActiveMenu', activeMenu);//无顺序，保证切换
    console.log('Tab already exists:', activeMenu);
    console.log('已有菜单tabs',tabs.value)
  }else{
      console.log('Tab not exists:', activeMenu);
      console.log('面包屑名称:',breadcrumb );//函数外调用显示未定义
      // console.log('外标签页名称1:',TabNameComputed);
      console.log('外标签页名称:',TabName);
      store.commit('setActiveMenu', activeMenu);
      // const book='one'
      store.commit('addTab',{activeMenu,TabName})//这个地方的参数可以是state之外的

  // 关于tabs的修改需要通过mutation函数完成，而不能直接修改tabs.value，因为这样做会导致 Vue 无法检测到数据的变化，从而无法触发视图的更新。
  // 正确的做法是使用 Vuex 的 mutation 函数来修改 tabs 的值。mutation 函数是 Vuex 中用于修改状态的唯一方法，它必须是同步的。
    //   tabs.value.push({
    //   title: activeMenu,
    //   name: activeMenu,
    //   content: 'new tab content',                                                                                   
    // })
    console.log('New Tab added:', activeMenu);
    console.log('新增菜单tabs',tabs.value)
  }
    console.log('Updated Tabs:', tabs.value); // 打印全部的tab值，检查 tabs 是否正确更新；
  };

// const TabName=ref('');

  // 自定义事件
  // const breadcrumb = generateBreadcrumb(sideData.values, activeMenu);
  // console.log('生成面包屑',breadcrumb);
  // console.log('外面生成面包屑',breadcrumb);
  const emit = defineEmits(['send-data']); // 定义自定义事件
  const sendData = () => {
  // emit('send-data', breadcrumb); // 触发事件并传递数据
  };
  // console.log('外标签页名称',TabName)//啥也不是
</script>

<style>
.bottom-left{
    width: 280px;
    height: 680px;
}

</style>
            