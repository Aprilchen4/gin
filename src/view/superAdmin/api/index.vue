<template>
  <div>
    <!-- 注意这里绑定数据和表格部分不是同一个响应式 -->
    <el-form :inline="true" :model="searchInfo" style="font-size: small" class="search-form">
      <el-form-item label="路径">
        <el-input v-model="searchInfo.path" placeholder="路径" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="searchInfo.description" placeholder="描述" />
      </el-form-item>
      <el-form-item label="API分组">
        <el-select v-model="searchInfo.apiGroup" clearable placeholder="请选择">
          <el-option v-for="item in apiGroupOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="请求">
        <el-select v-model="searchInfo.method" clearable placeholder="请选择">
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="`${item.label}(${item.value})`"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="onSubmit"> 查询 </el-button>
        <el-button icon="refresh" @click="onReset"> 重置 </el-button>
      </el-form-item>
    </el-form>
  </div>
  <div style="margin-top: 20px">
    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 20px">
      <el-button type="primary" icon="plus" @click="addApi"> 新增 </el-button>
      <el-button icon="delete" @click="onDelete" :disabled="!apis.length"> 删除 </el-button>
      <el-button icon="Refresh" @click="onFresh"> 刷新缓存 </el-button>
      <el-button icon="Compass" @click="onSync"> 同步API </el-button>
      <exportTemplate template-id="api" />
      <exportExcel template-id="api" :limit="9999" />
      <importExcel template-id="api" @on-success="getTableData" />
    </div>
    <!-- 注意这里：表格绑定数组 ，prop对应数组元素===对象的属性-->
    <el-table
      :data="tableInfo"
      @selection-change="handleSelectionChange"
      :header-row-style="{
        backgroundColor: '#f5f7fa',
        color: '#000',
        fontSize: '16px',
        fontWeight: 'bold',
      }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="ID" label="id" min-width="35" sortable />
      <el-table-column prop="path" label="API路径" sortable />
      <el-table-column prop="apiGroup" label="API分组" sortable />
      <el-table-column prop="description" label="API简介" sortable />
      <el-table-column prop="method" label="请求" sortable />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="operateClickEdit(scope.row)"
            ><el-icon><edit /></el-icon>编辑
          </el-button>
          <el-button link type="primary" size="small" @click="deleteApiFunc(scope.row)">
            <el-icon><delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 注意分页的样式位置 -->
  <div style="display: flex; justify-content: flex-end; margin-top: 10px">
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :page-sizes="[10, 30, 50, 100]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>

  <el-drawer v-model="drawerChange" :with-header="true" size="700px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>{{ dialogTitle }}</span>
        <div>
          <el-button @click="drawerChange = false">取消</el-button>
          <template v-if="operationType === 'addApi'">
            <el-button type="primary" @click="handleSubmitAdd">确定</el-button>
          </template>
          <template v-else-if="operationType === 'editApi'">
            <el-button type="primary" @click="handleSubmitEdit">确定</el-button>
          </template>
        </div>
      </div>
    </template>
    <warningTip title="新增API，需要在角色管理内配置权限才可使用" style="margin-bottom: 10px" />
    <!-- 注意这里，表单绑定对象 -->
    <el-form :model="formInfo" label-width="80px" :rules="rules">
      <el-form-item prop="path">
        <template #label>路径</template>
        <el-input v-model="formInfo.path" />
      </el-form-item>
      <el-form-item prop="method">
        <template #label>请求</template>
        <el-select v-model="formInfo.method" clearable placeholder="请选择">
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="`${item.label}(${item.value})`"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="apiGroup">
        <template #label>api分组</template>
        <el-select v-model="formInfo.apiGroup" clearable placeholder="请选择或新增">
          <el-option v-for="item in apiGroupOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="description">
        <template #label>api简介</template>
        <el-input v-model="formInfo.description" placeholder="请输入角色名称" />
      </el-form-item>
    </el-form>
  </el-drawer>
  <!-- 同步Api抽屉 -->
  <el-drawer v-model="drawerAsync" :with-header="true" size="700px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>同步路由</span>
        <div>
          <el-button @click="drawerAsync = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitAsync">确定</el-button>
        </div>
      </div>
    </template>
    <warningTip
      title="同步API，不输入路由分组将不会被自动同步，如果api不需要参与鉴权，可以按忽略按钮进行忽略。"
      style="margin-bottom: 10px"
    />
    <div style="display: flex; align-items: center; gap: 8px">
      <div style="font-weight: 500">新增路由</div>
      <span style="font-size: 12px; color: #666">存在于当前路由中，但是不存在于api表</span>
      <el-button type="primary" size="small" @click="apiAutoCompletion">自动填充</el-button>
    </div>
    <!-- 同步Api抽屉表格 ，绑定数组，而不是newApis.value-->
    <el-table
      :data="newApis"
      style="margin-top: 10px"
      :header-row-style="{
        backgroundColor: '#f5f7fa',
        color: '#000',
        fontSize: '13px',
        fontWeight: 'bold',
      }"
    >
      <el-table-column prop="path" label="API路径" />
      <el-table-column prop="apiGroup" label="API分组">
        <template #default="{ row }">
          <el-select v-model="row.apiGroup" clearable placeholder="请选择">
            <el-option v-for="item in apiGroupOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="API简介">
        <template #default="{ row }">
          <el-input v-model="row.description" autocomplete="off" />
        </template>
      </el-table-column>
      <el-table-column prop="method" label="请求">
        <template #default="{ row }"> {{ row.method }}/{{ getMethodLabel(row.method) }} </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="SingleAdd(scope.row)"> 单条新增 </el-button>
          <el-button link type="primary" size="small" @click="handleIgnore(scope.row)"> 忽略 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; align-items: center; gap: 8px; margin-top: 10px">
      <div style="font-weight: 500">已删除路由</div>
      <span style="font-size: 12px; color: #666">已经不存在于当前项目的路由中，确定同步后会自动从apis表删除</span>
    </div>
    <!-- 已删除表格 -->
    <el-table
      :data="deleteApis"
      style="margin-top: 10px"
      :header-row-style="{
        backgroundColor: '#f5f7fa',
        color: '#000',
        fontSize: '13px',
        fontWeight: 'bold',
      }"
    >
      <el-table-column prop="path" label="API路径" />
      <el-table-column prop="apiGroup" label="API分组"> </el-table-column>
      <el-table-column prop="description" label="API简介"> </el-table-column>
      <el-table-column prop="method" label="请求">
        <template #default="{ row }"> {{ row.method }}/{{ getMethodLabel(row.method) }} </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; align-items: center; gap: 8px; margin-top: 10px">
      <div style="font-weight: 500">忽略路由</div>
      <span style="font-size: 12px; color: #666">忽略路由不参与api同步，常见为不需要进行鉴权行为的路由</span>
    </div>
    <el-table
      :data="ignoreApis"
      style="margin-top: 10px"
      :header-row-style="{
        backgroundColor: '#f5f7fa',
        color: '#000',
        fontSize: '13px',
        fontWeight: 'bold',
      }"
    >
      <el-table-column prop="path" label="API路径" />
      <el-table-column prop="apiGroup" label="API分组"> </el-table-column>
      <el-table-column prop="description" label="API简介"> </el-table-column>
      <el-table-column prop="method" label="请求">
        <template #default="{ row }"> {{ row.method }}/{{ getMethodLabel(row.method) }} </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="operateIgnore(scope.row)">取消忽略</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<script setup>
