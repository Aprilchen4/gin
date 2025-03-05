<template>
  <!-- v-model 属性是用来绑定当前激活的标签页。 -->
  <!--:default-active后面跟el-tab-pane的name属性的类型  -->
  <el-tabs
    v-model="activeMenu"
    type="card"
    class="demo-tabs"
    :default-active="1"
    @tab-remove="deleteTab"
    @tab-click="TabClick"
  >
    <!--  :default-active用于设置 el-tabs 初始化时默认选中的标签页 ;  v-model用于动态切换-->
    <!-- 这里key的逻辑，代表列表内元素对象的唯一标识tabIndex -->
    <!-- editableTabs是数组，item是数值里面的元素 -->
    <!-- 控制第一个元素不能删除：:closable ='item.label!==1' -->
    <el-tab-pane
      v-for="item in tabs"
      :key="item.label"
      :label="item.name"
      :name="item.label"
      :closable="item.label !== 1"
    >
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { watchEffect } from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
// import { reactive } from "vue";
// import { getMenu } from "@/api/user";
import { emitter } from "@/utils/eventBus";
import { ref, onMounted, onUnmounted } from "vue";
// import {handleMenuSelect}from '@/views/sideMenu.vue'
// import {state} from '@/store/index'

const store = useStore();
const tabs = computed(() => store.state.tabs);
// 还是得导入，不然无法读取vuex的状态
const activeMenu = computed(() => store.state.activeMenu);
const breadCrumb = computed(() => store.state.breadCrumb);

let tabName = "";

// const sideData = reactive({
//   values: [], // 初始化 values 数组
// });

// 首先调用 getMenu() 函数,这是一个异步操作,所以代码不会等待它完成就继续执行。紧接着,打印 '数据信息', sideData.values。
// getMenu().then((a) => {
//   console.log("侧边栏数据:", a.data.menus);
//   sideData.values = a.data.menus; // 将 a.data.menus 的内容添加到 sideData,使用 ... 将 a.data.menus 数组中的每个元素“展开”
//   console.log("数据信息", sideData.values); //这里是异步函数,
// });

const receivedMessage = ref("");
// 监听事件
onMounted(() => {
  emitter.on("messageEvent", (msg) => {
    receivedMessage.value = msg;
  });
});

// 组件卸载时清理监听器
onUnmounted(() => {
  emitter.off("messageEvent"); // 移除特定事件监听
  // 或者使用 emitter.all.clear() 移除所有监听
});

// tab-click 事件被触发时,它会返回一个参数,这个参数就是被点击的标签页对象,包含一些属性
const TabClick = (tab) => {
  console.log("Tab Select Event Triggered", tab.props.name); // 检查事件是否触发
  store.commit("setClickTab", tab.props.name);

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
  function generatebreadCrumb(tree, targetId) {
    // 查找节点及其父节点
    const path = findNodeAndParents(tree, targetId);
    if (!path) {
      return "未找到指定节点";
    }
    // 提取每个节点的 meta.title
    let breadCrumbValue = path.map((node) => node.meta.title).join(" / ");
    store.dispatch("updateBreadCrumb", breadCrumbValue);
    // emit('send-data', breadCrumb.value);
    // return breadCrumb;
    //  提起最后一个节点的meta.title
    tabName = path[path.length - 1].meta.title;
    console.log("里标签页名称:", tabName);
    // tabName.value=tabName;//报错
    console.log("生成面包屑", breadCrumb.value);
  }

  console.log("菜单的生成面包屑", activeMenu.value);
  // const breadCrumb = ref('');
  breadCrumb.value = generatebreadCrumb(receivedMessage.value, tab.props.name);

  // store.commit('setBreadCrumb',breadCrumb)
  console.log("before Updated Active Menu:", activeMenu.value);
  // store.dispatch('updateClickTab',tab)
  // const activeMenu = tab.props.name //表示访问 tab 对象的 props 属性中的 label值,建是属性的名称，属性是键值对；
  // store.dispatch('updateActiveMenu', activeMenu); // 必须加，这句保证在切换标签页时动态更新菜单和抬头
  // store.commit('setActiveMenu', activeMenu); //
  console.log("Updated Active Menu:", activeMenu.value); // 打印更新后的 activeMenu
};

