<template>
  <WarningTip title="获取字典且缓存方法已在前端utils/dictionary 已经封装完成 不必自己书写 使用方法查看文件内注释" />
  <div style="margin-top: 15px">
    <el-container>
      <!-- 这里el-aside组件写宽度没用，是因为有全局优先级的280px -->
      <el-aside>
        <div style="display: flex; justify-content: space-between">
          <span style="margin-top: 5px; font-weight: bold">字典列表</span>
          <el-button type="primary" size="auto" @click="onAddDic">新增</el-button>
        </div>
        <!--  height="300px"这么写会有一个粗的外层滚动条，很奇怪 -->
        <el-scrollbar style="height: 300px">
          <!-- activeDicIndex.value 实际上对应的是 dictionaryList 中某个字典项的 ID（转换为字符串后的值） -->
          <el-menu mode="vertical" :default-active="activeDicIndex" @select="handleMenuSelect">
            <el-menu-item
              v-for="item in dictionaryList"
              :key="item.ID"
              :index="item.ID ? item.ID.toString() : ''"
              class="menu-item-wrapper"
            >
              <span class="menu-name">{{ item.name }}</span>
              <div class="menu-actions">
                <el-icon style="color: rgb(0, 174, 255)" @click.stop="openDicEditDrawer(item)"><edit /></el-icon>
                <el-icon style="color: red" @click.stop="handleDicDelete(item)"><delete /></el-icon>
              </div>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <!-- 表格 -->
      <el-main style="margin-left: 15px; margin-right: 15px">
        <div style="display: flex; justify-content: space-between">
          <span style="margin-top: 5px; font-weight: bold">字典详细内容</span>
          <el-button type="primary" size="auto" @click="OnClickAddDetails">+ 新增字典项</el-button>
        </div>
        <div>
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            row-key="sort"
            :header-row-style="{
              color: '#000',
              fontSize: '14px',
              fontWeight: 'bold',
            }"
          >
            <el-table-column type="selection" min-width="20" />
            <el-table-column prop="UpdatedAt" label="日期" min-width="60px">
              <template #default="{ row }">{{ formatDate(row.UpdatedAt) }}</template>
            </el-table-column>
            <el-table-column prop="label" label="展示值" min-width="50px"> </el-table-column>
            <el-table-column prop="value" label="字典值" min-width="50px"> </el-table-column>
            <el-table-column prop="status" label="启用状态" min-width="50px"> </el-table-column>
            <el-table-column prop="extend" label="扩展值" min-width="50px"> </el-table-column>
            <el-table-column prop="sort" label="排序" min-width="50px"> </el-table-column>
            <el-table-column label="操作" min-width="50px">
              <template #default="scope">
                <el-button type="text" @click="handleDetailEdit(scope.row)">变更</el-button>
                <el-button type="text" @click="handleDetailDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 10px">
          <el-pagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :page-sizes="[10, 30, 50, 100]"
            size="small"
            background
            :disabled="disabled"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </div>
  <!-- 字典抽屉 -->
  <el-drawer v-model="drawerDic" :with-header="true" size="700px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>{{ dialogTitle }}</span>
        <div>
          <el-button @click="drawerDic = false">取消</el-button>
          <el-button v-if="operationDicType === 'addDictionary'" type="primary" @click="handleSubmitAdd">
            确定
          </el-button>
          <el-button v-else type="primary" @click="handleSubmitEdit">确定</el-button>
        </div>
      </div>
    </template>
    <!-- label-width="100px"保证label长度 -->
    <el-form ref="dicFormRef" :model="dicForm" :rules="rulesDic" label-width="100px">
      <el-form-item label="字典名(中)" prop="name">
        <el-input v-model="dicForm.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="字典名(英)" prop="type">
        <el-input v-model="dicForm.type" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <span>停用</span>
        <el-switch v-model="dicForm.status" style="margin-left: 10px; margin-right: 10px" />
        <span>开启</span>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="dicForm.desc" placeholder="请输入" />
      </el-form-item>
    </el-form>
  </el-drawer>
  <!-- 表格抽屉 -->
  <el-drawer v-model="drawerTable" :with-header="true" size="700px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>{{ tableDrawerTitle }}</span>
        <div>
          <el-button @click="drawerTable = false">取消</el-button>
          <el-button v-if="operationTableType === 'addDetails'" type="primary" @click="handleSubmitAddDetails">
            确定
          </el-button>
          <el-button v-else type="primary" @click="handleSubmitEditDetails">确定</el-button>
        </div>
      </div>
    </template>
    <!-- 表格表单 -->
    <el-form ref="tableFormRef" :model="tableForm" :rules="rulesTable" label-width="100px">
      <el-form-item label="展示值" prop="label">
        <el-input v-model="tableForm.label" placeholder="请输入展示值" />
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input v-model="tableForm.value" placeholder="请输入字典值" />
      </el-form-item>
      <el-form-item label="扩展值" prop="extend">
        <el-input v-model="tableForm.extend" placeholder="请输入扩展值" />
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <span>停用</span>
        <el-switch v-model="tableForm.status" style="margin-left: 10px; margin-right: 10px" />
        <span>开启</span>
      </el-form-item>
      <el-form-item label="排序标记" prop="sort">
        <el-input-number v-model.number="tableForm.sort" placeholder="排序标记" />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import WarningTip from "@/components/WarningTip.vue";
