<template>
  <!-- 左上角按钮 -->
  <div>
    <!-- <el-drawer> 组件和 <el-button> 之间的关系是通过 v-model 指令来实现的。 -->
    <el-button class="buttonBelow" type="primary" @click="handleClickAdd">
      + 新增角色
    </el-button>
    <el-drawer v-model="drawerAdd" :with-header="true" size="700px">
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>新增角色</span>
          <div>
            <el-button @click="drawerAdd = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitAdd">
              确定
            </el-button>
          </div>
        </div>
      </template>

      <el-form :model="form" label-width="80px" :rules="rules">
        <el-form-item prop="parentId">
          <template #label> 父级角色 </template>
          <el-input placeholder="根角色(严格模式下为当前用户角色)" disabled>
          </el-input>
        </el-form-item>

        <el-form-item prop="authorityId">
          <template #label> 角色ID </template>
          <el-input v-model="form.authorityId" placeholder="0" />
        </el-form-item>
        <el-form-item prop="authorityName">
          <template #label> 角色名称 </template>
          <el-input v-model="form.authorityName" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
  <!-- 以上是新增角色按钮 -->
  <!-- 表格 -->
  <div>
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
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClickSetting(scope.row)"
          >
            <el-icon><Setting /></el-icon>设置权限
          </el-button>

          <!-- 新增子角色 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClickAddSub(scope.row)"
          >
            + 新增子角色
          </el-button>

          <!-- 拷贝 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClickCopy(scope.row)"
          >
            <el-icon><CopyDocument /></el-icon>拷贝
          </el-button>

          <!-- 编辑 -->
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClickEdit(scope.row)"
          >
            <el-icon><edit /></el-icon>编辑
          </el-button>

          <!-- 删除 -->
          <el-button
            link
            type="primary"
            size="small"
            @Click="handleClickDelete(scope.row)"
          >
            <el-icon><delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      v-model="drawerSetting"
      :with-header="true"
      size="700px"
      title="角色配置"
    >
      <el-tabs
        :before-leave="autoEnter"
        type="border-card"
        v-model="activeAuthorityTab"
        @tab-click="tabClickAuthority"
      >
        <el-tab-pane label="角色菜单">
          <tabReview :authorityId="form.authorityId" />
        </el-tab-pane>
        <el-tab-pane label="角色api">
          <tabApis :authorityId="form.authorityId" />
        </el-tab-pane>
        <el-tab-pane label="资源权限">
          <tabResource :selectedName="form.authorityName" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
    <el-drawer v-model="drawerAddSub" :with-header="true" size="700px">
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>新增子角色</span>
          <div>
            <el-button @click="drawerAdd = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitAdd">
              确定
            </el-button>
          </div>
        </div>
      </template>

      <el-form :model="form" label-width="80px" :rules="rules">
        <el-form-item prop="parentId">
          <template #label> 父级角色 </template>
          <el-input v-model="parentDisplay" disabled> </el-input>
        </el-form-item>

        <el-form-item prop="authorityId">
          <template #label> 角色ID </template>
          <el-input v-model="form.authorityId" placeholder="0" />
        </el-form-item>
        <el-form-item prop="authorityName">
          <template #label> 角色名称 </template>
          <el-input v-model="form.authorityName" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 拷贝 -->
    <el-drawer v-model="drawerCopy" :with-header="true" size="700px">
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>拷贝角色</span>
          <div>
            <el-button @click="drawerCopy = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitCopy">
              确定
            </el-button>
          </div>
        </div>
      </template>

      <el-form :model="form" label-width="80px" :rules="rules">
        <el-form-item prop="parentId">
          <template #label>
            <span>父级角色</span>
          </template>
          <el-select
            placeholder="根角色(严格模式下为当前用户角色)"
            v-model="form.parentId"
          >
            <el-option value="根角色(严格模式下为当前用户角色)">
              <el-radio
                v-model="form.parentId"
                value="根角色(严格模式下为当前用户角色)"
                >根角色(严格模式下为当前用户角色)</el-radio
              >
            </el-option>
            <el-select placeholder="">
              <!-- <template #prefix> 用于添加一个带有 普通用户 标签的单选框 el-radio： -->
              <template #prefix>
                <el-radio style="margin-left: 8px" value="普通用户">
                  普通用户
                </el-radio>
              </template>
              <el-option disabled value="普通用户子角色">
                <el-radio value="普通用户子角色"> 普通用户子角色 </el-radio>
              </el-option>
            </el-select>

            <el-option value="测试角色">
              <el-radio v-model="form.authorityId" value="测试角色">
                测试角色
              </el-radio>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="authorityId">
          <template #label> 角色ID </template>
          <el-input v-model="form.authorityId" placeholder="请输入角色ID" />
        </el-form-item>
        <el-form-item prop="authorityName">
          <template #label> 角色名称 </template>
          <el-input v-model="form.authorityName" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 编辑抽屉 -->
    <el-drawer v-model="drawerEdit" :with-header="true" size="700px">
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>编辑角色</span>
          <div>
            <el-button @click="drawerEdit = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitEdit">
              确定
            </el-button>
          </div>
        </div>
      </template>

      <el-form :model="form" label-width="80px" :rules="rules">
        <el-form-item prop="parentId">
          <template #label>
            <span>父级角色</span>
          </template>
          <el-cascader
            style="width: 580px"
            :options="authorityList"
            :props="cascaderProps"
            :show-all-levels="false"
            placeholder="根角色(严格模式下为当前用户角色)"
            v-model="form.parentId"
            clearable
          />
        </el-form-item>

        <el-form-item prop="authorityId">
          <template #label> 角色ID </template>
          <el-input
            v-model="form.authorityId"
            disabled
            placeholder="请输入角色ID"
          />
        </el-form-item>
        <el-form-item prop="authorityName">
          <template #label>
            <span>角色名称</span>
          </template>
          <el-input v-model="form.authorityName" placeholder=""></el-input>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  getAuthority,
  createAuthority,
  copyAuthority,
  updateAuthority,
  deleteAuthority,
} from "@/api/user";
import { ref } from "vue";
import { reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import tabReview from "@/view/superAdmin/authority/components/tabReview.vue";
import tabApis from "@/view/superAdmin/authority/components/tabApis.vue";
import tabResource from "@/view/superAdmin/authority/components/tabResource.vue";
import { useStore } from "vuex";

const authorityList = ref([]); //定义为全局变量，方便读取

getAuthority().then((a) => {
  authorityList.value = a.data;
  console.log("角色数据", authorityList);
});

// 弹窗
const drawerAdd = ref(false); //这里的逻辑是：按钮点击将 drawer 设置为 true 来打开抽屉。抽屉关闭后，drawer 自动设置为 false
const drawerSetting = ref(false);
const drawerEdit = ref(false);
const drawerCopy = ref(false);
const drawerAddSub = ref(false);
const store = useStore();
const parentDisplay = ref("");
const oldAuthorityId = ref(0);

const form = ref({
  authorityId: "",
  authorityName: "",
  parentId: "",
});

//  表格规则
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
  checkStrictly: true, // 关键设置：可以单独选择任意节点
};