import exportTemplate from "@/components/apiExportImport/exportTemplate.vue";
import exportExcel from "@/components/apiExportImport/exportExcel.vue";
import importExcel from "@/components/apiExportImport/importExcel.vue";
import warningTip from "@/components/WarningTip.vue";

import {
  getApiList,
  getApiGroups,
  syncApi,
  llmAuto,
  createApi,
  ignoreApi,
  enterSyncApi,
  deleteApi,
  getApiById,
  updateApi,
  freshCasbin,
  deleteApisByIds,
} from "@/api/user";
import { ref, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";

//删除按钮勾选响应，apis表示数组元素（对象
const apis = ref([]);
// 表示元素ID
const selectedIds = ref([]);
//抬头选择器
const apiGroupOptions = ref([]);
const dialogTitle = ref("");
const operationType = ref("");

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const drawerChange = ref(false);
const drawerAsync = ref(false);

const deleteApis = ref([]);
const ignoreApis = ref([]);
const newApis = ref([]);
const pathArray = ref([]);

const searchInfo = reactive({
  path: "",
  description: "",
  apiGroup: "",
  method: "",
});

// 注意这里，将表格数据和表单数据分开管理。
const tableInfo = ref([]);
const formInfo = reactive({
  // value: [], // 统一使用value作为表格数据
  path: "",
  description: "",
  apiGroup: "",
  method: "",
});

const methodOptions = ref([
  { value: "POST", label: "创建", type: "success" },
  { value: "GET", label: "查看", type: "" },
  { value: "PUT", label: "更新", type: "warning" },
  { value: "DELETE", label: "删除", type: "danger" },
]);

// 同步抽屉请求列
const getMethodLabel = (method) => {
  const found = methodOptions.value.find((item) => item.value === method);
  return found ? found.label : method; // 如果找不到，返回原始 method
};

// 用于抽屉部分
const rules = ref({
  path: [{ required: true, message: "请输入api路径", trigger: "blur" }],
  apiGroup: [{ required: true, message: "请输入组名称", trigger: "blur" }],
  method: [{ required: true, message: "请选择请求方式", trigger: "blur" }],
  description: [{ required: true, message: "请输入api介绍", trigger: "blur" }],
});

getApiList({ page: 1, pageSize: 10 }).then((res) => {
  tableInfo.value = res.data.list;
  total.value = res.data.total;
});

getApiGroups().then((res) => {
  apiGroupOptions.value = res.data.groups.map((item) => ({
    label: item,
    value: item,
  }));
});

// 查询逻辑
const onSubmit = async () => {
  const res = await getApiList({
    page: page.value,
    pageSize: pageSize.value,
    path: searchInfo.path,
    description: searchInfo.description,
    apiGroup: searchInfo.apiGroup,
    method: searchInfo.method,
  });
  tableInfo.value = res.data.list; // 更新表格数据
  total.value = res.data.total; // 更新总数
};

// 重置逻辑
const onReset = async () => {
  await fetchTableData();
};

// 新增按钮抽屉
const addApi = async () => {
  drawerChange.value = true;
  dialogTitle.value = "新增Api";
  operationType.value = "addApi";
  // 重置 formInfo 的表单字段，而不是 formInfo.value
  formInfo.path = "";
  formInfo.description = "";
  formInfo.apiGroup = "";
  formInfo.method = "";
};

// 新增按钮确认提交
const handleSubmitAdd = async () => {
  await createApi({
    path: formInfo.path,
    description: formInfo.description,
    apiGroup: formInfo.apiGroup,
    method: formInfo.method,
  });
  await fetchTableData();
  await fetchApiGroups();
};

// 删除勾选 批量操作
const handleSelectionChange = (val) => {
  // 选中的数组元素
  apis.value = val;
  // 从勾选的元素中提取所有 ID 字段，组成一个新数组，
  selectedIds.value = val.map((item) => item.ID); // 提取所有ID
};

// 中间删除逻辑
const onDelete = async () => {
  try {
    await ElMessageBox.confirm("确定删除吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteApisByIds({ ids: selectedIds.value });
    await fetchTableData();
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

// 刷新缓存逻辑
const onFresh = async () => {
  try {
    await ElMessageBox.confirm("确定要刷新缓存吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await freshCasbin();
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

// 同步按钮抽屉，这里syncApi是GEt请求，方法不对，会提示请求资源不存在
// 注意这里数组赋值，不是data.deleteApis.value
const onSync = async () => {
  drawerAsync.value = true;
  const { data } = await syncApi();
  deleteApis.value = data.deleteApis;
  ignoreApis.value = data.ignoreApis;
  newApis.value = data.newApis;
  // 获取ai自动填充请求函数的参数
  // 从newApis.value中提取path字段，组成一个新数组
  pathArray.value = newApis.value.map((item) => item.path);
};

// 编辑按钮抽屉
const operateClickEdit = async (row) => {
  drawerChange.value = true;
  await getApiById({ id: row.ID });
  dialogTitle.value = "编辑Api";
  operationType.value = "editApi";
  // formInfo.value = row.value; // 不能这么写，直接赋值属性
  formInfo.path = row.path;
  formInfo.apiGroup = row.apiGroup;
  formInfo.method = row.method;
  formInfo.description = row.description;
};

// 编辑按钮确定提交,注意这里的表单绑定的是formInfo，和row区别
const handleSubmitEdit = async () => {
  await updateApi({
    ID: formInfo.ID,
    path: formInfo.path,
    method: formInfo.method,
    apiGroup: formInfo.apiGroup,
    description: formInfo.description,
  });
  await fetchTableData();
  ElMessage.success("编辑成功");
};

// 表格删除逻辑
const deleteApiFunc = async (row) => {
  try {
    await ElMessageBox.confirm("此操作将永久删除所有角色下该api, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteApi({
      ID: row.ID,
      apiGroup: row.apiGroup,
      description: row.description,
      method: row.method,
      path: row.path,
    });
    await fetchTableData();
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

//  同步抽屉确定提交
const handleSubmitAsync = async () => {
  if (!newApis.value.length === 0) {
    ElMessage.error(`存在API未分组或未填写描述`);
    return;
  }
  await enterSyncApi({
    deleteApis: deleteApis.value,
    ignoreApis: ignoreApis.value,
    newApis: newApis.value,
  });
  await fetchTableData();
  ElMessage.success("操作成功");
};

const apiAutoCompletion = async () => {
  await llmAuto({
    command: "apiCompletion",
    mode: "butler",
    data: pathArray.value,
  });
  ElMessage.error(`请先前往插件市场个人中心获取AiPath并填入config.yaml中，再进行同步`);
};

// 单条新增
const SingleAdd = async (row) => {
  if (!row.apiGroup) {
    ElMessage.error(`请先填写api分组`);
    return;
  }
  // 2. 检查 description 是否为空
  if (!row.description) {
    ElMessage.error("请先填写 API 简介");
    return;
  }
  try {
    await createApi({
      ID: 0,
      apiGroup: row.apiGroup,
      description: row.description,
      method: row.method,
      path: row.path,
    });
    await fetchTableData();
    await fetchApiGroups();
    ElMessage.success("添加成功");
    // 可以在这里刷新数据或关闭抽屉
  } catch (error) {
    ElMessage.error("添加失败：" + error.message);
  }
};

// 忽略
const handleIgnore = async (row) => {
  await ignoreApi({
    flag: true,
    method: row.method,
    path: row.path,
  });
  ElMessage.success("操作成功");
};

// 取消忽略
const operateIgnore = async (row) => {
  await ignoreApi({
    flag: false,
    method: row.method,
    path: row.path,
  });
  ElMessage.success("操作成功");
};

//创建函数赋值并统一调用
const fetchTableData = async () => {
  try {
    const res = await getApiList({
      page: page.value,
      pageSize: pageSize.value,
      orderKey: "method",
      desc: false,
    });
    tableInfo.value = res.data.list; // 更新表格数据
    total.value = res.data.total; // 更新总数
  } catch (error) {
    console.error("Failed to fetch table data:", error);
  }
};

const fetchApiGroups = async () => {
  try {
    const res = await getApiGroups(); // 等待请求完成
    apiGroupOptions.value = res.data.groups.map((item) => ({
      label: item,
      value: item,
    }));
  } catch (error) {
    console.error("获取API分组失败:", error);
    // 可以在这里显示错误提示，如 ElMessage.error("获取API分组失败");
  }
};
</script>

<style>
.search-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.search-form .el-form-item {
  flex: 1;
  min-width: 200px;
  margin-right: 10px;
}

.search-form .el-form-item:last-child {
  margin-right: 0;
}

.search-form .el-input,
.search-form .el-select {
  width: 100%;
}
</style>
