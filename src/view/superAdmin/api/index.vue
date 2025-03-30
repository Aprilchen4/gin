<template>
  <div>
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
      <el-button type="primary" icon="plus" @click="openDialog('addApi')"> 新增 </el-button>
      <el-button icon="delete" @click="onDelete" :disabled="!apis.length"> 删除 </el-button>
      <el-button icon="Refresh" @click="onFresh"> 刷新缓存 </el-button>
      <el-button icon="Compass" @click="onSync"> 同步API </el-button>
      <exportTemplate template-id="api" />
      <exportExcel template-id="api" :limit="9999" />
      <importExcel template-id="api" @on-success="getTableData" />
    </div>

    <el-table
      :data="searchInfo.value"
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
          <el-button link type="primary" size="small" @click="operateClickAddSub(scope.row)"
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
</template>

<script setup>
import exportTemplate from "@/components/apiExportImport/exportTemplate.vue";
import exportExcel from "@/components/apiExportImport/exportExcel.vue";
import importExcel from "@/components/apiExportImport/importExcel.vue";

import { getApiList, getApiGroups } from "@/api/user";
import { ref, reactive } from "vue";

//删除按钮勾选响应
const apis = ref([]);
//抬头选择器
const apiGroupOptions = ref([]);

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const searchInfo = reactive({
  value: [], // 统一使用value作为表格数据
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

// 用于抽屉部分
// const rules = ref({
//   path: [{ required: true, message: "请输入api路径", trigger: "blur" }],
//   apiGroup: [{ required: true, message: "请输入组名称", trigger: "blur" }],
//   method: [{ required: true, message: "请选择请求方式", trigger: "blur" }],
//   description: [{ required: true, message: "请输入api介绍", trigger: "blur" }],
// });

getApiList({ page: 1, pageSize: 10 }).then((res) => {
  searchInfo.value = res.data.list;
  total.value = res.data.total;
});

getApiGroups().then((res) => {
  apiGroupOptions.value = res.data.groups.map((item) => ({
    label: item,
    value: item,
  }));
});

// 其他方法
const onSubmit = () => {
  // 查询逻辑
};

const onReset = () => {
  // 重置逻辑
};

// 删除勾选 批量操作
const handleSelectionChange = (val) => {
  apis.value = val;
};

const onDelete = () => {
  // 删除逻辑
};

const onFresh = () => {
  // 刷新缓存逻辑
};

const onSync = () => {
  // 同步API逻辑
};

const operateClickAddSub = () => {
  // 编辑逻辑
};

const deleteApiFunc = () => {
  // 删除逻辑
};

// 每页条数变化时触发
const handleSizeChange = async (val) => {
  pageSize.value = val;
  console.log(`每页 ${val} 条`);
  await fetchTableData();
};

// 当前页码变化时触发
const handleCurrentChange = async (val) => {
  page.value = val;
  console.log(`当前页: ${val}`);
  await fetchTableData();
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
    searchInfo.value = res.data.list; // 更新表格数据
    total.value = res.data.total; // 更新总数
  } catch (error) {
    console.error("Failed to fetch table data:", error);
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