// SideMenu组件切换、新增都会调用watchEffect函数监测，新增打印的是新增之后的；
// delete函数也会调用watchEffect，打印的是delete之后的；；
watchEffect(() => {
  console.log("editableTabsValue changed:", activeMenu.value); //这里也是操作后端
  console.log("监测标签页的tabs", tabs.value); //放到事件外面，没有触发事件时不会打印；但是这里逻辑也不对，打印都是操作后的，不管是删除还是切换；
});

// tab-remove 事件会返回一个参数,这个参数是一个对象,包含了以下属性:name: 被关闭的标签页的名称 label: 被关闭的标签页的标签文本。 index: 被关闭的标签页的索引位置。
// 移除指定的 Tab。如果移除的是当前选中的 Tab，自动切换到下一个或上一个 Tab。
const deleteTab = (targetName) => {
  console.log("传入的目标数据", targetName);
  console.log("删除前选中的内容", activeMenu.value);
  console.log("删除前的tabs", tabs.value);

  // const tabValue = tabs.value //获取当前所有的 Tab 数据。tabs 是一个数组，每个元素是一个 Tab 对象
  tabs.value.forEach((tab, index) => {
    if (tab.label === targetName) {
      //遍历 tabs，可以找到要移除的 Tab 的位置（index）

      // 写法一
      // tabs.value = tabs.value.filter((tab) => tab.title !== targetName)//从 tabs 中移除 name 等于 targetName 的 Tab，更新 editableTabs，filter 方法会返回一个新的数组：

      //写法二
      // state.tabs = state.tabs.filter((tab) => tab.title !== targetName);

      // 写法三
      // const newTabs = [...tabs.value];
      // newTabs.splice(index, 1);
      // tabs.value = newTabs;
      console.log("删除前序列", index);
      console.log("可选数组f", tabs.value[index + 1], index + 1);
      console.log("可选数组b", tabs.value[index - 1], index - 1);
      // 写法四
      store.commit("setRemoveTab", targetName); //直接mutation--commit，同步修改
      console.log("删除后序列", index);
      console.log("删除后可选数组2", tabs.value[index + 1], index + 1);
      console.log("删除后可选数组1", tabs.value[index - 1], index - 1);
      // store.dispatch('updateActiveTab',tabs)  //前三种写法加这句无法删除,state的数据修改，只能mutaion或者action里面的函数修改
      // store.commit('updateActiveTab',tabs) // 同理

      // 删除后的index发生了变化；
      // 当删除一个元素时，数组中剩余元素的索引会自动调整，以保持连续的索引。
      // console.log("可选数组f",tabs.value[index])
      // console.log("可选数组b",tabs.value[index-1])
      const nextTab = tabs.value[index] || tabs.value[index - 1]; // ||：逻辑或运算符，如果左边的值为 undefined 或 null，则返回右边的值。
      if (nextTab) {
        //如果存在 nextTab，则将 activeName 更新为 nextTab 的 name。
        // 包括activemenu也是需要通过mutations修改，不能直接赋值；
        // activeMenu.value = nextTab.title//更新当前选中的标签页

        // store.dispatch('updateNextTab', nextTab);//可以
        store.commit("setNextTab", nextTab);

        // store.commit('setActiveMenu',activeMenu)这一句和store.commit('SetnextTab',nextTab)是一个意思；
        console.log("选中的内容", activeMenu.value); //这里不对
        console.log("删除后的tabs", tabs.value); //是数组，没问题
      }
    }
  });
  //Vuex 就会去执行名为 'updateActiveTab' 的 action
};
</script>

<style scoped>
:deep(.el-tabs__item.is-active) {
  color: #409eff; /* 文字颜色为蓝色 */
  background-color: #e6f7ff; /* 背景色为浅蓝色 */
  border-color: #409eff; /* 边框颜色为蓝色 */
  font-weight: bold;
}
</style>
