<template>
  <!-- 左上角按钮 -->
  <WarningTip title="注：右上角头像下拉可切换角色" />
  <div style="margin-top: 10px">
    <!-- <el-drawer> 组件和 <el-button> 之间的关系是通过 v-model 指令来实现的。 -->
    <el-button class="buttonBelow" type="primary" @click="handleClickAdd">+ 新增角色</el-button>
    <el-drawer v-model="drawerAdd" :with-header="true" size="700px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>新增角色</span>
          <div>
            <el-button @click="drawerAdd = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitAdd">确定</el-button>
          </div>
        </div>
      </template>
      <el-form ref="addFormRef" :model="form" label-width="80px" :rules="rules">
        <el-form-item prop="parentId">
          <template #label>父级角色</template>
          <el-input placeholder="根角色(严格模式下为当前用户角色)" disabled />
        </el-form-item>
        <el-form-item prop="authorityId">
          <template #label>角色ID</template>
          <el-input v-model="form.authorityId" placeholder="0" />
        </el-form-item>
        <el-form-item prop="authorityName">
          <template #label>角色名称</template>
          <el-input v-model="form.authorityName" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
  <!-- 以上是新增角色按钮 -->
  <!-- 表格 -->
  <el-table
    :data="authorityList"
    style="width: 100%; margin-bottom: 20px"
    row-key="authorityId"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    :header-row-style="{
      backgroundColor: '#f5f7fa',
      color: '#000',
      fontWeight: 'bold',
    }"
  >
    <!-- prop 属性用于指定该列所绑定的数据字段。它与表格的 data 属性中的对象属性相对应。 -->
    <el-table-column prop="authorityId" label="角色ID" min-width="200" />
    <el-table-column prop="authorityName" label="角色名称" min-width="200" />
    <el-table-column label="操作" width="460">
      <template #default="scope">
        <!-- 设置权限 -->
        <el-button link type="primary" size="small" @click="handleClickSetting(scope.row)">
          <el-icon><Setting /></el-icon>设置权限
        </el-button>
        <!-- 新增子角色 -->
        <el-button link type="primary" size="small" @click="handleClickAddSub(scope.row)"> + 新增子角色 </el-button>
        <!-- 拷贝 -->
        <el-button link type="primary" size="small" @click="handleClickCopy(scope.row)">
          <el-icon><CopyDocument /></el-icon>拷贝
        </el-button>
        <!-- 编辑 -->
        <el-button link type="primary" size="small" @click="handleClickEdit(scope.row)">
          <el-icon><Edit /></el-icon>编辑
        </el-button>
        <!-- 删除 -->
        <el-button link type="primary" size="small" @click="handleClickDelete(scope.row)">
          <el-icon><Delete /></el-icon>删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-drawer v-model="drawerSetting" :with-header="true" size="700px" title="角色配置">
    <el-tabs :before-leave="autoEnter" type="border-card" v-model="activeAuthorityTab" @tab-click="tabClickAuthority">
      <el-tab-pane label="角色菜单"><tabReview :authorityForm="form" /></el-tab-pane>
      <el-tab-pane label="角色api"><tabApis :authorityForm="form" /></el-tab-pane>
      <el-tab-pane label="资源权限"><tabResource :authorityForm="form" /></el-tab-pane>
    </el-tabs>
  </el-drawer>
  <el-drawer v-model="drawerAddSub" :with-header="true" size="700px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>新增子角色</span>
        <div>
          <el-button @click="drawerAddSub = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitAdd">确定</el-button>
        </div>
      </div>
    </template>
    <el-form ref="addFormRef" :model="form" label-width="80px" :rules="rules">
      <el-form-item prop="parentId">
        <template #label>父级角色</template>
        <el-input v-model="parentDisplay" disabled />
      </el-form-item>
      <el-form-item prop="authorityId">
        <template #label>角色ID</template>
        <el-input v-model="form.authorityId" placeholder="0" />
      </el-form-item>
      <el-form-item prop="authorityName">
        <template #label>角色名称</template>
        <el-input v-model="form.authorityName" placeholder="请输入角色名称" />
      </el-form-item>
    </el-form>
  </el-drawer>
  <!-- 拷贝抽屉 -->
  <el-drawer v-model="drawerCopy" :with-header="true" size="700px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>拷贝角色</span>
        <div>
          <el-button @click="drawerCopy = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitCopy">确定</el-button>
        </div>
      </div>
    </template>
    <el-form ref="copyFormRef" :model="form" label-width="80px" :rules="rules">
      <el-form-item prop="parentId">
        <template #label><span>父级角色</span></template>
        <el-cascader
          style="width: 580px"
          :options="authorityOption"
          :props="cascaderProps"
          :show-all-levels="false"
          placeholder="根角色(严格模式下为当前用户角色)"
          v-model="form.parentId"
          clearable
        />
      </el-form-item>
      <el-form-item prop="authorityId">
        <template #label>角色ID</template>
        <el-input v-model="form.authorityId" placeholder="请输入角色ID" />
      </el-form-item>
      <el-form-item prop="authorityName">
        <template #label>角色名称</template>
        <el-input v-model="form.authorityName" placeholder="请输入角色名称" />
      </el-form-item>
    </el-form>
  </el-drawer>
  <!-- 编辑抽屉 -->
  <el-drawer v-model="drawerEdit" :with-header="true" size="700px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>编辑角色</span>
        <div>
          <el-button @click="drawerEdit = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitEdit">确定</el-button>
        </div>
      </div>
    </template>
    <el-form ref="editFormRef" :model="form" label-width="80px" :rules="rules">
      <el-form-item prop="parentId">
        <template #label><span>父级角色</span></template>
        <!-- 级联选择器 (el-cascader) 会自动将 v-model 绑定的值转换为数组
          这是因为它需要记录完整的路径选择（从根节点到当前选中节点） -->
        <el-cascader
          style="width: 580px"
          :options="authorityOption"
          :props="cascaderProps"
          :show-all-levels="false"
          placeholder="根角色(严格模式下为当前用户角色)"
          v-model="form.parentId"
          clearable
        />
      </el-form-item>
      <el-form-item prop="authorityId">
        <template #label>角色ID</template>
        <el-input v-model="form.authorityId" disabled placeholder="请输入角色ID" />
      </el-form-item>
      <el-form-item prop="authorityName">
        <template #label><span>角色名称</span></template>
        <el-input v-model="form.authorityName" placeholder="" />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { getAuthority, createAuthority, copyAuthority, updateAuthority, deleteAuthority } from "@/api/user";