import {
  getSysDictionaryDetailList,
  getSysDictionaryList,
  createSysDictionary,
  findSysDictionary,
  updateSysDictionary,
  deleteSysDictionary,
  createSysDictionaryDetail,
  findSysDictionaryDetail,
  updateSysDictionaryDetail,
  deleteSysDictionaryDetail,
} from "@/api/user";
import { ref, reactive, nextTick, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
// 注意这里用.是不行的，表示相对路径，即当前文件所在目录下的 utils/formatDate
// @ 通常被定义为项目中某个特定目录的别名（例如 src 目录）。
import { formatDate } from "@/utils/formatDate";

// activeDicIndex.value 实际上对应的是 dictionaryList 中某个字典项的 ID（转换为字符串后的值）
const activeDicIndex = ref(1);
const dicTotal = ref(0);
const tableTotal = ref(0);
const page = ref(1);
const pageSize = ref(10);

const tableLoading = ref(false);
const tableData = ref([]);
const dicFormRef = ref(null);
const tableFormRef = ref(null);

const drawerDic = ref(false);
const drawerTable = ref(false);
// const dialogTitle = ref("添加字典");
// const tableDrawerTitle = ref("添加字典项");
const operationDicType = ref("addDictionary");
const operationTableType = ref("addDetails");

const dialogTitle = computed(() => {
  return operationDicType.value === "addDictionary" ? "添加字典" : "编辑字典";
});

const tableDrawerTitle = computed(() => {
  return operationTableType.value === "addDetails" ? "添加字典项" : "编辑字典项";
});
const sysDictionaryDetails = ref([]);
const dictionaryList = ref([]);
const dicForm = ref({
  ID: null,
  desc: "",
  name: "",
  status: true,
  type: "",
});

// 表格抽屉，这里不想写数字，可以写null
const tableForm = ref({
  ID: null,
  label: "",
  sort: null,
  status: true,
  sysDictionaryID: null,
  value: "",
  extend: "",
  UpdateAt: "",
});

// 字典表单规则
const rulesDic = reactive({
  name: [{ required: true, message: "请输入name", trigger: "blur" }],
  type: [{ required: true, message: "请输入type", trigger: "blur" }],
  desc: [{ required: true, message: "请输入type", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

// 表格表单规则
const rulesTable = reactive({
  label: [{ required: true, message: "请输入展示值", trigger: "blur" }],
  value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
  status: [{ required: true, message: "请输入", trigger: "blur" }],
  sort: [{ required: true, message: "请输入排序标记", trigger: "blur" }],
});

// 点进页面
getSysDictionaryList().then((res) => {
  dictionaryList.value = res.data;
  dicTotal.value = dictionaryList.value.length;
});

// 调用
const fetchDicData = async () => {
  getSysDictionaryList().then((res) => {
    dictionaryList.value = res.data;
    dicTotal.value = dictionaryList.value.length;
  });
};

// 点进页面
getSysDictionaryDetailList(1, 10, 1).then((res) => {
  tableData.value = res.data.list;
  tableTotal.value = res.data.list.length;
});

// 调用
const fetchtableData = async () => {
  const res = await getSysDictionaryDetailList(page.value, pageSize.value, activeDicIndex.value);
  tableData.value = res.data.list;
  tableTotal.value = res.data.list.length;
};

// 点击菜单更新表格
const handleMenuSelect = async (menuId) => {
  activeDicIndex.value = menuId;
  console.log("activeDicIndex.value", activeDicIndex.value);
  await fetchtableData();
};

// 新增字典
const onAddDic = async () => {
  drawerDic.value = true;
  // dialogTitle.value = "添加字典";
  operationDicType.value = "addDictionary";
  await nextTick();
  dicFormRef.value.clearValidate();
  // 重置时,注意这里，dicFormRef是表单实例（Element Plus 表单专用）
  // 用表单实例时需要搭配使用nextTick()
  // await nextTick();
  dicFormRef.value.resetFields(); // 这会重置为表单初始值
};

// 新增确定
const handleSubmitAdd = async () => {
  dicFormRef.value.validate(async (valid) => {
    if (!valid) return; // 验证不通过则停止
    const res = await createSysDictionary({
      ID: dicTotal.value + 1,
      desc: dicForm.value.desc,
      name: dicForm.value.name,
      statue: dicForm.value.status,
      type: dicForm.value.type,
    });
    const type = res.code == 0 ? "success" : "error";
    ElMessage({ type: type, message: res.msg });
    if (res.code == 0) {
      drawerDic.value = false;
      await fetchDicData();
      if (activeDicIndex.value !== 1) {
        activeDicIndex.value = 1;
        await fetchtableData();
      }
    }
  });
};

// 编辑字典
const openDicEditDrawer = async (item) => {
  drawerDic.value = true;
  // dialogTitle.value = "修改字典";
  operationDicType.value = "editDictionary";
  await nextTick();
  dicFormRef.value.clearValidate();
  // 整体赋值
  dicForm.value = item;
  const res = await findSysDictionary(item.ID, item.status);
  // 返回的详细，用作参数
  sysDictionaryDetails.value = res.data.resysDictionary.sysDictionaryDetails;
};

// 编辑字典确定
const handleSubmitEdit = async () => {
  dicFormRef.value.validate(async (valid) => {
    if (!valid) return; // 验证不通过则停止
    const res = await updateSysDictionary({
      ID: dicForm.value.ID,
      desc: dicForm.value.desc,
      name: dicForm.value.name,
      statue: dicForm.value.status,
      type: dicForm.value.type,
      sysDictionaryDetails: sysDictionaryDetails.value,
    });
    const type = res.code == 0 ? "success" : "error";
    ElMessage({ type: type, message: res.msg });
    if (res.code == 0) {
      drawerDic.value = false;
      await fetchDicData();
      if (activeDicIndex.value !== 1) {
        activeDicIndex.value = 1;
        await fetchtableData();
      }
    }
  });
};

// 字典删除+确定,这里没有取消逻辑，程序会报错
const handleDicDelete = async (item) => {
  activeDicIndex.value = item.ID;
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      // 执行删除逻辑
      const res = await deleteSysDictionary({ ID: item.ID });
      const type = res.code == 0 ? "success" : "error";
      ElMessage({ type: type, message: res.msg });
      // 三元运算符
      activeDicIndex.value = activeDicIndex.value !== 1 ? 1 : 2;
      if (res.code == 0) {
        await fetchDicData();
        await fetchtableData();
      }
    })
    .catch(() => {
      // 用户取消删除操作
      ElMessage({ type: "info", message: "已取消删除" });
    });
};

// 新增字典项
const OnClickAddDetails = async () => {
  drawerTable.value = true;
  // tableDrawerTitle.value = "添加字典项";
  operationTableType.value = "addDetails";
  await nextTick();
  tableFormRef.value.clearValidate();
  tableFormRef.value.resetFields();
};

// 新增字典项确定按钮
const handleSubmitAddDetails = async () => {
  await tableFormRef.value.validate(async (valid) => {
    if (!valid) return; // 验证不通过则停止，注意这里和下面的是并列的，后续不可运行
    const res = await createSysDictionaryDetail({
      label: tableForm.value.label,
      sort: tableForm.value.sort,
      status: tableForm.value.status,
      sysDictionaryID: activeDicIndex.value,
      value: tableForm.value.value,
      extend: tableForm.value.extend,
    });
    const type = res.code == 0 ? "success" : "error";
    ElMessage({ type: type, message: res.msg });
    if (res.code == 0) {
      drawerTable.value = false;
      await fetchtableData();
    }
  });
};

// 表格变更
const handleDetailEdit = async (item) => {
  drawerTable.value = true;
  // tableDrawerTitle.value = "修改字典项";
  operationTableType.value = "editDetails";
  await nextTick();
  tableFormRef.value.clearValidate();
  // 赋值,这里是表单对象。ref定义可以整体赋值
  tableForm.value = item;
  await findSysDictionaryDetail(item.ID);
};

// 表格变更确定
const handleSubmitEditDetails = async () => {
  await tableFormRef.value.validate(async (valid) => {
    if (!valid) return; // 验证不通过则停止，注意这里和下面的是并列的，后续不可运行
    const res = await updateSysDictionaryDetail({
      ID: tableData.value.ID,
      label: tableForm.value.label,
      sort: tableForm.value.sort,
      status: tableForm.value.status,
      sysDictionaryID: activeDicIndex.value,
      value: tableForm.value.value,
      extend: tableForm.value.extend,
    });
    const type = res.code == 0 ? "success" : "error";
    ElMessage({ type: type, message: res.msg });
    if (res.code == 0) {
      drawerTable.value = false;
      await fetchtableData();
    }
  });
};

// 表格删除+确定,这里写了取消逻辑，不会报错
const handleDetailDelete = async (item) => {
  // 同步，无需await
  ElMessageBox.confirm("确定删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      // 执行删除逻辑
      const res = await deleteSysDictionaryDetail({ ID: item.ID });
      // 三元运算符+消息提示
      const type = res.code == 0 ? "success" : "error";
      ElMessage({ message: res.msg, type: type });
      if (res.code == 0) {
        await fetchtableData();
      }
    })
    .catch(() => {
      ElMessage({ type: "info", message: " 已取消删除" });
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

// 新增字典项
</script>
<style scoped>
/* 白天/黑夜主题变量 */
:root {
  --sidebar-bg: #ffffff;
  --bg-color: #ffffff;
  --text-color: #333333;
}

[data-theme="dark"] {
  --sidebar-bg: #1a1a1a;
  --bg-color: #121212;
  --text-color: #ffffff;
}

/* 暗黑模式菜单覆盖（全局生效） */
[data-theme="dark"] .el-menu {
  background-color: var(--sidebar-bg) !important;
  border-right: none !important;
}

[data-theme="dark"] .el-menu-item {
  background-color: var(--sidebar-bg) !important;
  color: var(--text-color) !important;
}

[data-theme="dark"] .el-menu-item:hover {
  background-color: var(--bg-color) !important;
}

[data-theme="dark"] .menu-item-wrapper {
  background-color: var(--sidebar-bg) !important;
}

/* 原有组件样式，el-aside组件写宽度没用，是因为有全局优先级的280px */
.el-aside {
  width: 190px !important;
  margin-top: 10px;
}

.menu-name {
  max-width: 90px; /* 设置最大宽度 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 使用省略号表示溢出内容 */
  white-space: nowrap; /* 禁止换行 */
}

/* 用于包裹每一个菜单项的内容，规定宽度会限制内容布局 */
.menu-item-wrapper {
  display: flex;
  justify-content: space-between; /* 名称左，图标右 */
  align-items: center; /* 垂直居中 */
  /* background-color: #fcfcfc; 设置每个菜单项的背景色，写死的背景色，暗黑模式下仍是灰色 */
  margin: 5px 0; /* 设置菜单项之间的置菜单项背景颜色 */
}

.menu-actions {
  display: flex;
  flex-direction: row; /* 水平排列图标 */
  gap: 0px; /* 图标间距 */
}
</style>
