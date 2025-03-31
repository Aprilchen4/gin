<template>
  <div>
    <el-form :inline="true" :model="searchInfo" style="font-size: small" class="search-form">
      <el-form-item label="用户名">
        <el-input v-model="searchInfo.userName" placeholder="用户名" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="searchInfo.nickName" placeholder="昵称" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchInfo.phone" placeholder="描述" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="searchInfo.email" placeholder="email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="onSubmit"> 查询 </el-button>
        <el-button icon="refresh" @click="onReset"> 重置 </el-button>
      </el-form-item>
    </el-form>
  </div>
  <div style="margin-top: 20px; margin-bottom: 20px">
    <el-button type="primary" @click="onClickAdd">+ 新增用户</el-button>
  </div>
  <el-drawer v-model="drawerChange" :with-header="true" size="800px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>{{ dialogTitle }}</span>
        <div>
          <el-button @click="drawerChange = false">取消</el-button>
          <template v-if="operationType === 'addUser'">
            <el-button type="primary" @click="handleSubmitAdd">确定</el-button>
          </template>
          <template v-else-if="operationType === 'editUser'">
            <el-button type="primary" @click="handleSubmitEdit">确定</el-button>
          </template>
        </div>
      </div>
    </template>
    <el-form :model="userForm" :rules="rules" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="userForm.userName" placeholder="admin" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="userForm.passWord" placeholder="密码" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="userForm.nickName" placeholder="Mr.奇淼" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="userForm.phone" placeholder="15999999999" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userForm.phone" placeholder="333333@qq.com" />
      </el-form-item>
      <el-form-item label="用户角色">
        <el-cascader
          style="width: 100%"
          v-model="userForm.authorityIds"
          :options="userAuthority"
          :props="{
            multiple: true,
            checkStrictly: true,
            label: 'authorityName',
            value: 'authorityId',
            emitPath: false,
          }"
          collapse-tags
          @change="addUserAuthority"
        />
      </el-form-item>
      <el-form-item v-model="userForm.enable" label="启用">
        <el-switch v-model="userForm.enable" inline-prompt :active-value="1" :inactive-value="2" />
      </el-form-item>
      <el-form-item label="头像">
        <div class="upload-box" @click="openClickUpload">
          <span>+ 上传</span>
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="drawerUpload" :with-header="true" size="800px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span style="font-size: small">{{ dialogTitle }}</span>
      </div>
    </template>
    <div>
      <el-container>
        <el-aside
          style="display: flex; justify-content: center; font-size: small; margin-top: 15px; font-weight: lighter"
          width="160px"
        >
          暂无数据
        </el-aside>
        <el-main style="padding: 0px; margin-left: 0px">
          <div style="padding: 0px; margin-left: 0px">
            <el-input v-model="keyword" style="width: 280px; height: 28px"></el-input>
            <el-button type="primary" style="height: 28px" @click="searchPic">
              <el-icon><search /></el-icon>
            </el-button>
          </div>
          <div class="button-group" style="margin-top: 20px">
            <el-button type="danger" disabled>
              <el-icon><ArrowLeft /></el-icon>选定
            </el-button>
            <el-button type="primary">
              <el-icon><Upload /></el-icon>普通上传
            </el-button>
            <el-button type="primary">
              <el-icon><Scissor /></el-icon>裁剪上传
            </el-button>
            <el-button type="primary">
              <el-icon><Grid /></el-icon>扫码上传
            </el-button>
            <el-button type="primary">
              <el-icon><Upload /></el-icon>压缩上传
            </el-button>
          </div>
        </el-main>
      </el-container>
    </div>
  </el-drawer>
  <div style="font-size: small">
    <el-table
      :data="userList"
      row-key="ID"
      :header-row-style="{
        backgroundColor: '#f5f7fa',
        color: '#000',
        fontSize: '14px',
        fontWeight: 'bold',
      }"
    >
      <el-table-column align="left" label="头像" min-width="25">
        <template #default="scope">
          <customPic style="margin-top: 8px" :pic-src="scope.row.headerImg" />
        </template>
      </el-table-column>
      <el-table-column prop="ID" label="ID" min-width="30px" />
      <el-table-column prop="userName" label="用户名" min-width="50px"> </el-table-column>
      <el-table-column prop="nickName" label="昵称" min-width="40px"> </el-table-column>
      <el-table-column prop="phone" label="手机号" min-width="50px" />
      <el-table-column prop="email" label="邮箱" show-overflow-tooltip min-width="50px" />
      <el-table-column label="用户角色">
        <template #default="scope">
          <!-- 返回的是数组authorityIds,代表默认勾选项-->
          <!--  emitPath: true // 重要：存储完整路径 -->
          <el-cascader
            v-model="scope.row.authorityIds"
            :options="userAuthority"
            :props="{
              multiple: true,
              checkStrictly: true,
              label: 'authorityName',
              value: 'authorityId',
              emitPath: true,
            }"
            collapse-tags
            @change="handleAuthorityChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="启用状态" min-width="30px">
        <template #default="scope">
          <el-switch
            v-model="scope.row.enable"
            inline-prompt
            :active-value="1"
            :inactive-value="2"
            @change="
              () => {
                switchEnable(scope.row);
              }
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="onClickDelete(scope.row)">删除</el-button>
          <el-button type="text" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="onClickEdit(scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div style="display: flex; justify-content: flex-end; margin-top: 10px">
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :page-sizes="[10, 30, 50, 100]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuthority, getUserList } from "@/api/user";
import customPic from "@/components/customPic.vue";
import { ElMessage } from "element-plus";
// import { ElMessageBox} from "element-plus";

