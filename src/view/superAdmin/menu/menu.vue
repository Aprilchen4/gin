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
            <el-button @click="drawerRootAdd = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitAdd">
              确定
            </el-button>
          </div>
        </div>
      </template>
      <WarningTip title="新增菜单，需要在角色管理内配置权限才可使用" />
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
      <el-table-column prop="meta.icon" label="图标" width="120px" />
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
          <!-- 添加子菜单 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="operateClickAddSub(scope.row)"
          >
            + 添加子菜单
          </el-button>
          <el-drawer
            v-model="drawerRootAddSub"
            :with-header="true"
            size="700px"
          >
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
                  <el-button @click="drawerRootAddSub = false">取消</el-button>
                  <el-button type="primary" @click="handleSubmitAdd">
                    确定
                  </el-button>
                </div>
              </div>
            </template>
          </el-drawer>
          <!-- 编辑 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="operateClickEdit(scope.row)"
          >
            <el-icon><edit /></el-icon>编辑
          </el-button>
          <el-drawer v-model="drawerRootEdit" :with-header="true" size="700px">
            <template #header>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span>编辑菜单</span>
                <div>
                  <el-button @click="drawerRootEdit = false">取消</el-button>
                  <el-button type="primary" @click="handleSubmitAdd">
                    确定
                  </el-button>
                </div>
              </div>
            </template>
          </el-drawer>
          <!-- 删除 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="operateClickDelete(scope.row)"
          >
            <el-icon><delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { getMenuList } from "@/api/user";
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import WarningTip from "@/components/WarningTip.vue";

const menuList = ref([]);

getMenuList().then((a) => {
  menuList.value = a.data;
  console.log("菜单数据", menuList);
});

const drawerRootAdd = ref(false);
const drawerRootAddSub = ref(false);
const drawerRootEdit = ref(false);
// const drawerRootDelete = ref(false);

const form = ref({
  ID: "",
  name: "",
});

const handleClickRootAdd = () => {
  drawerRootAdd.value = true;
};

const operateClickAddSub = (row) => {
  drawerRootAddSub.value = true;
  form.value.ID = row.ID;
  form.value.name = row.name;
};

const operateClickEdit = (row) => {
  drawerRootEdit.value = true;
  form.value.ID = row.ID;
  form.value.name = row.name;
};

const operateClickDelete = async (row) => {
  try {
    await ElMessageBox.confirm("此操作将永久删除该角色，是否继续？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // 确定后执行的逻辑
    operateSubmitDelete(row); // 调用函数
    ElMessage({
      message: "删除成功!",
      type: "success",
    });
  } catch (error) {
    // 处理取消逻辑
    if (error === "cancel") {
      ElMessage({
        message: "已取消删除!",
        type: "info",
      });
    }
  }
};

const operateSubmitDelete = (row) => {
  if (row.ID) {
    console.log("删除中表格内容", menuList);
    menuList.value = menuList.value.filter((item) => item.ID !== row.ID);
    // 清空输入框
    form.value.roleID = "";
    form.value.roleName = "";
  } else {
    alert("请输入角色ID以删除角色");
    console.error("请输入角色ID以删除角色");
  }
};
</script>

<style scoped></style>