import { ref, reactive } from "vue";
import WarningTip from "@/components/WarningTip.vue";
import { ElMessageBox, ElMessage } from "element-plus";
import tabReview from "@/view/superAdmin/authority/components/tabReview.vue";
import tabApis from "@/view/superAdmin/authority/components/tabApis.vue";
import tabResource from "@/view/superAdmin/authority/components/tabResource.vue";
import { useStore } from "vuex";
import { nextTick } from "vue";

const addFormRef = ref(null);
const copyFormRef = ref(null);
const editFormRef = ref(null);

const authorityList = ref([]); // 定义为全局变量，方便读取，赋值的data是树形结构
const authorityOption = ref([]);
getAuthority().then((a) => {
  authorityList.value = a.data;
  console.log("角色数据", authorityList.value);

  // 在 authorityList 的基础上添加新数据
  authorityOption.value = [
    {
      authorityId: 0,
      authorityName: "根角色(严格模式下为当前用户角色)",
    },
    ...authorityList.value, // 展开原始数据
  ];
  console.log("authorityOption", authorityOption.value);
});

// 弹窗
const drawerAdd = ref(false); // 这里的逻辑是：按钮点击将 drawer 设置为 true 来打开抽屉。抽屉关闭后，drawer 自动设置为 false
const drawerSetting = ref(false);
const drawerEdit = ref(false);
const drawerCopy = ref(false);
const drawerAddSub = ref(false);
const store = useStore();
const parentDisplay = ref("");
const oldAuthorityId = ref(0);

// 即使你初始化 form.parentId 为字符串，el-cascader 也会强制将其转换为数组。
const form = ref({ authorityId: "", authorityName: "", parentId: "" });

// 表格规则
const rules = reactive({
  authorityId: [{ required: true, message: "必须为正整数", trigger: "blur" }],
  authorityName: [{ required: true, message: "请输入角色名", trigger: "blur" }],
  parentId: [{ required: true, message: "请选择父角色", trigger: "blur" }],
});

// 级联选择器配置 props，映射字段
const cascaderProps = {
  value: "authorityId", // 对应数据的 ID 字段
  label: "authorityName", // 对应数据的 name 字段
  children: "children", // 对应数据的 children 字段
  checkStrictly: true, // 关键设置：可以单独选择任意节点，而不强制选中其子节点，注意这里格式前面有个圆形按钮
};

// 新增角色
const handleClickAdd = async () => {
  drawerAdd.value = true;
  await nextTick();
  addFormRef.value.clearValidate();
  form.value.authorityId = "";
  form.value.authorityName = "";
  form.value.parentId = 0; // 新增角色
};

