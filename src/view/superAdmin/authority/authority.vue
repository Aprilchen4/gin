<template>
  <!-- 左上角按钮 -->
  <div>
    <!-- <el-drawer> 组件和 <el-button> 之间的关系是通过 v-model 指令来实现的。 -->
    <el-button class="buttonBelow" type="primary" @click="handleClickAdd">
      + 新增角色
    </el-button>
    <el-drawer v-model="drawerAdd" :with-header="true" size="600px">
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>新增角色</span>
          <div>
            <el-button @click="drawerAdd = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitAdd">
              确定
            </el-button>
          </div>
        </div>
      </template>

      <el-form :model="form" label-width="80px">
        <el-form-item>
          <template #label>
            <span style="color: red">*</span> 父级角色
          </template>
          <el-input
            placeholder="根角色(严格模式下为当前用户角色)"
            v-model="form.name"
            disabled
          >
          </el-input>
        </el-form-item>

        <el-form-item>
          <template #label> <span style="color: red">*</span> 角色ID </template>
          <el-input v-model="form.ID" placeholder="请输入角色ID" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span style="color: red">*</span> 角色名称
          </template>
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
  <!-- 以上是新增角色按钮 -->
  <!-- 表格 -->
  <div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
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
      <el-table-column prop="ID" label="角色ID" width="200" />
      <el-table-column prop="name" label="角色名称" width="200" />
      <el-table-column label="操作">
        <template #default="scope">
          <!-- 设置权限 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClickSetting(scope.row)"
          >
            <el-icon><Setting /></el-icon>设置权限
          </el-button>
          <el-drawer v-model="drawerSetting" :with-header="true" size="600px">
            <template #header>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span>角色配置</span>
              </div>
            </template>
            <tabReview />
            <!-- 遍历数据 -->
          </el-drawer>

          <!-- 新增子角色 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClickAddSub"
          >
            + 新增子角色
          </el-button>
          <el-drawer v-model="drawerAddSub" :with-header="true" size="600px">
            <template #header>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span>新增子角色</span>
                <div>
                  <el-button @click="drawerAdd = false">取消</el-button>
                  <el-button type="primary" @click="handleSubmitAddSub">
                    确定
                  </el-button>
                </div>
              </div>
            </template>

            <el-form :model="form" label-width="80px">
              <el-form-item>
                <template #label>
                  <span style="color: red">*</span> 父级角色
                </template>
                <el-input placeholder="普通用户" v-model="form.name" disabled>
                </el-input>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span style="color: red">*</span> 角色ID
                </template>
                <el-input v-model="form.ID" placeholder="请输入角色ID" />
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span style="color: red">*</span> 角色名称
                </template>
                <el-input v-model="form.name" placeholder="请输入角色名称" />
              </el-form-item>
            </el-form>
          </el-drawer>
          <!-- 拷贝 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClickCopy(scope.row)"
          >
            <el-icon><CopyDocument /></el-icon>拷贝
          </el-button>
          <el-drawer v-model="drawerCopy" :with-header="true" size="600px">
            <template #header>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span>拷贝角色</span>
                <div>
                  <el-button @click="drawerCopy = false">取消</el-button>
                  <el-button type="primary" @click="handleSubmitCopy">
                    确定
                  </el-button>
                </div>
              </div>
            </template>

            <el-form :model="form" label-width="80px">
              <el-form-item>
                <template #label>
                  <span style="color: red">*</span> 父级角色
                </template>
                <el-select
                  placeholder="根角色(严格模式下为当前用户角色)"
                  v-model="form.name"
                >
                  <el-option value="根角色(严格模式下为当前用户角色)">
                    <el-radio
                      v-model="form.name"
                      value="根角色(严格模式下为当前用户角色)"
                      >根角色(严格模式下为当前用户角色)</el-radio
                    >
                  </el-option>
                  <el-select placeholder="">
                    <!-- <template #prefix> 用于添加一个带有 普通用户 标签的单选框 el-radio： -->
                    <template #prefix>
                      <el-radio style="margin-left: 8px" value="普通用户">
                        普通用户
                      </el-radio>
                    </template>
                    <el-option disabled value="普通用户子角色">
                      <el-radio value="普通用户子角色">
                        普通用户子角色
                      </el-radio>
                    </el-option>
                  </el-select>

                  <el-option value="测试角色">
                    <el-radio v-model="form.ID" value="测试角色">
                      测试角色
                    </el-radio>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span style="color: red">*</span> 角色ID
                </template>
                <el-input
                  v-model="form.ID"
                  disabled
                  placeholder="请输入角色ID"
                />
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span style="color: red">*</span> 角色名称
                </template>
                <el-input v-model="form.name" placeholder="请输入角色名称" />
              </el-form-item>
            </el-form>
          </el-drawer>

          <!-- 编辑 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClickEdit(scope.row)"
          >
            <el-icon><edit /></el-icon>编辑
          </el-button>

          <el-drawer v-model="drawerEdit" :with-header="true" size="600px">
            <template #header>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span>编辑角色</span>
                <div>
                  <el-button @click="drawerEdit = false">取消</el-button>
                  <el-button type="primary" @click="handleSubmitEdit">
                    确定
                  </el-button>
                </div>
              </div>
            </template>

            <el-form :model="form" label-width="80px">
              <el-form-item>
                <template #label>
                  <span style="color: red">*</span> 父级角色
                </template>
                <el-select
                  placeholder="根角色(严格模式下为当前用户角色)"
                  v-model="form.parentName"
                >
                  <el-radio-group v-model="form.name">
                    <el-option value="根角色(严格模式下为当前用户角色)">
                      <el-radio value="根角色(严格模式下为当前用户角色)"
                        >根角色(严格模式下为当前用户角色)</el-radio
                      >
                    </el-option>
                    <el-select placeholder="">
                      <template #prefix>
                        <el-radio style="margin-left: 8px" value="普通用户">
                          普通用户
                        </el-radio>
                      </template>
                      <el-option disabled value="普通用户子角色">
                        <el-radio value="普通用户子角色">
                          普通用户子角色
                        </el-radio>
                      </el-option>
                    </el-select>
                    <el-option value="测试角色">
                      <el-radio value="测试角色">测试角色</el-radio>
                    </el-option>
                  </el-radio-group>
                </el-select>
              </el-form-item>

              <el-form-item>
                <template #label>
                  <span style="color: red">*</span> 角色ID
                </template>
                <el-input
                  v-model="form.ID"
                  disabled
                  placeholder="请输入角色ID"
                />
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span style="color: red">*</span> 角色名称
                </template>
                <el-input v-model="form.name" placeholder=""></el-input>
              </el-form-item>
            </el-form>
          </el-drawer>

          <!-- 删除 -->
          <el-button
            link
            type="primary"
            size="small"
            @Click="handleClickDelete(scope.row)"
          >
            <el-icon><delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { getAuthority } from "@/api/user";
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import tabReview from "@/view/superAdmin/authority/tabReview.vue";

