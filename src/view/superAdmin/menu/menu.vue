<template>
  <div>
    <!-- <el-drawer> 组件和 <el-button> 之间的关系是通过 v-model 指令来实现的。 -->
    <el-button type="primary" @click="handleClickRootAdd">
      + 新增根菜单
    </el-button>
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
      <el-table-column prop="parentId" label="父节点ID" width="100px" />
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
          <!-- 编辑 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="operateClickEdit(scope.row)"
          >
            <el-icon><edit /></el-icon>编辑
          </el-button>
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
    <!-- 注意层级关系 -->
  </div>
  <el-drawer v-model="drawerChange" :with-header="true" size="700px">
    <template #header>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <span>{{ dialogTitle }}</span>
        <div>
          <el-button @click="drawerChange = false">取消</el-button>
          <div v-if="operationType === 'addRoot' || operationType === 'addSub'">
            <el-button type="primary" @click="handleSubmitAdd">
              确定
            </el-button>
          </div>
          <div v-else-if="operationType === 'edit'">
            <el-button type="primary" @click="handleSubmitEdit">
              确定
            </el-button>
          </div>
        </div>
      </div>
    </template>
    <WarningTip title="新增菜单，需要在角色管理内配置权限才可使用" />
    <el-form label-position="top" :rules="rules" :model="form">
      <el-row>
        <el-col span="12">
          <el-form-item prop="component">
            <div class="custom-layout">
              <div><span style="color: red">*</span> 文件路径</div>
              <div>
                <template v-if="mode === '快捷选择'">
                  <MenuCascade />
                  <el-button @click="switchMode('手动输入')">
                    手动输入
                  </el-button>
                </template>
                <template v-else>
                  <el-input
                    v-model="form.component"
                    placeholder="页面：view/xxx/xx.vue 插件：plugin/xxx/xx.vue"
                    style="width: 320px"
                  />
                  <el-button @click="switchMode('快捷选择')">
                    快捷选择
                  </el-button>
                </template>
              </div>
              <div>
                <span style="font-size: xx-small">
                  如果菜单包含子菜单，请创建router-view二级路由页面或者
                </span>
                <el-button>点我设置</el-button>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="meta.title">
            <div class="custom-layout" style="margin-left: 30px">
              <div><span style="color: red">*</span> 展示名称</div>
              <div v-if="operationType === 'edit'" style="width: 200px">
                <el-input v-model="form.meta.title" />
              </div>
              <div
                v-else-if="
                  operationType === 'addRoot' || operationType === 'addSub'
                "
              >
                <el-input v-model="form.meta.title" />
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="8">
          <el-form-item prop="name">
            <div class="custom-layout">
              <div><span style="color: red">*</span> 路由Name</div>
              <el-input v-model="form.name" />
            </div>
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item prop="path">
            <div class="custom-layout">
              <div>
                <span style="color: red">*</span> 路由Path
                <el-checkbox
                  style="margin-left: 12px; height: auto"
                  v-model="isAddParams"
                >
                  添加参数
                </el-checkbox>
              </div>
              <div>
                <div v-if="operationType === 'edit'">
                  <el-input v-model="form.path" :disabled="!isAddParams" />
                </div>
                <div
                  v-else-if="
                    operationType === 'addRoot' || operationType === 'addSub'
                  "
                >
                  <el-input
                    v-model="form.path"
                    :disabled="!isAddParams"
                    placeholder="建议只在后方拼接参数"
                  />
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="是否隐藏" prop="hidden">
            <div class="custom-layout">
              <el-select
                v-model="form.hidden"
                style="width: 200px"
                placeholder="否"
              >
                <el-option :value="false" label="否" />
                <el-option :value="true" label="是" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="8">
          <el-form-item label="父节点ID" prop="parentId">
            <div v-if="operationType === 'addRoot'" style="width: 200px">
              <el-input v-model="rootDisplay" disabled />
            </div>
            <div v-else-if="operationType === 'addSub'" style="width: 200px">
              <el-input v-model="subDisplay" disabled />
            </div>
            <div
              v-else-if="operationType === 'edit' && form.parentId === 0"
              style="width: 200px"
            >
              <el-input v-model="rootDisplay" />
            </div>
            <el-cascader
              v-else
              v-model="form.parentId"
              :options="menuParentList"
              :props="{ checkStrictly: true, label: 'name', value: 'ID' }"
              style="width: 200px"
            />
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="图标" prop="meta.icon">
            <div class="custom-layout">
              <menuIcon v-model="form.meta.icon" />
            </div>
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="排序标记" prop="sort">
            <div class="custom-layout">
              <el-input v-model.number="form.sort" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="8">
          <el-form-item prop="meta.activeName">
            <div class="custom-layout">
              <div>
                <span> 高亮菜单 </span>
                <el-tooltip
                  content="注：当到达此路由时候，指定左侧菜单指定name会处于活跃状态（亮起），可为空，为空则为本路由Name。"
                  placement="top"
                  effect="light"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <el-input style="width: 200px" v-model="form.meta.activeName" />
            </div>
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="KeepAlive" prop="meta.keepAlive">
            <div class="custom-layout">
              <el-select style="width: 200px" v-model="form.meta.keepAlive">
                <el-option :value="false" label="否" />
                <el-option :value="true" label="是" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="CloseTab" prop="meta.closeTab">
            <div class="custom-layout">
              <el-select style="width: 200px" v-model="form.meta.closeTab">
                <el-option :value="false" label="否" />
                <el-option :value="true" label="是" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item>
            <div class="custom-layout">
              <div>
                <span> 是否为基础页面 </span>
                <el-tooltip
                  content="此项选择为是，则不会展示左侧菜单以及顶部信息。"
                  placement="top"
                  effect="light"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <el-select style="width: 200px" v-model="form.meta.defaultMenu">
                <el-option :value="false" label="否" />
                <el-option :value="true" label="是" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 写在表单外面 -->
    <div>
      <el-button type="primary" icon="edit" @click="addParameter(form)">
        新增菜单参数
      </el-button>
      <!-- 表单行，新增一行的逻辑是 form.parameters新增数据，牛-->
      <div>
        <el-table :data="form.parameters">
          <el-table-column
            align="left"
            prop="type"
            label="参数类型"
            width="180"
          >
            <template #default="scope">
              <el-select v-model="scope.row.type" placeholder="请选择">
                <el-option value="query" label="query" />
                <el-option value="params" label="params" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="key" label="参数key" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.key" />
            </template>
          </el-table-column>
          <el-table-column align="left" prop="value" label="参数值">
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.value" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left">
            <template #default="scope">
              <div>
                <el-button
                  type="danger"
                  icon="delete"
                  @click="deleteParameter(form.parameters, scope.$index)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <div>
        <el-button type="primary" icon="edit" @click="addBtn(form)">
          新增可控按钮
        </el-button>
        <a
          placement="top"
          effect="light"
          target="_blank"
          href="https://www.gin-vue-admin.com/guide/web/button-auth.html"
        >
          <el-icon style="color: black"><QuestionFilled /></el-icon>
        </a>
        <div>
          <el-table :data="form.menuBtn">
            <el-table-column
              align="left"
              prop="name"
              label="按钮名称"
              width="180"
            >
              <template #default="scope">
                <div>
                  <el-input v-model="scope.row.name" />
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="name" label="备注" width="180">
              <template #default="scope">
                <div>
                  <el-input v-model="scope.row.desc" />
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left">
              <template #default="scope">
                <div>
                  <el-button
                    type="danger"
                    icon="delete"
                    @click="deleteBtn(form.menuBtn, scope.$index)"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import {
  getMenuList,
  getBaseMenuById,
  addBaseMenu,
  updateBaseMenu,
  deleteBaseMenu,
} from "@/api/user";
import { ref, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import WarningTip from "@/components/WarningTip.vue";
import MenuCascade from "@/components/menuCascade.vue";
import menuIcon from "@/components/menuIcon.vue";

const drawerChange = ref(false);
const menuList = ref([]);
const menuParentList = ref([]);
const mode = ref("手动输入");
const isAddParams = ref(false);
const dialogTitle = ref("新增菜单");
const isEdit = ref(false);
const operationType = ref(""); // "addRoot", "addSub", "edit"
const rootDisplay = ref("根目录");
const subDisplay = ref("");

const switchMode = (newMode) => {
  mode.value = newMode;
};

// 获取数据
getMenuList().then((a) => {
  menuList.value = a.data;
  console.log("菜单数据格式", menuList.value);

  // 方案1：使用filter直接过滤
  menuParentList.value = a.data.map((item) => {
    let newItem = { ...item }; // 创建对象副本
    delete newItem.children; // 删除children属性
    return newItem;
  });
  console.log("父级菜单数据格式", menuParentList.value);
});

const form = ref({
  ID: 0,
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
  "meta.title": [
    { required: true, message: "请输入菜单展示名称", trigger: "blur" },
  ],
});

// 新增根菜单按钮
const handleClickRootAdd = () => {
  operationType.value = "addRoot";
  drawerChange.value = true;
  dialogTitle.value = "新增菜单";
  form.value = {
    ID: 0,
    path: "",
    name: "",
    hidden: false,
    parentId: 0,
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
  };
  rootDisplay.value = "根目录";
};

// 新增根菜单/子菜单确定按钮
const handleSubmitAdd = async () => {
  try {
    drawerChange.value = false;
    await addBaseMenu(form.value);
    const { data } = await getMenuList(); // 等待数据加载
    menuList.value = data;
    ElMessage.success("添加成功!");
  } catch (error) {
    ElMessage.error(`添加失败: ${error.message}`);
  }
};

// 新增子菜单按钮
const operateClickAddSub = (row) => {
  operationType.value = "addSub";
  isEdit.value = false;
  dialogTitle.value = "新增菜单";
  drawerChange.value = true;
  console.log(row);
  form.value = {
    ID: 0,
    path: "",
    name: "",
    hidden: false,
    parentId: row.ID,
    component: "",
    meta: {
      activeName: "",
      title: "",
      icon: "",
      defaultMenu: false,
      closeTab: false,
      keepAlive: false,
    },
    parameters: [], // 清空数组
    menuBtn: [], // 清空数组
  };
  subDisplay.value = row.meta.title || "未命名";
};

// 操作-编辑
const operateClickEdit = async (row) => {
  operationType.value = "edit";
  const id = row.ID;
  const res = await getBaseMenuById({ id });
  form.value = res.data.menu;
  isEdit.value = true;
  drawerChange.value = true;
  dialogTitle.value = "编辑菜单";
};

// 操作编辑-确定按钮
const handleSubmitEdit = async () => {
  drawerChange.value = false;
  await updateBaseMenu(form.value);
  getMenuList().then((a) => {
    menuList.value = a.data;
  });
  ElMessage({
    message: "编辑成功!",
    type: "success",
  });
};

// 操作栏删除按钮
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

// 操作栏删除弹窗--确定
const operateSubmitDelete = async (row) => {
  if (row.ID) {
    // 1. 先等待删除操作完成
    await deleteBaseMenu({ ID: row.ID });
    // 2. 删除成功后再获取最新数据
    getMenuList().then((a) => {
      menuList.value = a.data;
    });
  } else {
    alert("请输入角色名称以删除角色");
    console.error("请输入角色ID以删除角色");
  }
};

// 抽屉新增菜单参数，对象格式
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
