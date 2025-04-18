<template>
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
  <el-button class="delete-btn" @click="handleDelete" :disabled="!tableItems.length">删除</el-button>
  <el-table v-loading="tableLoading" @selection-change="handleSelectionChange" :data="tableData">
    <el-table-column type="selection" width="55" />
    <!-- align="left"默认是居中对齐 -->
    <el-table-column align="left" label="操作人" width="140">
      <template #default="scope">
        <div>{{ scope.row.user.userName }}({{ scope.row.user.nickName }})</div>
      </template>
    </el-table-column>
    <el-table-column prop="UpdatedAt" label="日期" min-width="100px">
      <template #default="{ row }">{{ formatDate(row.UpdatedAt) }}</template>
    </el-table-column>
    <el-table-column prop="status" label="状态码" min-width="60px">
      <!-- scope 是一个对象，包含了与当前行相关的多种信息，scope.row 是 scope 对象中的一个属性 -->
      <template #default="scope">
        <el-tag type="success">{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="ip" label="请求ip" min-width="70px" />
    <el-table-column prop="method" label="请求方法" min-width="70px" />
    <el-table-column prop="path" label="请求路径" min-width="110px" />
    <el-table-column align="left" label="请求" prop="path" width="80">
      <template #default="scope">
        <el-popover v-if="scope.row.body" placement="left-start" :width="444">
          <div class="popover-box">
            <!-- 使用 <pre> 标签保留 JSON 的原始格式，formatJson方法用于格式化 JSON 数据 -->
            <pre>{{ formatJson(scope.row.body) }}</pre>
          </div>
          <!-- 两个插槽的设计是为了实现 触发元素 和 弹出内容 的分离 -->
          <template #reference>
            <el-icon style="cursor: pointer"><warning /></el-icon>
          </template>
        </el-popover>
        <span v-else>无</span>
      </template>
    </el-table-column>
    <el-table-column align="left" label="响应" prop="path" width="80">
      <!-- <el-table-column> 的默认插槽，用于自定义表格列的渲染内容。 -->
      <template #default="scope">
        <div>
          <el-popover v-if="scope.row.resp" placement="left-start" :width="444">
            <div class="popover-box">
              <!-- 全称是 "preformatted text"（预格式化文本）。它的作用是保留文本的原始格式，包括空格、换行和缩进 -->
              <pre>{{ formatJson(scope.row.resp) }}</pre>
            </div>
            <!-- 是 <el-popover> 组件的 reference 插槽，负责定义弹出框的触发器，即警告图标 -->
            <!-- 是可选的。如果不提供，默认会使用 <el-popover> 的直接子元素作为触发器。 -->
            <template #reference>
              <el-icon style="cursor: pointer"><warning /></el-icon>
            </template>
          </el-popover>
          <span v-else>无</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button link type="primary" @click="handleDetailDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    class="pagination-container"
    v-model:current-page="page"
    v-model:page-size="pageSize"
    :page-sizes="[10, 30, 50, 100]"
    size="small"
    background
    :disabled="disabled"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
  </el-pagination>
</template>

<script setup>
import { getSysOperationRecordList, deleteSysOperationRecordByIds, deleteSysOperationRecord } from "@/api/user";
import { ref, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { formatDate } from "@/utils/formatDate";

const tableData = ref([]);
const tableItems = ref([]);
const selectedIds = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const params = ref("");
const tableLoading = ref(false);

const searchForm = ref({
  method: "",
  path: "",
  status: null,
});

onMounted(() => {
  // 页面函数
  getSysOperationRecordList(page.value, pageSize.value, params.value).then((res) => {
    tableData.value = res.data.list;
    total.value = res.data.total;
  });
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
    params.value += `&path=${searchForm.value.path.trim()}`;
  }
  if (searchForm.value.status && searchForm.value.status.trim()) {
    params.value += `&status=${searchForm.value.status.trim()}`;
  }

  // 调用函数
  const res = await getSysOperationRecordList(page.value, pageSize.value, params.value);
  tableData.value = res.data.list;
  total.value = res.data.total;
  params.value = ""; // 否则下次搜索会继续上次的搜索记忆
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
  tableItems.value = val; // 选中的数组元素
  selectedIds.value = val.map((item) => item.ID); // 提取所有元素的ID
};

// 表格选中删除
const handleDelete = async () => {
  ElMessageBox.confirm("确定删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteSysOperationRecordByIds({ ids: selectedIds.value });
      ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
      if (res.code == 0) {
        await fetchtableData();
      }
    })
    .catch(() => {
      // 处理取消逻辑
      ElMessage({ message: "已取消删除!", type: "info" });
    });
};

// 请求/响应内容格式化
function formatJson(jsonString) {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch (e) {
    console.error("Invalid JSON:", e);
    return jsonString; // 如果不是合法JSON，返回原字符串
  }
}

// 删除逻辑
const handleDetailDelete = async (row) => {
  ElMessageBox.confirm("确定删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteSysOperationRecord({ id: row.ID });
      ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
      if (res.code == 0) {
        await fetchtableData();
      }
    })
    .catch(() => {
      // 处理取消逻辑
      ElMessage({ message: "已取消删除!", type: "info" });
    });
};

// 每页条数变化时触发
const handleSizeChange = async (val) => {
  pageSize.value = val;
  console.log(`每页 ${val} 条`);
  await fetchtableData();
};

// 当前页码变化时触发
const handleCurrentChange = async (val) => {
  page.value = val;
  console.log(`当前页: ${val}`);
  await fetchtableData();
};
</script>
<style>
.delete-btn {
  margin-bottom: 10px;
}
.popover-box {
  background: #112435;
  color: #f08047;
  height: 600px;
  width: 420px;
  overflow: auto;
}
/* 自定义特定浏览器中的滚动条样式 */
.popover-box::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
