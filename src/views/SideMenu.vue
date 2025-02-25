<template>
<!-- 滚动条 -->
    <el-scrollbar height="400px">
        <el-menu class="bottom-left" :default-active="0" @select="handleMenuSelect">
            <nav-menu :navMenus=" sideData.values"></nav-menu>
        </el-menu>      
    </el-scrollbar>
    <!-- 布局容器，注意组件名称 -->
</template>

<script setup>
// 侧边栏相关,编写一个递归函数，将扁平数据转换为树形结构
import { getMenu } from '@/api/user'
import {reactive} from 'vue'
// import NavMenu from './NavMenu.vue'

// const sideData = reactive([]);
const sideData = reactive({
  values: []  // 初始化 values 数组
});

getMenu().then(a => {
        console.log('侧边栏数据:',a.data.menus)
        sideData.values = a.data.menus// 将 a.data.menus 的内容添加到 sideData,使用 ... 将 a.data.menus 数组中的每个元素“展开”
        console.log('数据信息', sideData.values)//这里是异步函数
        })













// 标签页相关
import { computed } from 'vue';
import { useStore } from 'vuex';
import { ref } from 'vue'

const store = useStore();
// const activeMenu = computed(() => store.state.activeMenu);

console.log('tab is:',store.state.activeTab)
const tabs = computed(()=>store.state.tabs);// 获取 Vuex 中的状态
const tab =  computed(()=>store.state.tab)
// const editableTabsValue = computed(()=>store.state.editableTabsValue);

let tabIndex = 2 //1
const editableTabsValue = ref('2')


const handleMenuSelect = (menu) => {
  console.log('Menu Select Event Triggered'); // 检查事件是否触发
  store.dispatch('updateActiveMenu', menu); // 更新当前选中的菜单
  console.log('Selected Menu:', menu);// 检查 menu 是否正确
  // addTab(menu);触发标签页更新
  const newTabName = `${++tabIndex}`
  tabs.value.push({
      title: `${menu}`,
      name: newTabName,
      content: 'New Tab content',                                                                                   
    })

    if (!tabs.value.some(tab => tab.name === menu)) {
    store.dispatch('addNewTab', tab);
    store.dispatch('updateActiveTab', menu);
  }
    console.log('Updated Tabs:', tabs.value); // 检查 tabs 是否正确更新
    editableTabsValue.value = newTabName // 2,使用模板字符串`${++tabIndex}`将 tabIndex 的新值 3 转换为字符串,并赋值给 editableTabsValue.value。
  };
  

</script>

<style>
.bottom-left{
    width: 280px;
    height: 680px;
}

</style>
            