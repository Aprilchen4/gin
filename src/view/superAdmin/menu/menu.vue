<template>
  <div>
    <!-- <el-drawer> 组件和 <el-button> 之间的关系是通过 v-model 指令来实现的。 -->
    <el-button type="primary" @click="handleClickRootAdd">
      + 新增根菜单
    </el-button>
    <el-drawer v-model="drawerRootAdd" :with-header="true" size="700px">
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>新增菜单</span>
          <div>
            <el-button @click="drawerRootAdd = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitAdd">
              确定
            </el-button>
          </div>
        </div>
      </template>
      <WarningTip title="新增菜单，需要在角色管理内配置权限才可使用" />
      <el-form label-position="top" :rules="rules" v-model="form">
        <el-row>
          <el-col span="12">
            <el-form-item>
              <div class="custom-layout">
                <div><span style="color: red">*</span> 文件路径</div>
                <div>
                  <MenuCascade />
                  <el-button>手动输入</el-button>
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
            <el-form-item>
              <div class="custom-layout" style="margin-left: 30px">
                <div><span style="color: red">*</span> 展示名称</div>
                <div><el-input autocomplete="off" /></div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item>
              <div class="custom-layout">
                <div><span style="color: red">*</span> 路由Name</div>
                <div><el-input /></div>
              </div>
            </el-form-item>
          </el-col>
          <el-col span="8" style="margin-left: 20px">
            <el-form-item>
              <div class="custom-layout">
                <div>
                  <span style="color: red">*</span> 路由Path
                  <el-checkbox style="margin-left: 12px; height: auto">
                    添加参数
                  </el-checkbox>
                </div>
                <div><el-input placeholder="建议只在后方拼接参数" /></div>
              </div>
            </el-form-item>
          </el-col>
          <el-col span="8" style="margin-left: 20px">
            <el-form-item label="是否隐藏">
              <div class="custom-layout">
                <el-select style="width: 200px">
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item label="父节点ID">
              <el-select
                placeholder="根目录"
                :disabled="!isEdit"
                style="width: 200px"
              />
            </el-form-item>
          </el-col>
          <el-col span="8" style="margin-left: 20px">
            <el-form-item label="图标">
              <div class="custom-layout">
                <menuIcon />
              </div>
            </el-form-item>
          </el-col>
          <el-col span="8" style="margin-left: 20px">
            <el-form-item label="排序标记">
              <div class="custom-layout">
                <el-input />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item>
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
                <el-input style="width: 200px" />
              </div>
            </el-form-item>
          </el-col>
          <el-col span="8" style="margin-left: 20px">
            <el-form-item label="KeepAlive">
              <div class="custom-layout">
                <el-select style="width: 200px">
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col span="8" style="margin-left: 20px">
            <el-form-item label="CloseTab">
              <div class="custom-layout">
                <el-select style="width: 200px">
                  <el-option>是</el-option>
                  <el-option>否</el-option>
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
                <el-select style="width: 200px">
                  <el-option>是</el-option>
                  <el-option>否</el-option>
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
                  <el-option key="query" value="query" label="query" />
                  <el-option key="params" value="params" label="params" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="key"
              label="参数key"
              width="180"
            >
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
              <el-table-column
                align="left"
                prop="name"
                label="备注"
                width="180"
              >
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
      <el-table-column prop="parentId" label="父节点" width="100px" />
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
          <el-drawer
            v-model="drawerRootAddSub"
            :with-header="true"
            size="700px"
          >
            <template #header>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span>新增菜单</span>
                <div>
                  <el-button @click="drawerRootAddSub = false">取消</el-button>
                  <el-button type="primary" @click="handleSubmitAdd">
                    确定
                  </el-button>
                </div>
              </div>
            </template>
          </el-drawer>
          <!-- 编辑 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="operateClickEdit(scope.row)"
          >
            <el-icon><edit /></el-icon>编辑
          </el-button>
          <el-drawer v-model="drawerRootEdit" :with-header="true" size="700px">
            <template #header>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span>编辑菜单</span>
                <div>
                  <el-button @click="drawerRootEdit = false">取消</el-button>
                  <el-button type="primary" @click="handleSubmitAdd">
                    确定
                  </el-button>
                </div>
              </div>
            </template>
          </el-drawer>
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
  </div>
</template>

<script setup>
import { getMenuList } from "@/api/user";
import { ref, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import WarningTip from "@/components/WarningTip.vue";
import MenuCascade from "@/components/menuCascade.vue";
import menuIcon from "@/components/menuIcon.vue";

const drawerRootAdd = ref(false);
const drawerRootAddSub = ref(false);
const drawerRootEdit = ref(false);
const menuList = ref([]);

getMenuList().then((a) => {
  menuList.value = a.data;
  console.log("菜单数据", menuList);
});

const form = ref({
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
});

// 表单规则
const rules = reactive({
  path: [{ required: true, message: "请输入菜单name", trigger: "blur" }],
  component: [{ required: true, message: "请输入文件路径", trigger: "blur" }],
  title: [{ required: true, message: "请输入菜单展示名称", trigger: "blur" }],
});

const handleClickRootAdd = () => {
  drawerRootAdd.value = true;
};

const operateClickAddSub = (row) => {
  drawerRootAddSub.value = true;
  console.log(row);
};

const operateClickEdit = (row) => {
  drawerRootEdit.value = true;
  console.log(row);
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

// 操作栏删除弹窗确定
const operateSubmitDelete = (row) => {
  if (row.ID) {
    console.log("删除中表格内容", menuList);
    menuList.value = menuList.value.filter((item) => item.ID !== row.ID);
    // 清空输入框
    form.value.ID = "";
    form.value.name = "";
  } else {
    alert("请输入角色ID以删除角色");
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
