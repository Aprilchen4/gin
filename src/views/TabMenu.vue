<template>
    <div style="margin-bottom: 20px">
      <el-button size="small" @click="addTab(editableTabsValue)">
        add tab
      </el-button>
    </div>
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      class="demo-tabs"
      closable
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        {{ item.content }}
      </el-tab-pane>
    </el-tabs>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // tabIndex这个变量可能用于记录当前选中的选项卡索引
  let tabIndex = 2
  const editableTabsValue = ref('2')
  const editableTabs = ref([
    {
      title: '首页',
      name: '1',
      content: '',
    },
    {
      title: '仪表盘',
      name: '2',
      content: '',
    },
    {
      title: '角色管理',
      name: '3',
      content: '',
    },
  ])
  
  const addTab = () => {
    // ++tabIndex 是一个自增运算符,它会先将 tabIndex 的值加 1,然后返回增加后的值。
    const newTabName = `${++tabIndex}`
    editableTabs.value.push({
      title: 'New Tab',
      name: newTabName,
      content: 'New Tab content',
    })
    editableTabsValue.value = newTabName
  }

  const removeTab = (targetName) => {
    const tabs = editableTabs.value
    let activeName = editableTabsValue.value
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.name
          }
        }
      })
    }
  
    editableTabsValue.value = activeName
    editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
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