const drawerChange = ref(false);
const drawerUpload = ref(false);
const operationType = ref("");
const dialogTitle = ref("");

const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const userAuthority = ref([]);
const userList = ref([]);

const searchInfo = ref({
  userName: "",
  nickName: "",
  phone: "",
  email: "",
});

// 抽屉部分
const userForm = ref({
  userName: "",
  nickName: "",
  phone: "",
  email: "",
  headerImg: "",
  authorityId: "",
  authorityIds: [],
  enable: 1,
});

const rules = ref({
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, message: "最低5位字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入用户密码", trigger: "blur" },
    { min: 6, message: "最低6位字符", trigger: "blur" },
  ],
  nickName: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  phone: [
    {
      pattern: /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/,
      message: "请输入合法手机号",
      trigger: "blur",
    },
  ],
  email: [
    {
      pattern: /^([0-9A-Za-z\-_.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g,
      message: "请输入正确的邮箱",
      trigger: "blur",
    },
  ],
  authorityId: [{ required: true, message: "请选择用户角色", trigger: "blur" }],
});

getUserList({
  page: 1,
  pageSize: 10,
  userName: "",
  nickName: "",
  phone: "",
  email: "",
}).then((res) => {
  // 直接生成对象的元素authorityIds，user是userList数组元素对象(思路真牛)
  userList.value = (res.data.list || []).map((user) => ({
    ...user,
    authorityIds: (user.authorities || []).map((auth) => auth.authorityId), // 初始化 authorityIds
  }));
  console.log("userList.valuepicccc", userList.value.headerImg); //undefined
  total.value = res.data.total;
});

// 表格用户角色数据
getAuthority().then((res) => {
  userAuthority.value = res.data; // 数组，普通+子+测试信息
  console.log("userAuthority.value", userAuthority.value);
});

// 新增用户
const onClickAdd = async () => {
  drawerChange.value = true;
  operationType.value = "addUser";
  dialogTitle.value = "用户";
};

// 上传抽屉
const openClickUpload = async () => {
  drawerUpload.value = true;
  ElMessage({
    type: "error",
    message: `权限不足`,
  });
  dialogTitle.value = "媒体库 | 点击“文件名”可以编辑，选择的类别即是上传的类别";
};
// 表格选择器勾选
const handleAuthorityChange = (row) => {
  console.log("row.authorityIds", row.authorityIds);
};

// 开关,错误的 userForm.value.enable。用 row.enable 判断状态。
const switchEnable = (row) => {
  if (row.enable === 2) {
    ElMessage({
      type: "success",
      message: `禁用成功`,
    });
  } else {
    ElMessage({
      type: "success",
      message: `启用成功`,
    });
  }
};
</script>
<style>
.upload-box {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
}

.upload-box:hover {
  border-color: #ccd1d5;
  background-color: #ccd1d5;
}

/* 上传抽屉按钮 */
.custom-button {
  height: 28px; /* 统一高度 */
  width: 100px; /* 统一宽度（可根据需求调整） */
  display: flex; /* 确保内容居中 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  padding: 0 10px; /* 调整内边距，避免内容挤压 */
  font-size: 14px; /* 统一字体大小 */
}

.custom-button .el-icon {
  margin-right: 5px; /* 图标和文字之间的间距 */
  font-size: 14px; /* 图标大小 */
}
</style>
