<template>
  <WarningTip title="获取字典且缓存方法已在前端utils/dictionary 已经封装完成 不必自己书写 使用方法查看文件内注释" />
  <!-- 需要外层div，否则字典表格有粗的滚动条 -->
  <div class="dic-main">
    <el-container>
      <el-aside>
        <div class="dictionary-header">
          <span class="dictionary-title">字典列表</span>
          <el-button type="primary" @click="onAddDic">新增</el-button>
        </div>
        <!--  height="300px"这么写会有一个粗的外层滚动条
          :height 属性绑定到一个动态的 Vue 数据属性或计算属性 -->
        <el-scrollbar :height="300">
          <!-- activeDicIndex.value 实际上对应的是 dictionaryList 中某个字典项的 ID（转换为字符串后的值）
           index 属性绑定了字符串 item.ID.toString()，用于标识菜单项的活跃状态，而key 管理 DOM 的更新，
           当 activeDicIndex 的值与某个菜单项的 index 属性值（即 item.ID 的字符串形式）相等时，该菜单项会显示为选中状态。 -->
          <!-- handleMenuSelect(index)错，正确的绑定方式是直接让 handleMenuSelect 接收这个值，而不是手动传入 index（因为 index 在模板中未定义）。 -->
          <el-menu mode="vertical" :default-active="activeDicIndex" @select="handleMenuSelect">
            <el-menu-item
              v-for="item in dictionaryList"
              :key="item.ID"
              :index="item.ID.toString()"
              class="menu-item-wrapper"
            >
              <span class="menu-name">{{ item.name }}</span>
              <div class="menu-actions">
                <el-icon class="edit-icon" @click.stop="openDicEditDrawer(item)"><edit /></el-icon>
                <el-icon class="delete-icon" @click.stop="handleDicDelete(item)"><delete /></el-icon>
              </div>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <!-- 表格 -->
      <el-main style="margin-left: 15px; margin-right: 15px">
        <div class="dictionary-header">
          <span class="table-title">字典详细内容</span>
          <el-button type="primary" @click="OnClickAddDetails"> + 新增字典项 </el-button>
        </div>
        <el-table v-loading="tableLoading" :data="tableData" row-key="sort">
          <el-table-column type="selection" min-width="20" />
          <el-table-column prop="UpdatedAt" label="日期" min-width="60px">
            <template #default="{ row }">{{ formatDate(row.UpdatedAt) }}</template>
          </el-table-column>
          <el-table-column prop="label" label="展示值" min-width="50px" />
          <el-table-column prop="value" label="字典值" min-width="50px" />
          <el-table-column prop="status" label="启用状态" min-width="50px" />
          <el-table-column prop="extend" label="扩展值" min-width="50px" />
          <el-table-column prop="sort" label="排序" min-width="50px" />
          <el-table-column label="操作" min-width="50px">
            <template #default="scope">
              <el-button link type="primary" @click="handleDetailEdit(scope.row)">变更</el-button>
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
          :total="tableTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-main>
    </el-container>
  </div>
  <!-- 字典抽屉 -->
  <el-drawer v-model="drawerDic" :with-header="true" size="700px">
    <template #header>
      <div class="drawer-header">
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
    <!-- label-width="100px"保证label长度，不换行-->
    <el-form ref="dicFormRef" :model="dicForm" :rules="rulesDic" label-width="100px">
      <el-form-item label="字典名(中)" prop="name">
        <el-input v-model="dicForm.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="字典名(英)" prop="type">
        <el-input v-model="dicForm.type" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <span>停用</span>
        <el-switch v-model="dicForm.status" class="switch-dic" />
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
      <div class="drawer-header">
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
        <el-switch v-model="tableForm.status" class="switch-dic" />
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
const activeDicIndex = ref("1");
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
const operationDicType = ref("addDictionary");
const operationTableType = ref("addDetails");
const sysDictionaryDetails = ref([]);
const dictionaryList = ref([]);

const dialogTitle = computed(() => {
  return operationDicType.value === "addDictionary" ? "添加字典" : "编辑字典";
});