// 新增角色确定
const handleSubmitAdd = async () => {
  addFormRef.value.validate(async (valid) => {
    if (!valid) return;
    drawerAdd.value = false;
    form.value.authorityId = Number(form.value.authorityId); // 转为数字
    drawerAddSub.value = false;
    drawerAdd.value = false;
    form.value.authorityId = Number(form.value.authorityId); // 转为数字
    const res = await createAuthority(form.value);
    const type = res.code === 0 ? "success" : "error";
    ElMessage({ message: res.msg, type: type });
    if (res.code === 0) {
      // 注意这里，返回是一个对象
      // const {data} = await getAuthority();//这么写是可以的，data赋值给数组
      // 直接赋值返回值，会报错data.includes not function
      authorityList.value = (await getAuthority()).data;
    }
  });
};

// ，注意实例要和表单绑定，否则提示clearValidate属性错误
const handleClickAddSub = async (row) => {
  drawerAddSub.value = true;
  await nextTick();
  addFormRef.value.clearValidate();
  form.value.authorityId = "";
  form.value.authorityName = "";
  form.value.parentId = row.authorityId; // 函数参数
  parentDisplay.value = row.authorityName; // 显示用
};

const handleClickCopy = async (row) => {
  drawerCopy.value = true;
  await nextTick();
  copyFormRef.value.clearValidate();
  // 旧的ID
  oldAuthorityId.value = Number(row.authorityId);
  // 填充表单
  form.value = row;
};

const handleSubmitCopy = async () => {
  copyFormRef.value.validate(async (valid) => {
    if (!valid) return;
    drawerCopy.value = false;
    form.value.authorityId = Number(form.value.authorityId); // 转为数字
    const res = await copyAuthority({
      authority: {
        authorityId: form.value.authorityId,
        authorityName: form.value.authorityName,
        //级联选择器 (el-cascader) 会自动将 v-model 绑定的值转换为数组
        parentId: form.value.parentId[form.value.parentId.length - 1], // 取最后一位,0可能报错
      },
      oldAuthorityId: oldAuthorityId.value,
    });
    const type = res.code === 0 ? "success" : "error";
    ElMessage({ message: res.msg, type: type });
    if (res.code === 0) {
      authorityList.value = (await getAuthority()).data;
    }
  });
};

const handleClickSetting = async (row) => {
  drawerSetting.value = true;
  form.value.authorityId = row.authorityId;
  form.value.authorityName = row.authorityName;
  form.value.parentId = row.parentId;
};

const handleClickEdit = async (row) => {
  drawerEdit.value = true;
  await nextTick();
  editFormRef.value.clearValidate();
  // 整体赋值，ref定义
  form.value = row;
};

const handleSubmitEdit = async () => {
  editFormRef.value.validate(async (valid) => {
    if (!valid) return;
    drawerEdit.value = false;
    form.value.authorityId = Number(form.value.authorityId); // 转为数字
    const res = await updateAuthority({
      authorityId: form.value.authorityId,
      authorityName: form.value.authorityName,
      parentId: form.value.parentId[form.value.parentId.length - 1], // 取最后一位,0可能报错
    });
    const type = res.code === 0 ? "success" : "error";
    ElMessage({ message: res.msg, type: type });
    if (res.code === 0) {
      authorityList.value = (await getAuthority()).data;
    }
  });
};

// 删除按钮
const handleClickDelete = async (row) => {
  try {
    await ElMessageBox.confirm("此操作将永久删除该角色，是否继续？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // 确定后执行的逻辑
    form.value.authorityId = row.authorityId;
    handleSubmitDelete(row); // 调用函数
  } catch (error) {
    // 处理取消逻辑
    if (error === "cancel") ElMessage({ message: "已取消删除!", type: "info" });
  }
};

// 删除按钮--确定
const handleSubmitDelete = async () => {
  form.value.authorityId = Number(form.value.authorityId); // 转为数字
  if ([888, 8881, 9528].includes(form.value.authorityId)) {
    ElMessage.error("系统角色不可删除!");
    return;
  }
  await deleteAuthority({ authorityId: form.value.authorityId });
  const { data } = await getAuthority();
  authorityList.value = data;
};

const tabClickAuthority = (tab) => {
  console.log("Tab小标签页", tab.props.label); // 检查事件是否触发
  store.commit("setAuthorityTab", tab);
};
</script>

<style>
.buttonBelow {
  margin-bottom: 20px;
}
.placeholder-text {
  color: black;
}
.el-drawer {
  background-color: white !important; /* 设置为不透明的白色 */
}
</style>
