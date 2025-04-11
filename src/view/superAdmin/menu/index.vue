<template>
  <!-- <el-drawer> 组件和 <el-button> 之间的关系是通过 v-model 指令来实现的。 -->
  <el-button type="primary" @click="handleClickRootAdd"> + 新增根菜单 </el-button>
  <!-- 表格：外层得加个块级，否则表格底部有个粗的滚动条-->
  <div>
    <el-table :data="menuList" row-key="ID" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <!-- prop 属性用于指定该列所绑定的数据字段。它与表格的 data 属性中的对象属性相对应。 -->
      <el-table-column prop="ID" label="ID" min-width="60" />
      <el-table-column prop="meta.title" label="展示名称" min-width="120" />
      <el-table-column prop="meta.icon" label="图标" min-width="80" />
      <el-table-column prop="name" show-overflow-tooltip label="路由Name" min-width="130" />
      <el-table-column prop="path" show-overflow-tooltip label="路由Path" min-width="130" />
      <el-table-column prop="hidden" label="是否隐藏" min-width="100">
        <template #default="scope">
          <span>{{ scope.row.hidden ? "隐藏" : "显示" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="父节点ID" min-width="90" />
      <el-table-column prop="sort" label="排序" min-width="70" />
      <el-table-column prop="component" label="文件路径" min-width="180" />
      <el-table-column align="left" fixed="right" label="操作" min-width="200">
        <template #default="scope">
          <!-- 添加子菜单 -->
          <authority-table :label="'+ 添加子菜单'" :on-click="() => operateClickAddSub(scope.row)" />
          <!-- 编辑 -->
          <authority-table icon="Edit" label="编辑" :on-click="() => operateClickEdit(scope.row)" />
          <!-- 删除 -->
          <authority-table icon="Delete" label="删除" :on-click="() => operateClickDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 注意层级关系 -->
  <el-drawer v-model="drawerChange" :with-header="true" size="700px">
    <template #header>
      <div class="drawer-header">
        <span>{{ dialogTitle }}</span>
        <div style="display: flex; gap: 0px">
          <el-button @click="drawerChange = false">取消</el-button>
          <el-button
            v-if="operationType === 'addRoot' || operationType === 'addSub'"
            type="primary"
            @click="handleSubmitAdd"
          >
            确定
          </el-button>
          <el-button v-else type="primary" @click="handleSubmitEdit">确定</el-button>
        </div>
      </div>
    </template>
    <WarningTip title="新增菜单，需要在角色管理内配置权限才可使用" />
    <el-form ref="menuFormRef" label-position="top" :model="form" :rules="rules">
      <el-row type="flex" justify="space-between">
        <el-col span="12" style="flex: 1; margin-right: 20px">
          <el-form-item label="文件路径" prop="component">
            <!-- 这里按钮和功能是错位的 -->
            <template v-if="isQuickSelect">
              <MenuCascade />
              <el-button @click="isQuickSelect = false"> 手动输入 </el-button>
            </template>
            <template v-else>
              <el-input
                v-model="form.component"
                placeholder="页面：view/xxx/xx.vue 插件：plugin/xxx/xx.vue"
                style="width: 320px"
              />
              <!-- 默认值是false -->
              <el-button @click="isQuickSelect = true"> 快捷选择 </el-button>
            </template>
            <span style="font-size: xx-small"> 如果菜单包含子菜单，请创建router-view二级路由页面或者 </span>
            <el-button>点我设置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="flex-shrink: 0">
          <el-form-item label="展示名称" prop="meta.title">
            <el-input v-if="operationType === 'edit'" style="width: 200px" v-model="form.meta.title" />
            <el-input v-else-if="operationType === 'addRoot' || operationType === 'addSub'" v-model="form.meta.title" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="8">
          <el-form-item label="路由Name" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item prop="path">
            <!-- 这句样式保证三个框在同一行 -->
            <div class="custom-layout">
              <div>
                <span style="color: red">*</span> 路由Path
                <el-checkbox style="margin-left: 12px; height: auto" v-model="isAddParams"> 添加参数 </el-checkbox>
              </div>
              <el-input v-if="operationType === 'edit'" v-model="form.path" :disabled="!isAddParams" />
              <el-input
                v-else-if="operationType === 'addRoot' || operationType === 'addSub'"
                v-model="form.path"
                :disabled="!isAddParams"
                placeholder="建议只在后方拼接参数"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="是否隐藏" prop="hidden">
            <el-select v-model="form.hidden" style="width: 200px" placeholder="否">
              <el-option :value="false" label="否" />
              <el-option :value="true" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="8">
          <el-form-item label="父节点ID" prop="parentId">
            <el-input
              v-if="operationType === 'addRoot' || operationType === 'addSub' || operationType === 'edit'"
              :value="parentDisplayName"
              disabled
              style="width: 200px"
            />
            <!-- Cascader 组件默认只能直接访问一级属性比如name,meta.title 是嵌套对象 -->
            <el-cascader
              v-else
              v-model="form.parentId"
              :options="menuparentList"
              :props="{ checkStrictly: true, label: 'displayTitle', value: 'ID' }"
              style="width: 200px"
            />
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="图标" prop="meta.icon">
            <menuIcon v-model="form.meta.icon" />
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="排序标记" prop="sort">
            <el-input v-model.number="form.sort" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="8">
          <el-form-item prop="meta.activeName" class="custom-layout">
            <!-- 这里用插槽反而更简洁，少了两层div -->
            <template #label>
              <span>高亮菜单</span>
              <el-tooltip
                content="注：当到达此路由时候，指定左侧菜单指定name会处于活跃状态（亮起），可为空，为空则为本路由Name。"
                placement="top"
                effect="light"
              >
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </template>
            <el-input style="width: 200px" v-model="form.meta.activeName" />
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="KeepAlive" prop="meta.keepAlive">
            <el-select style="width: 200px" v-model="form.meta.keepAlive">
              <el-option :value="false" label="否" />
              <el-option :value="true" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="CloseTab" prop="meta.closeTab">
            <el-select style="width: 200px" v-model="form.meta.closeTab">
              <el-option :value="false" label="否" />
              <el-option :value="true" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item prop="meta.defaultMenu">
            <!-- label 插槽（#label），专门用于自定义标签 -->
            <template #label>
              <span>是否为基础页面</span>
              <el-tooltip content="此项选择为是，则不会展示左侧菜单以及顶部信息。" placement="top" effect="light">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </template>
            <el-select style="width: 200px" v-model="form.meta.defaultMenu">
              <el-option :value="false" label="否" />
              <el-option :value="true" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 写在表单外面 -->
    <div>
      <el-button type="primary" icon="Edit" @click="addParameter(form)">新增菜单参数</el-button>
      <el-table :data="form.parameters" border>
        <el-table-column prop="type" label="参数类型" width="180">
          <template #default="scope">
            <el-select v-model="scope.row.type" placeholder="请选择">
              <el-option value="query" label="query" />
              <el-option value="params" label="params" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="key" label="参数key" width="180">
          <template #default="scope">
            <el-input v-model="scope.row.key" />
          </template>
        </el-table-column>
        <el-table-column prop="value" label="参数值">
          <template #default="scope">
            <el-input v-model="scope.row.value" />
          </template>
        </el-table-column>
        <el-table-column width="100">
          <!-- $index：当前行的索引（从 0 开始的整数），是解构写法，从插槽的上下文对象中提取 $index。
           scope.row：当前行的数据对象-->
          <template #default="scope">
            <el-button type="danger" icon="Delete" @click="deleteParameter(form.parameters, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-button type="primary" icon="edit" @click="addBtn(form)">新增可控按钮</el-button>
      <a href="https://www.gin-vue-admin.com/guide/web/button-auth.html" target="_blank" placement="top" effect="light">
        <el-icon style="color: black"><QuestionFilled /></el-icon>
      </a>
      <el-table :data="form.menuBtn">
        <el-table-column prop="name" label="按钮名称" width="180">
          <template #default="scope">
            <el-input v-model="scope.row.name" />
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="备注" width="180">
          <template #default="scope">
            <el-input v-model="scope.row.desc" />
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <el-button type="danger" icon="delete" @click="deleteBtn(form.menuBtn, scope.$index)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script setup>
import { getMenuList, getBaseMenuById, addBaseMenu, updateBaseMenu, deleteBaseMenu } from "@/api/user";
import { ref, reactive, nextTick, computed } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";

// MenuCascade抽屉的级联选择器
import MenuCascade from "@/components/menuCascade.vue"; //这里用到pathInfo.js文件
import WarningTip from "@/components/WarningTip.vue";
import menuIcon from "@/components/menuIcon.vue";
import authorityTable from "@/components/authorityTable.vue";

const drawerChange = ref(false);
const menuList = ref([]);
const isQuickSelect = ref(false);
const isAddParams = ref(false);
const operationType = ref(""); // "addRoot", "addSub", "edit"
const menuFormRef = ref(null);
const menuparentList = ref([]);

// 适用对象映射
const dialogTitle = computed(
  () =>
    ({
      addRoot: "新增菜单",
      addSub: "新增子菜单",
      edit: "编辑菜单",
    }[operationType.value])
);

// 递归函数，将每一层的 meta.title 转换为 ，如果不用递归就只能访问第一层的meta.title
const normalizeMenu = (item) => {
  const result = {
    ...item,
    displayTitle: item.meta.title, // 添加平级属性
  };
  // 如果有子节点，递归处理
  if (item.children && Array.isArray(item.children)) {
    result.children = item.children.map((child) => normalizeMenu(child));
  }
  return result;
};

getMenuList().then((a) => {
  menuList.value = a.data.map((item) => normalizeMenu(item));
  // 这里不用push，会改变原数组
  menuparentList.value = [
    {
      ID: 0,
      displayTitle: "根目录",
    },
    ...menuList.value, // 复制原始数据
  ];
});

const form = ref({
  ID: null,
  path: "",
  name: "",
  hidden: false,
  parentId: "",
  component: "",
  meta: {
    activeName: "",
    title: "",
    icon: "",
    defaultMenu: false,
    closeTab: false,
    keepAlive: false,
  },
  parameters: [],
  menuBtn: [],
});

// 表单规则
const rules = reactive({
  name: [{ required: true, message: "请输入路由name", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由path", trigger: "blur" }],
  component: [{ required: true, message: "请输入文件路径", trigger: "blur" }],
  "meta.title": [{ required: true, message: "请输入菜单展示名称", trigger: "blur" }],
});

// 计算父节点展示名称，重置表单不能写在新增按钮点击事件里，否则父节点ID始终是根目录
// 这里计算属性是parentDisplayName，函数手动修改的是form.value.parentId
const parentDisplayName = computed(() => {
  console.log("Computing parentDisplayName - operationType:", operationType.value, "parentId:", form.value.parentId);
  if (operationType.value === "addRoot") {
    return "根目录";
  }
  if (operationType.value === "addSub" || operationType.value === "edit") {
    const parent = menuparentList.value.find((item) => item.ID === form.value.parentId);
    return parent ? parent.displayTitle : "未命名";
  }
  return "未设置";
});

// 新增根菜单按钮
const handleClickRootAdd = async () => {
  operationType.value = "addRoot";
  form.value.parentId = 0; // 明确设置为根目录
  drawerChange.value = true;
  await nextTick(); //等待dom加载
  menuFormRef.value.clearValidate(); // 确保每次都清除之前的校验
};

// 新增根菜单/子菜单确定按钮
const handleSubmitAdd = async () => {
  menuFormRef.value.validate(async (valid) => {
    if (!valid) return; // 验证不通过则停止
    const res = await addBaseMenu(form.value);
    ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
    if (res.code == 0) {
      drawerChange.value = false;
      menuList.value = await getMenuList(); // 等待数据加载
    }
  });
  menuFormRef.value.resetFields(); // 确保每次都有重置表单
};

// 新增子菜单按钮
const operateClickAddSub = async (row) => {
  operationType.value = "addSub";
  drawerChange.value = true;
  form.value.parentId = row.ID; // 直接使用 row.ID 作为父节点
  await nextTick(); //等待 Vue 完成 DOM 更新,组件已挂载（确保抽屉已渲染且表单已挂载）
  menuFormRef.value.clearValidate(); // 确保每次都有清除校验
};

// 操作-编辑(同步慢未解决)
const operateClickEdit = async (row) => {
  drawerChange.value = true; // 首先打开抽屉
  operationType.value = "edit";
  const res = await getBaseMenuById({ id: row.ID });
  // 部分赋值
  form.value = {
    ...res.data.menu, // API返回的数据
    parentId: row.ID, // 保留您需要的parentId值
  };
  await nextTick(); //等待dom加载,确保DOM已反映最新的 form.value，如果写在赋值前，父节点ID每次会先显示残留值
  menuFormRef.value.clearValidate(); // 确保每次都有清除校验
};

// 操作编辑-确定按钮
const handleSubmitEdit = async () => {
  menuFormRef.value.validate(async (valid) => {
    if (!valid) return; // 验证不通过则停止
    const res = await updateBaseMenu(form.value);
    ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
    if (res.code == 0) {
      drawerChange.value = false;
      getMenuList().then((a) => {
        menuList.value = a.data;
      });
    }
  });
  menuFormRef.value.resetFields(); // 确保每次都有重置表单
};

// 操作栏删除按钮 + 确定
const operateClickDelete = async (row) => {
  ElMessageBox.confirm("此操作将永久删除所有角色下该菜单, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteBaseMenu({ ID: row.ID });
      // 注意这里，如果是提示首页删除失败，也会正确提示，嘿嘿嘿好,绅京啊哈哈哈写错了还嘿嘿
      ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
      // 只有删除成功时才刷新列表
      if (res.code === 0) {
        getMenuList();
      }
    })
    .catch(() => {
      ElMessage({ type: "info", message: "已取消删除" });
    });
};

// 抽屉新增菜单参数，数组元素绑定表格
const addParameter = (form) => {
  form.parameters.push({
    type: "query",
    key: "",
    value: "",
  });
};

// 抽屉删除菜单参数，使用 splice 方法从 parameters 数组中删除指定索引的元素。
// scope.$index: 表示当前参数行的索引
const deleteParameter = (parameters, index) => {
  parameters.splice(index, 1);
};

// 抽屉新增可控按钮
const addBtn = (form) => {
  form.menuBtn.push({
    name: "",
    desc: "",
  });
};

// 抽屉删除可控按钮
const deleteBtn = (menuBtn, index) => {
  menuBtn.splice(index, 1);
};
</script>

<style scoped>
.custom-layout {
  display: flex;
  flex-direction: column; /* 垂直排列 */
}
</style>
