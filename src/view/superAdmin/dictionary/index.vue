<template>
  <WarningTip title="获取字典且缓存方法已在前端utils/dictionary 已经封装完成 不必自己书写 使用方法查看文件内注释" />
  <div style="margin-top: 15px">
    <el-container>
      <el-aside width="200px" style="margin-top: 10px">
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
      <el-main>
        <div style="display: flex; justify-content: space-between">
          <span style="margin-top: 5px; font-weight: bold">字典详细内容</span>
          <el-button type="primary" size="auto">+ 新增字典项</el-button>
        </div>
        <div>
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            row-key="sort"
            :header-row-style="{
              backgroundColor: '#f5f7fa',
              color: '#000',
              fontSize: '14px',
              fontWeight: 'bold',
            }"
          >
            <el-table-column prop="UpdatedAt" label="日期" min-width="80px">
              <template #default="{ row }">{{ formatDate(row.UpdatedAt) }}</template>
            </el-table-column>
            <el-table-column prop="label" label="展示值" min-width="50px"> </el-table-column>
            <el-table-column prop="sysDictionaryID" label="字典值" min-width="50px"> </el-table-column>
            <el-table-column prop="value" label="扩展值" min-width="50px"> </el-table-column>
            <el-table-column prop="status" label="启用状态" min-width="50px"> </el-table-column>
            <el-table-column prop="value" label="扩展值" min-width="50px"> </el-table-column>
            <el-table-column prop="sort" label="排序" min-width="50px"> </el-table-column>
            <el-table-column prop="action" label="操作" min-width="50px">
              <template #default="scope">
                <el-button type="text" @click="openDicEditDrawer(scope.row)">变更</el-button>
                <el-button type="text" @click="openDicDeleteDrawer(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
          <template v-if="operationDicType === 'addDictionary'">
            <el-button type="primary" @click="handleSubmitAdd">确定</el-button>
          </template>
          <template v-else-if="operationDicType === 'editDictionary'">
            <el-button type="primary" @click="handleSubmitEdit">确定</el-button>
          </template>
        </div>
      </div>
    </template>
    <!-- label-width="100px"保证label长度 -->
    <el-form :model="dicForm" :rules="rulesDic" label-width="100px">
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
} from "@/api/user";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// activeDicIndex.value 实际上对应的是 dictionaryList 中某个字典项的 ID（转换为字符串后的值）
const activeDicIndex = ref(1);
const dicTotal = ref(0);
const page = ref(1);
const pageSize = ref(10);

const tableLoading = ref(false);
const tableData = ref([]);

const drawerDic = ref(false);
const dialogTitle = ref("添加字典");
const operationDicType = ref("addDictionary");

const sysDictionaryDetails = ref([]);
const dictionaryList = ref([]);
const dicForm = ref({
  ID: 0,
  desc: "",
  name: "",
  status: true,
  type: "",
});

// 字典表单规则
const rulesDic = reactive({
  name: [{ required: true, message: "请输入name", trigger: "blur" }],
  type: [{ required: true, message: "请输入type", trigger: "blur" }],
  desc: [{ required: true, message: "请输入描述", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
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
});

// 调用
const fetchtableData = async () => {
  const res = await getSysDictionaryDetailList(page.value, pageSize.value, activeDicIndex.value);
  tableData.value = res.data.list;
};

// 点击菜单更新表格
const handleMenuSelect = async (menuId) => {
  activeDicIndex.value = menuId;
  console.log("activeDicIndex.value", activeDicIndex.value);
  await fetchtableData();
};

// 新增字典
const onAddDic = () => {
  drawerDic.value = true;
  dialogTitle.value = "添加字典";
  operationDicType.value = "addDictionary";
  dicForm.value = {
    ID: 0,
    desc: "",
    name: "",
    status: true,
    type: "",
  };
};

// 新增确定
const handleSubmitAdd = async () => {
  await createSysDictionary({
    ID: dicTotal.value + 1,
    desc: dicForm.value.desc,
    name: dicForm.value.name,
    statue: dicForm.value.status,
    type: dicForm.value.type,
  });
  drawerDic.value = false;
  await fetchDicData();
  if (activeDicIndex.value !== 1) {
    activeDicIndex.value = 1;
    await fetchtableData();
  }
  ElMessage({ type: "success", message: `操作成功` });
};

// 编辑字典
const openDicEditDrawer = async (item) => {
  drawerDic.value = true;
  dialogTitle.value = "修改字典";
  operationDicType.value = "editDictionary";
  dicForm.value.ID = item.ID;
  dicForm.value.desc = item.desc;
  dicForm.value.name = item.name;
  dicForm.value.type = item.type;
  dicForm.value.status = item.status;
  const res = await findSysDictionary(item.ID, item.status);
  // 返回的详细，用作参数
  sysDictionaryDetails.value = res.data.resysDictionary.sysDictionaryDetails;
};

// 编辑字典确定
const handleSubmitEdit = async () => {
  await updateSysDictionary({
    ID: dicForm.value.ID,
    desc: dicForm.value.desc,
    name: dicForm.value.name,
    statue: dicForm.value.status,
    type: dicForm.value.type,
    sysDictionaryDetails: sysDictionaryDetails.value,
  });
  drawerDic.value = false;
  await fetchDicData();
  if (activeDicIndex.value !== 1) {
    activeDicIndex.value = 1;
    await fetchtableData();
  }
  ElMessage({ type: "success", message: `操作成功` });
};

// 删除+确定
const handleDicDelete = async (item) => {
  activeDicIndex.value = item.ID;
  await fetchtableData();
  try {
    await ElMessageBox.confirm("确定删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // 执行删除逻辑
    await deleteSysDictionary({ ID: item.ID });
    await fetchDicData();
    if (activeDicIndex.value !== 1) {
      activeDicIndex.value = 1;
      await fetchtableData();
    } else {
      activeDicIndex.value = 2;
      await fetchtableData();
    }
    ElMessage({
      message: "删除成功!",
      type: "success",
    });
  } catch (error) {
    // 处理取消逻辑
    if (error === "cancel") {
      ElMessage({
        message: "已取消重置!",
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
</script>
<style>
.menu-name {
  max-width: 90px; /* 设置最大宽度 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 使用省略号表示溢出内容 */
  white-space: nowrap; /* 禁止换行 */
}

.menu-item-wrapper {
  display: flex;
  justify-content: space-between; /* 名称左，图标右 */
  align-items: center; /* 垂直居中 */
  background-color: #fcfcfc; /* 设置每个菜单项的背景色 */
  margin: 5px 0; /* 设置菜单项之间的置菜单项背景颜色 */
}

.menu-actions {
  display: flex;
  flex-direction: row; /* 水平排列图标 */
  gap: 0px; /* 图标间距 */
}
</style>
