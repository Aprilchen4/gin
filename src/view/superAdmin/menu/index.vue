<template>
  <div>
    <!-- <el-drawer> 组件和 <el-button> 之间的关系是通过 v-model 指令来实现的。 -->
    <el-button type="primary" @click="handleClickRootAdd"> + 新增根菜单 </el-button>
  </div>
  <!-- 表格 -->
  <div>
    <el-table
      :data="menuList"
      style="width: 100%; margin-top: 10px; margin-right: 30px"
      row-key="ID"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :header-row-style="{
        color: '#000',
        fontWeight: 'bold',
      }"
    >
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
          <el-button link type="primary" size="small" @click="operateClickAddSub(scope.row)"> + 添加子菜单 </el-button>
          <!-- 编辑 -->
          <el-button link type="primary" size="small" @click="operateClickEdit(scope.row)">
            <el-icon><edit /></el-icon>编辑
          </el-button>
          <!-- 删除 -->
          <el-button link type="primary" size="small" @click="operateClickDelete(scope.row)">
            <el-icon><delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 注意层级关系 -->
  </div>
  <el-drawer v-model="drawerChange" :with-header="true" size="700px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
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
    <el-form ref="menuFormRef" label-position="top" :rules="rules" :model="form">
      <el-row>
        <el-col span="12">
          <el-form-item prop="component">
            <div class="custom-layout">
              <div><span style="color: red">*</span> 文件路径</div>
              <div>
                <template v-if="mode === '快捷选择'">
                  <MenuCascade />
                  <el-button @click="switchMode('手动输入')"> 手动输入 </el-button>
                </template>
                <template v-else>
                  <el-input
                    v-model="form.component"
                    placeholder="页面：view/xxx/xx.vue 插件：plugin/xxx/xx.vue"
                    style="width: 320px"
                  />
                  <el-button @click="switchMode('快捷选择')"> 快捷选择 </el-button>
                </template>
              </div>
              <div>
                <span style="font-size: xx-small"> 如果菜单包含子菜单，请创建router-view二级路由页面或者 </span>
                <el-button>点我设置</el-button>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="meta.title">
            <div class="custom-layout" style="margin-left: 30px">
              <div><span style="color: red">*</span> 展示名称</div>
              <el-input v-if="operationType === 'edit'" style="width: 200px" v-model="form.meta.title" />
              <el-input
                v-else-if="operationType === 'addRoot' || operationType === 'addSub'"
                v-model="form.meta.title"
              />
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
                <el-checkbox style="margin-left: 12px; height: auto" v-model="isAddParams"> 添加参数 </el-checkbox>
              </div>
              <div>
                <el-input v-if="operationType === 'edit'" v-model="form.path" :disabled="!isAddParams" />
                <el-input
                  v-else-if="operationType === 'addRoot' || operationType === 'addSub'"
                  v-model="form.path"
                  :disabled="!isAddParams"
                  placeholder="建议只在后方拼接参数"
                />
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col span="8" style="margin-left: 20px">
          <el-form-item label="是否隐藏" prop="hidden">
            <div class="custom-layout">
              <el-select v-model="form.hidden" style="width: 200px" placeholder="否">
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
            <el-input v-if="operationType === 'addRoot'" style="width: 200px" v-model="rootDisplay" disabled />
            <el-input v-else-if="operationType === 'addSub'" style="width: 200px" v-model="subDisplay" disabled />
            <el-input
              v-else-if="operationType === 'edit' && form.parentId === 0"
              style="width: 200px"
              v-model="rootDisplay"
            />

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
                <el-tooltip content="此项选择为是，则不会展示左侧菜单以及顶部信息。" placement="top" effect="light">
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
      <el-button type="primary" icon="edit" @click="addParameter(form)"> 新增菜单参数 </el-button>
      <!-- 表单行，新增一行的逻辑是 form.parameters新增数据，牛-->
      <div>
        <el-table :data="form.parameters">
          <el-table-column align="left" prop="type" label="参数类型" width="180">
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
                <el-button type="danger" icon="delete" @click="deleteParameter(form.parameters, scope.$index)">
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
        <el-button type="primary" icon="edit" @click="addBtn(form)"> 新增可控按钮 </el-button>
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
            <el-table-column align="left" prop="name" label="按钮名称" width="180">
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
                  <el-button type="danger" icon="delete" @click="deleteBtn(form.menuBtn, scope.$index)">
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
import { getMenuList, getBaseMenuById, addBaseMenu, updateBaseMenu, deleteBaseMenu } from "@/api/user";
import { ref, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import WarningTip from "@/components/WarningTip.vue";
// MenuCascade抽屉的级联选择器
import MenuCascade from "@/components/menuCascade.vue"; //这里用到pathInfo.js文件
import menuIcon from "@/components/menuIcon.vue";
import { nextTick, computed } from "vue";

const drawerChange = ref(false);
const menuList = ref([]);
const menuParentList = ref([]);
const mode = ref("手动输入");
const isAddParams = ref(false);
// const dialogTitle = ref("新增菜单");
const isEdit = ref(false);
const rootDisplay = ref("根目录");
const subDisplay = ref("");
const operationType = ref(""); // "addRoot", "addSub", "edit"
// 适用对象映射
const dialogTitle = computed(
  () =>
    ({
      addRoot: "新增菜单",
      addSub: "新增子菜单",
      edit: "编辑菜单",
    }[operationType.value])
);

const menuFormRef = ref(null);

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

// 新增根菜单按钮
const handleClickRootAdd = async () => {
  operationType.value = "addRoot";
  rootDisplay.value = "根目录"; //父节点
  drawerChange.value = true;
  // dialogTitle.value = "新增菜单";
  await nextTick(); //等待dom加载
  menuFormRef.value.clearValidate(); // 确保每次都有清除校验
  // 重置表单
  menuFormRef.value.resetFields(); // 确保每次都有重置表单
};

// 新增根菜单/子菜单确定按钮
const handleSubmitAdd = async () => {
  menuFormRef.value.validate(async (valid) => {
    if (!valid) return; // 验证不通过则停止
    const res = await addBaseMenu(form.value);
    const type = res.code == 0 ? "success" : "error";
    ElMessage({ message: res.msg, type: type });
    if (res.code == 0) {
      drawerChange.value = false;
      menuList.value = await getMenuList(); // 等待数据加载
    }
  });
};

// 新增子菜单按钮
const operateClickAddSub = async (row) => {
  operationType.value = "addSub";
  isEdit.value = false;
  // dialogTitle.value = "新增菜单";
  drawerChange.value = true;
  subDisplay.value = row.meta.title || "未命名"; //父节点ID
  await nextTick(); //等待 Vue 完成 DOM 更新,组件已挂载（确保抽屉已渲染且表单已挂载）
  menuFormRef.value.clearValidate(); // 确保每次都有清除校验
  // 重置表单
  menuFormRef.value.resetFields(); // 确保每次都有重置表单
};

// 操作-编辑
const operateClickEdit = async (row) => {
  drawerChange.value = true; // 首先打开抽屉
  operationType.value = "edit";
  // dialogTitle.value = "编辑菜单";
  await nextTick(); //等待dom加载
  menuFormRef.value.clearValidate(); // 确保每次都有清除校验
  const id = row.ID;
  const res = await getBaseMenuById({ id });
  // 整体赋值
  form.value = res.data.menu;
  isEdit.value = true;
};

// 操作编辑-确定按钮
const handleSubmitEdit = async () => {
  menuFormRef.value.validate(async (valid) => {
    if (!valid) return; // 验证不通过则停止
    const res = await updateBaseMenu(form.value);
    const type = res.code == 0 ? "success" : "error";
    ElMessage({ message: res.msg, type: type });
    if (res.code == 0) {
      drawerChange.value = false;
      getMenuList().then((a) => {
        menuList.value = a.data;
      });
    }
  });
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
      // 注意这里，如果是提示首页删除失败，也会正确提示，嘿嘿嘿好
      const type = res.code == 0 ? "success" : "error";
      ElMessage({ type: type, message: res.msg });
      // 只有删除成功时才刷新列表
      if (res.code === 0) {
        getMenuList();
      }
    })
    .catch(() => {
      ElMessage({ type: "info", message: "已取消删除" });
    });
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
