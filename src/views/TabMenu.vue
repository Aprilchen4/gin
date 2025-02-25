<template>
    <!-- 绑定唯一标识 -->
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      class="demo-tabs"
      closable
      @tab-remove="removeTab"
    >
    <!-- 这里key的逻辑，代表列表内元素对象的唯一标识tabIndex -->
     <!-- editableTabs是数组，item是数值里面的元素 -->
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        {{ item.content }}
      </el-tab-pane>
    </el-tabs>
  </template>
  
  <script setup>

import {ref,watchEffect } from 'vue'
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const tabs = computed(()=>store.state.tabs);


//   let tabIndex = 2 //1
  const editableTabsValue = ref('2') //2,初始化为字符串 '2'，tab栏选中的标签索引，是列表里元素(对象)的唯一标识
//console.log(editableTabsValue.value) 只在页面加载时执行一次
//  监测切换标签页时，editableTabsValue.value的变化
  watchEffect(() => {
  console.log('editableTabsValue changed:', editableTabsValue.value)
})

//   const tabs = ref([
//     {
//       title: '首页',
//       name: '1',
//       content: 'Tab 1 content',
//     },
//     {
//       title: 'Tab 2',
//       name: '2',
//       content: 'Tab 2 content',
//     },
//   ])

// //   .push是数值的语法，新增实际上是增加列表里的对象，对象名称是响应式全局变量
//   const addTab = () => {
//     const newTabName = `${++tabIndex}`// 1
//     tabs.value.push({
//       title: 'New Tab',
//       name: newTabName,
//       content: 'New Tab content',                                                                                   
//     })
//     editableTabsValue.value = newTabName // 2,使用模板字符串`${++tabIndex}`将 tabIndex 的新值 3 转换为字符串,并赋值给 editableTabsValue.value。
//   }

//   移除指定的 Tab。如果移除的是当前选中的 Tab，自动切换到下一个或上一个 Tab。
  const removeTab = (targetName) => {
    const tabValue = tabs.value //获取当前所有的 Tab 数据。tabs 是一个数组，每个元素是一个 Tab 对象
    let activeName = editableTabsValue.value //唯一标识符：activeName是获取当前选中的 Tab 的 name，editableTabsValue 是一个响应式对象，存储了当前选中的 Tab 的 name
    if (activeName === targetName) { //判断当前选中的 activeName是否是要移除的 targetName。
        tabValue.forEach((tab, index) => {
        if (tab.name === targetName) {//遍历 tabs，可以找到要移除的 Tab 的位置（index）
          const nextTab = tabs[index + 1] || tabs[index - 1]//如果当前 Tab 是最后一个，则切换到上一个 Tab。如果当前 Tab 是第一个，则切换到下一个 Tab。
          if (nextTab) {//如果存在 nextTab，则将 activeName 更新为 nextTab 的 name。
            activeName = nextTab.name//更新当前选中的
          }
        }
      })
    }
  
    editableTabsValue.value = activeName//当前选中的
    tabs.value = tabValue.filter((tab) => tab.name !== targetName)//从 tabs 中移除 name 等于 targetName 的 Tab，更新 editableTabs，filter 方法会返回一个新的数组：
  }
  </script>
  
  <style>
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  </style>