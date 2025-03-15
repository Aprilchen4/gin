<template>
  <div>
    <el-button type="primary" @click="drawer = true">+ 新增角色</el-button>
    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <el-button color="pink">Smart!</el-button>
    </el-drawer>
  </div>

  <div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
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
// const load = (row, treeNode, resolve) => {
//   setTimeout(() => {
//     resolve([
//       {
//         // ID: menuAuthority[0].children[0].authorityId,
//         // name: menuAuthority[0].children[0].authorityName,
//         ID: "2016-05-01",
//         name: "wangxiaohu",
//         operation: "No. 189, Grove St, Los Angeles",
//       },
//     ]);
//   }, 1000);
// };

let tableData = [
  {
    ID: "888",
    name: "普通用户",
    // hasChildren: true, // 表示有子节点，但不直接提供 children
    operation: "No. 189, Grove St, Los Angeles",
    children: [
      {
        ID: "8881",
        name: "普通用户子角色",
        operation: "No. 189, Grove St, Los Angeles",
      },
    ],
  },
  {
    ID: "9528",
    name: "测试角色",
    operation: "No. 189, Grove St, Los Angeles",
    hasChildren: false,
  },
];
</script>

<style></style>