const handleClickAdd = () => {
  drawerAdd.value = true;
  form.value.authorityId = "";
  form.value.authorityName = "";
  form.value.parentId = 0; //新增角色
};

const handleSubmitAdd = async () => {
  drawerAddSub.value = false;
  drawerAdd.value = false;
  form.value.authorityId = Number(form.value.authorityId); // 转为数字
  await createAuthority(form.value);
  const { data } = await getAuthority();
  authorityList.value = data;
  ElMessage.success("添加成功!");
};

const handleClickAddSub = (row) => {
  drawerAddSub.value = true;
  form.value.authorityId = "";
  form.value.authorityName = "";
  form.value.parentId = row.authorityId; // 函数参数
  parentDisplay.value = row.authorityName; // 显示用
};

const handleClickCopy = async (row) => {
  drawerCopy.value = true;
  oldAuthorityId.value = Number(row.authorityId);
  form.value.authorityId = row.authorityId;
  form.value.authorityName = row.authorityName;
  form.value.parentId = row.parentId;
};

const handleSubmitCopy = async () => {
  drawerCopy.value = false;
  form.value.authorityId = Number(form.value.authorityId); // 转为数字
  await copyAuthority({
    authority: {
      authorityId: form.value.authorityId,
      authorityName: form.value.authorityName,
      parentId: form.value.parentId,
    },
    oldAuthorityId: oldAuthorityId.value,
  });

  const { data } = await getAuthority();
  authorityList.value = data;
  ElMessage.success("拷贝成功!");
};

const handleClickSetting = async (row) => {
  drawerSetting.value = true;
  form.value.authorityId = row.authorityId;
  form.value.authorityName = row.authorityName;
  form.value.parentId = row.parentId;
};

const handleClickEdit = async (row) => {
  drawerEdit.value = true;
  form.value.authorityId = row.authorityId;
  form.value.authorityName = row.authorityName;
  form.value.parentId = row.parentId;
};

const handleSubmitEdit = async () => {
  drawerEdit.value = false;
  form.value.authorityId = Number(form.value.authorityId); // 转为数字
  await updateAuthority({
    authorityId: form.value.authorityId,
    authorityName: form.value.authorityName,
    parentId: form.value.parentId,
  });
  const { data } = await getAuthority();
  authorityList.value = data;
  ElMessage.success("编辑成功!");
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
    if (error === "cancel") {
      ElMessage({
        message: "已取消删除!",
        type: "info",
      });
    }
  }
};

// 删除按钮--确定
const handleSubmitDelete = async () => {
  form.value.authorityId = Number(form.value.authorityId); // 转为数字
  if (
    form.value.authorityId === 888 ||
    form.value.authorityId === 8881 ||
    form.value.authorityId === 9528
  ) {
    ElMessage.error("系统角色不可删除!");
    return;
  } else {
    await deleteAuthority({ authorityId: form.value.authorityId });
    const { data } = await getAuthority();
    authorityList.value = data;
  }
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
