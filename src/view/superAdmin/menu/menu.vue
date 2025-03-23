<template>
  <div>
    <!-- <el-drawer> 组件和 <el-button> 之间的关系是通过 v-model 指令来实现的。 -->
    <el-button type="primary" @click="handleClickRootAdd">
      + 新增根菜单
    </el-button>
    <el-drawer v-model="drawerRootAdd" :with-header="true" size="700px">
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>新增菜单</span>
          <div>
            <el-button @click="drawerAdd = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitAdd">
              确定
            </el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
  <!-- 表格 -->
  <div>
    <el-table
      :data="menuList"
      style="width: 100%; margin-top: 20px"
      row-key="ID"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      lazy
      :load="load"
      :header-row-style="{
        backgroundColor: '#f5f7fa',
        color: '#000',
        fontWeight: 'bold',
      }"
    >
      <!-- prop 属性用于指定该列所绑定的数据字段。它与表格的 data 属性中的对象属性相对应。 -->
      <el-table-column prop="ID" label="ID" width="80px" />
      <el-table-column prop="meta.title" label="展示名称" width="120px" />
      <el-table-column prop="meta.icon" label="图标" width="100px" />
      <el-table-column
        prop="name"
        show-overflow-tooltip
        label="路由Name"
        width="120px"
      />
      <el-table-column
        prop="path"
        show-overflow-tooltip
        label="路由Path"
        width="120px"
      />
      <el-table-column prop="hidden" label="是否隐藏" width="120px">
        <template #default="scope">
          <span>{{ scope.row.hidden ? "隐藏" : "显示" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="父节点" width="100px" />
      <el-table-column prop="sort" label="排序" width="80px" />
      <el-table-column prop="component" label="文件路径" width="200px" />
      <el-table-column fixed="right" label="操作" width="120px">
        <template #default="scope">
          <!-- 设置权限 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClickSetting(scope.row)"
          >
            <el-icon><Setting /></el-icon>添加子菜单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { getMenuList } from "@/api/user";
import { ref } from "vue";

const menuList = ref([]);

getMenuList().then((a) => {
  menuList.value = a.data;
  console.log("菜单数据", menuList);
});

const drawerRootAdd = ref(false);
const form = ref({
  ID: "",
  name: "",
});

const handleClickRootAdd = (row) => {
  drawerRootAdd.value = true;
  form.value.ID = row.ID;
  form.value.name = row.name;
};
</script>

<style scoped></style>
