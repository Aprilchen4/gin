<template>
  <!-- v-model 属性是用来绑定当前激活的标签页，需要写activeMenu计算属性 -->
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
import { emitter } from "@/utils/eventBus";

const store = useStore();
const tabs = computed(() => store.state.tabs);
// 还是得导入，不然无法读取vuex的状态
const activeMenu = computed(() => store.state.activeMenu);

// tab-click 事件被触发时,它会返回一个参数,这个参数就是被点击的标签页对象,包含一些属性
const TabClick = (tab) => {
  console.log("Tab Select Event Triggered", tab.props.name); // 检查事件是否触发

  store.commit("setClickTab", tab.props.name);
  emitter.emit("messageEvent", tab.props.name);
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
      console.log("删除前序列", index);
      console.log("可选数组f", tabs.value[index + 1], index + 1);
      console.log("可选数组b", tabs.value[index - 1], index - 1);

      // 写法四
      store.commit("setRemoveTab", targetName); //直接mutation--commit，同步修改
      // store.dispatch('updateActiveTab',tabs)  //前三种写法加这句无法删除,state的数据修改，只能mutaion或者action里面的函数修改

      console.log("删除后序列", index);
      console.log("删除后可选数组2", tabs.value[index + 1], index + 1);
      console.log("删除后可选数组1", tabs.value[index - 1], index - 1);

      const nextTab = tabs.value[index] || tabs.value[index - 1]; // ||：逻辑或运算符，如果左边的值为 undefined 或 null，则返回右边的值。
      if (nextTab) {
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