const tableDrawerTitle = computed(() => {
  return operationTableType.value === "addDetails" ? "添加字典项" : "编辑字典项";
});

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

// 点击菜单更新表格,
// @select 事件传递的是 :index 字符串（例如 "1"），但 handleMenuSelect 错误地假设参数是 item 对象，导致 item.ID 为 undefined。
const handleMenuSelect = async (index) => {
  activeDicIndex.value = index;
  await fetchtableData();
};

// 新增字典
const onAddDic = async () => {
  drawerDic.value = true;
  operationDicType.value = "addDictionary";
  await nextTick();
  dicFormRef.value.resetFields();
  dicFormRef.value.clearValidate(); //清空之前的验证提示
  // 重置时,注意这里，dicFormRef是表单实例（Element Plus 表单专用）搭配使用 await nextTick();
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
    ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
    if (res.code == 0) {
      drawerDic.value = false;
      await fetchDicData();
      if (activeDicIndex.value !== 1) {
        activeDicIndex.value = 1;
        await fetchtableData();
      }
    }
  });
  dicFormRef.value.resetFields(); // 这会重置为表单初始值
};

// 编辑字典
const openDicEditDrawer = async (item) => {
  drawerDic.value = true;
  operationDicType.value = "editDictionary";
  await nextTick();
  dicFormRef.value.clearValidate();
  dicForm.value = item; // ref定义整体赋值
  const res = await findSysDictionary(item.ID, item.status); // 返回的相应数据，用作参数
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
    ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
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
      const res = await deleteSysDictionary({ ID: item.ID }); // 执行删除逻辑
      ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
      activeDicIndex.value = activeDicIndex.value !== 1 ? 1 : 2;
      if (res.code == 0) {
        await fetchDicData();
        await fetchtableData();
      }
    })
    .catch(() => {
      ElMessage({ type: "info", message: "已取消删除" }); // 用户取消删除操作
    });
};

// 新增字典项
const OnClickAddDetails = async () => {
  drawerTable.value = true;
  operationTableType.value = "addDetails";
  await nextTick();
  tableFormRef.value.resetFields();
  tableFormRef.value.clearValidate();
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
    ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
    if (res.code == 0) {
      drawerTable.value = false;
      await fetchtableData();
    }
  });
  tableFormRef.value.resetFields();
};

// 表格变更
const handleDetailEdit = async (item) => {
  drawerTable.value = true;
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
      ID: tableForm.value.ID,
      label: tableForm.value.label,
      sort: tableForm.value.sort,
      status: tableForm.value.status,
      sysDictionaryID: activeDicIndex.value,
      value: tableForm.value.value,
      extend: tableForm.value.extend,
    });
    ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
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
      ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
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
</script>

<style scoped>
/* 激活菜单项样式 */
.el-menu-item.is-active {
  background-color: var(--menu-bg) !important; /* 菜单项背景色 */
  color: var(--primary-color) !important; /* 菜单项文字颜色 */
}

.menu-item-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
}

.menu-actions {
  display: flex !important;
  flex-direction: row !important;
  gap: 8px !important; /* 关键：添加间距,否则图标会重叠*/
  align-items: center; /* 垂直居中 */
}

.menu-actions .el-icon {
  position: static !important;
  width: 16px !important;
  height: 16px !important;
}

.edit-icon {
  color: rgb(0, 174, 255) !important;
}

.delete-icon {
  color: red !important;
  background-color: var(--bg-color) !important;
}

.menu-name {
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-aside {
  margin-top: 10px; /* 组件特有间距 */
}

.dic-main {
  margin-top: 15px;
}

.dictionary-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 垂直居中 */
  margin-bottom: 16px; /* 添加底部间距 */
}

.dictionary-title {
  font-weight: 600; /* 使用600替代bold更现代 */
  font-size: 16px; /* 明确字号 */
  color: var(--el-text-color-primary); /* 使用Element Plus变量 */
}

.table-title {
  font-weight: bold;
  margin-top: 5px;
}

.switch-dic {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
