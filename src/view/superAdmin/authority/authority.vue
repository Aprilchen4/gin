<template>
  <div>
    <!-- <el-drawer> 组件和 <el-button> 之间的关系是通过 v-model 指令来实现的。 -->
    <el-button class="buttonBelow" type="primary" @click="drawer = true">
      + 新增角色
    </el-button>
    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <el-button color="pink">Smart!</el-button>
    </el-drawer>
  </div>

  <div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="ID"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      lazy
      :load="load"
    >
      <el-table-column prop="ID" label="角色ID" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="operation" label="操作" />
    </el-table>
  </div>
</template>

<script setup>
import { getAuthority } from "@/api/user";
import { ref } from "vue";
let menuAuthority; //定义为全局变量，方便读取

getAuthority().then((a) => {
  menuAuthority = a.data;
  // const menuAuthority = await getAuthority();
  console.log("角色数据", menuAuthority);
});

// 弹窗
const drawer = ref(false); //这里的逻辑是：按钮点击将 drawer 设置为 true 来打开抽屉。抽屉关闭后，drawer 自动设置为 false

// 表格数据
const load = (row, treeNode, resolve) => {
  setTimeout(() => {
    resolve([
      {
        ID: "8881",
        name: "普通用户子角色",
        operation: "No. 189, Grove St, Los Angeles",
      },
    ]);
  }, 1000);
};

let tableData = [
  {
    ID: "888",
    name: "普通用户",
    // hasChildren: true, // 表示有子节点，但不直接提供 children
    operation: "No. 189, Grove St, Los Angeles",
    hasChildren: true, // 明确指定有子节点
    // children: [
    //   {
    //     ID: "8881",
    //     name: "普通用户子角色",
    //     operation: "No. 189, Grove St, Los Angeles",
    //   },
    // ],
  },
  {
    ID: "9528",
    name: "测试角色",
    operation: "No. 189, Grove St, Los Angeles",
  },
];
</script>

<style>
.buttonBelow {
  margin-bottom: 20px;
}
</style>