let menuAuthority; //定义为全局变量，方便读取
// let currentRow;

getAuthority().then((a) => {
  menuAuthority = a.data;
  console.log("角色数据", menuAuthority);
});

// 弹窗
const drawerAdd = ref(false); //这里的逻辑是：按钮点击将 drawer 设置为 true 来打开抽屉。抽屉关闭后，drawer 自动设置为 false
const drawerSetting = ref(false);
const drawerEdit = ref(false);
const drawerCopy = ref(false);
const drawerAddSub = ref(false);

const form = ref({
  ID: "",
  name: "",
  parentName: "",
});
// 表格数据
const load = (row, treeNode, resolve) => {
  setTimeout(() => {
    resolve([
      {
        ID: "8881",
        name: "普通用户子角色",
        parentName: "普通用户",
      },
    ]);
  }, 1000);
};

let tableData = ref([
  {
    ID: "888",
    name: "普通用户",
    hasChildren: true, // 明确指定有子节点
    parentName: "根角色(严格模式下为当前用户角色)",
  },
  {
    ID: "9528",
    name: "测试角色",
    parentName: "根角色(严格模式下为当前用户角色)",
  },
]);

const handleClickAdd = (row) => {
  drawerAdd.value = true;
  form.value.ID = row.ID;
  form.value.name = row.name;
};

const handleClickSetting = (row) => {
  drawerSetting.value = true;
  form.value.ID = row.ID;
  form.value.name = row.name;
};

const handleClickAddSub = (row) => {
  drawerAddSub.value = true;
  form.value.ID = row.ID;
  form.value.name = row.name;
};

const handleSubmitAddSub = () => {
  if (form.value.ID && form.value.name) {
    tableData.value.push({
      ID: form.value.ID,
      name: form.value.name,
    });
    console.log("表格内容添加后", tableData.value);
    // 清空输入框
    form.value.roleID = "";
    form.value.rolename = "";
    drawerAddSub.value = false;
  } else {
    // 在这里可以添加错误提示或警告
    console.error("角色ID和角色名称不能为空");
  }
};

const handleClickEdit = (row) => {
  drawerEdit.value = true;
  form.value.ID = row.ID;
  form.value.name = row.name;
  form.value.parentName = row.parentName;
};

const handleClickCopy = (row) => {
  drawerCopy.value = true;
  form.value.ID = row.ID;
  form.value.name = row.name;
};

const handleClickDelete = async (row) => {
  try {
    await ElMessageBox.confirm("此操作将永久删除该角色，是否继续？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // 确定后执行的逻辑
    handleSubmitDelete(row); // 调用函数
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

const handleSubmitDelete = (row) => {
  if (row.ID) {
    console.log("表格内容", tableData);
    tableData.value = tableData.value.filter((item) => item.ID !== row.ID);
    // 清空输入框
    form.value.roleID = "";
    form.value.roleName = "";
  } else {
    alert("请输入角色ID以删除角色");
    console.error("请输入角色ID以删除角色");
  }
};

const handleSubmitAdd = () => {
  if (form.value.ID && form.value.name) {
    tableData.value.push({
      ID: form.value.ID,
      name: form.value.name,
    });
    // 清空输入框
    form.value.roleID = "";
    form.value.rolename = "";
    drawerAdd.value = false;
  } else {
    // 在这里可以添加错误提示或警告
    console.error("角色ID和角色名称不能为空");
  }
};

const handleSubmitEdit = () => {
  ElMessage({
    message: "添加成功!",
    type: "success",
    duration: 3000, // 提示持续时间
    center: true, // 内容居中
  });
};

const handleSubmitCopy = () => {
  ElMessage({
    message: "拷贝失败存在相同角色ID",
    type: "error",
    duration: 3000, // 提示持续时间
    center: true, // 内容居中
  });
};
</script>

<style>
.buttonBelow {
  margin-bottom: 20px;
}

.placeholder-text {
  color: black;
}

.el-drawer {
  background-color: white !important; /* 设置为不透明的白色 */
}
</style>
