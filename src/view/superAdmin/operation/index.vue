<template>
  <div>
    <!-- 查询条件 -->
    <el-form v-model="searchForm" inline>
      <el-form-item label="方法">
        <el-input v-model="searchForm.method" placeholder="搜索条件" />
      </el-form-item>
      <el-form-item label="路径">
        <el-input v-model="searchForm.path" placeholder="搜索条件" />
      </el-form-item>
      <el-form-item label="状态码">
        <el-input v-model="searchForm.status" placeholder="搜索条件" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 删除按钮 -->
    <el-button style="margin-top: 20px" @click="handleDelete" :disabled="!tableItems.length">删除</el-button>
    <!-- 表格 -->
    <el-table
      v-loading="tableLoading"
      @selection-change="handleSelectionChange"
      :data="tableData"
      :header-row-style="{
        backgroundColor: '#f5f7fa',
        color: '#000',
        fontSize: '14px',
        fontWeight: 'bold',
      }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="left" label="操作人" width="140">
        <template #default="scope">
          <div>{{ scope.row.user.userName }}({{ scope.row.user.nickName }})</div>
        </template>
      </el-table-column>
      <el-table-column prop="UpdatedAt" label="日期" min-width="100px">
        <template #default="{ row }">{{ formatDate(row.UpdatedAt) }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态码" min-width="60px">
        <template #default="scope">
          <!-- <div> -->
          <el-tag type="success">{{ scope.row.status }}</el-tag>
          <!-- </div> -->
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="请求ip" min-width="70px" />
      <el-table-column prop="method" label="请求方法" min-width="70px" />
      <el-table-column prop="path" label="请求路径" min-width="110px" />
      <el-table-column prop="" label="请求" min-width="40px"> </el-table-column>
      <el-table-column prop="" label="响应" in-width="20px"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="handleDetailDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getSysOperationRecordList, deleteSysOperationRecordByIds, deleteSysOperationRecord } from "@/api/user";
import { ElMessageBox, ElMessage } from "element-plus";

const searchForm = ref({
  method: "",
  path: "",
  status: null,
});

const tableData = ref([]);
const tableItems = ref([]);
const selectedIds = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const params = ref("");
const tableLoading = ref(false);

// 页面函数
getSysOperationRecordList(page.value, pageSize.value, params.value).then((res) => {
  tableData.value = res.data.list;
  total.value = res.data.total;
});

// 调用
const fetchtableData = async () => {
  getSysOperationRecordList(page.value, pageSize.value, params.value).then((res) => {
    tableData.value = res.data.list;
    total.value = res.data.total;
  });
};

// 搜索专用
const fetchOperationRecords = async () => {
  tableLoading.value = true;
  // 拼接字符串params
  if (searchForm.value.method && searchForm.value.method.trim()) {
    params.value += `&method=${searchForm.value.method.trim()}`;
  }
  if (searchForm.value.path && searchForm.value.path.trim()) {
    // if (params.value) params.value += " & "; // 如果前面已经有内容，就加 " & "
    params.value += `&path=${searchForm.value.path.trim()}`;
  }
  if (searchForm.value.status && searchForm.value.status.trim()) {
    // if (params.value) params.value += " & "; // 如果前面已经有内容，就加 " & "
    params.value += `&status=${searchForm.value.status.trim()}`;
  }
  // 调用函数
  const res = await getSysOperationRecordList(page.value, pageSize.value, params.value);
  tableData.value = res.data.list;
  total.value = res.data.total;
  // 否则下次搜索会继续上次的记忆
  params.value = "";
  tableLoading.value = false;
};

// 查询按钮
const handleSearch = () => {
  fetchOperationRecords();
};

// 重置按钮
const handleReset = async () => {
  searchForm.value.method = "";
  searchForm.value.path = "";
  searchForm.value.status = "";
  params.value = "";
  await fetchtableData();
};

// 选中表格点击删除按钮
const handleSelectionChange = async (val) => {
  // 选中的数组元素
  tableItems.value = val;
  // 提取所有元素的ID
  selectedIds.value = val.map((item) => item.ID);
};

// 选中删除逻辑
const handleDetailDelete = async (row) => {
  try {
    await ElMessageBox.confirm("确定删除吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteSysOperationRecord({ ids: row.ID });
    // 清空搜索内容
    params.value = "";
    await fetchtableData();
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

// 表格删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm("确定删除吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteSysOperationRecordByIds({ ids: selectedIds.value });
    // 清空搜索内容
    params.value = "";
    await fetchtableData();
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

// 表格日期
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 补零
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 每页条数变化时触发
const handleSizeChange = async (val) => {
  params.value = "";
  pageSize.value = val;
  console.log(`每页 ${val} 条`);
  await fetchtableData();
};

// 当前页码变化时触发
const handleCurrentChange = async (val) => {
  params.value = "";
  page.value = val;
  console.log(`当前页: ${val}`);
  await fetchtableData();
};
</script>
<style>
.mode {
  font-weight: bold;
  font-weight: bold;
  color: rgb(255, 0, 140);
}
</style>
