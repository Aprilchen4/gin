<template>
  <WarningTip title="注：右上角头像下拉可切换角色" />
  <div style="margin-top: 10px">
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
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="userForm.userName" placeholder="admin" />
      </el-form-item>
      <el-form-item label="密码" prop="passWord">
        <el-input v-model="userForm.passWord" placeholder="密码" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="userForm.nickName" placeholder="Mr.奇淼" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="userForm.phone" placeholder="15999999999" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" placeholder="333333@qq.com" />
      </el-form-item>
      <el-form-item label="用户角色" prop="authorityIds">
        <!-- checkStrictly: true 可以单独勾选任意节点（无需依赖父子关系）。 -->
        <!-- collapse-tags：多选时，显示一个折叠标签，而不是所有选中项。 -->
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
          <template v-if="userForm.headerImg">
            <img :src="userForm.headerImg" class="upload-image" />
          </template>
          <template v-else>
            <span>+ 上传</span>
          </template>
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
          <!-- 点击上传图片 -->
          <div class="button-group" style="margin-top: 20px">
            <el-button type="danger" :disabled="!hasSelected" @click="handleConfirmSelection">
              <el-icon><ArrowLeft /></el-icon>选定
            </el-button>
            <el-button type="primary" @click="triggerUpload">
              <el-icon><Upload /></el-icon>普通上传
            </el-button>
            <el-button type="primary" @click="triggerUpload">
              <el-icon><Scissor /></el-icon>裁剪上传
            </el-button>
            <el-button type="primary" @click="scanUploadFunc">
              <el-icon><Grid /></el-icon>扫码上传
            </el-button>
            <el-button type="primary" @click="triggerUpload">
              <el-icon><Upload /></el-icon>压缩上传
            </el-button>
            <!-- :http-request属性允许你自定义上传逻辑 -->
            <el-upload
              ref="uploadRef"
              action=""
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="handleUpload"
              style="display: none"
            >
            </el-upload>
            <!-- 图片列表,注意v-for是对数组，数组里的对象属性写法 -->
            <!-- item.selected: 这是一个布尔值，表示当前 item 是否被选中。 -->
            <!-- selected是:class 绑定语法中的动态类名。不是自定义属性。
             select是div部分整体的属性：卡片级"的交互 -->
            <!-- item.selected 为 true，则 selected 类将被添加到该 <div> 中。 -->
            <div class="image-list" v-if="uploadPicFile.length">
              <div
                v-for="item in uploadPicFile"
                :key="item.ID"
                class="image-item"
                :class="{ selected: item.selected }"
                @click="toggleImageSelection(item)"
              >
                <img :src="item.url" class="image" />
                <!-- 新增文件名显示 -->
                <div class="image-name">{{ item.name }}</div>
                <el-icon class="delete-icon" @click="deleteImage(item.ID)">
                  <Close />
                </el-icon>
              </div>
            </div>
          </div>
          <div>
            <!-- 上传图片页码 -->
            <div style="display: flex; justify-content: center; margin-top: 10px; margin-top: 25px">
              <el-pagination
                v-model:current-page="pagePic"
                :size="size"
                :disabled="disabled"
                :background="background"
                layout="total,prev, pager, next, jumper"
                :total="totalUploadPic"
                @size-change="handleSizeChangePic"
                @current-change="handleCurrentChangePic"
              >
              </el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </el-drawer>
  <div style="font-size: small">
    <el-table
      v-loading="tableLoading"
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
          <!-- v-model绑定一个数组authorityIds(对应数据value)，选中项绑定值，代表默认勾选项-->
          <!--  emitPath: true // 重要：存储完整路径 ,会返回完整的路径数组-->
          <el-cascader
            v-model="scope.row.authorityIds"
            :options="userAuthority"
            :props="{
              multiple: true,
              checkStrictly: true,
              label: 'authorityName',
              value: 'authorityId',
              emitPath: false,
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
          <el-button type="text" @click="onClickReset(scope.row)">重置密码</el-button>
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
import WarningTip from "@/components/WarningTip.vue";
import { ref, computed } from "vue"; // 引入 computed
import {
  getAuthority,
  getUserList,
  getFileList,
  getCategoryList,
  adminRegister,
  deleteUser,
  setUserInfo,
  resetPassword,
  uploadPicture,
} from "@/api/user";
import customPic from "@/components/customPic.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import scanUpload from "@/assets/scanUpload.png";
import { h } from "vue"; // 引入 h 函数，用于创建 VNode

const drawerChange = ref(false);
const drawerUpload = ref(false);
const operationType = ref("");
const dialogTitle = ref("");
const totalUploadPic = ref(2);
const tableLoading = ref(false);

const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const pagePic = ref(1);
// const pageSizePic = ref(10);
const userAuthority = ref([]);
const userList = ref([]);
const uploadPicFile = ref([]);
// 获取 el-upload 组件的引用
const uploadRef = ref(null);
const keyword = ref("");

const searchInfo = ref({
  userName: "",
  nickName: "",
  phone: "",
  email: "",
});

// 抽屉部分，注意这里 authorityId是数字不是字符串，注意密码是字符串，不是数字
const userForm = ref({
  ID: 1,
  userName: "",
  nickName: "",
  phone: "",
  passWord: "",
  email: "",
  headerImg: "",
  authorityId: 888,
  authorityIds: [],
  enable: 1,
});

const rules = ref({
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, message: "最低5位字符", trigger: "blur" },
  ],
  passWord: [
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
  authorityIds: [{ required: true, message: "请选择用户角色", trigger: "blur" }],
});

getUserList({
  page: 1,
  pageSize: 10,
  username: "",
  nickname: "",
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

const fetchTableData = async () => {
  const res = await getUserList({
    page: page.value,
    pageSize: pageSize.value,
    username: searchInfo.value.userName,
    nickname: searchInfo.value.nickName,
    phone: searchInfo.value.phone,
    email: searchInfo.value.email,
  });
  userList.value = (res.data.list || []).map((user) => ({
    ...user,
    authorityIds: (user.authorities || []).map((auth) => auth.authorityId), // 初始化 authorityIds
  }));
};

// 表格用户角色数据
getAuthority().then((res) => {
  userAuthority.value = res.data; // 数组，普通+子+测试信息
  console.log("userAuthority.value", userAuthority.value);
});

// 查询
const onSubmit = async () => {
  tableLoading.value = true;
  try {
    await fetchTableData();
  } finally {
    tableLoading.value = false;
  }
};

// 重置
const onReset = async () => {
  searchInfo.value = {
    userName: "",
    nickName: "",
    phone: "",
    email: "",
  };
  const res = await getUserList({ page: 1, pageSize: 10, username: "", nickname: "", phone: "", email: "" });
  userList.value = (res.data.list || []).map((user) => ({
    ...user,
    authorityIds: (user.authorities || []).map((auth) => auth.authorityId), // 初始化 authorityIds
  }));
};

// 新增用户，注意密码是字符串，不是数字
const onClickAdd = async () => {
  drawerChange.value = true;
  operationType.value = "addUser";
  dialogTitle.value = "用户";
  userForm.value = {
    ID: 1,
    userName: "",
    nickName: "",
    phone: "",
    passWord: "",
    email: "",
    headerImg: "",
    authorityId: 888,
    authorityIds: [],
    enable: 1,
  };
};

// 新增确定按钮
const handleSubmitAdd = async () => {
  // 这里传参数，是后台数据库处理getUserList的返回值
  const resTableDate = await adminRegister({
    ID: total.value + 1,
    email: userForm.value.email,
    nickName: userForm.value.nickName,
    phone: userForm.value.phone,
    userName: userForm.value.userName,
    passWord: userForm.value.passWord,
    enable: userForm.value.enable,
    headerImg: userForm.value.headerImg,
    authorityId: userForm.value.authorityId,
    authorityIds: userForm.value.authorityIds,
  });
  drawerChange.value = false;
  total.value += 1; // 更新总数
  // 防御性编程
  if (resTableDate.msg === "注册失败") {
    ElMessage({
      type: "error",
      message: `创建失败`,
    });
  } else {
    const res = await getUserList({ page: 1, pageSize: 10, username: "", nickname: "", phone: "", email: "" });
    userList.value = (res.data.list || []).map((user) => ({
      ...user,
      authorityIds: (user.authorities || []).map((auth) => auth.authorityId), // 初始化 authorityIds
    }));
    ElMessage({
      type: "success",
      message: `创建成功`,
    });
  }
};

// 点击“选定”按钮的处理函数
const handleConfirmSelection = () => {
  // 过滤出数组中 selected 属性为 true 的图片对象，返回一个新数组，selectedImages
  const selectedImages = uploadPicFile.value.filter((item) => item.selected);
  if (selectedImages.length > 0) {
    // 假设只取第一张选中的图片，每次只选一张，取[0]刚好，赋值给表单属性
    userForm.value.headerImg = selectedImages[0].url || "https://qmplusimg.henrongyi.top/gva_header.jpg";
    ElMessage.success("头像已选定");
    drawerUpload.value = false; // 关闭上传抽屉
  } else {
    ElMessage.warning("请先选择一张图片");
  }
};

// 上传头像抽屉
const openClickUpload = async () => {
  drawerUpload.value = true;
  ElMessage({
    type: "error",
    message: `权限不足`,
  });
  dialogTitle.value = "媒体库 | 点击“文件名”可以编辑，选择的类别即是上传的类别";
  const res = await getFileList({ page: page.value, pageSize: pageSize.value, keyword: null, classId: 0 });
  totalUploadPic.value = res.data.total;
  uploadPicFile.value = res.data.list;

  console.log("res.data", res.data.total, res.data.list);
  await getCategoryList();
};

// 表格选择器勾选，emitPath: true 会返回完整的路径数组，导致返回的是嵌套数组 [[888], [9528]]。
// 置了 emitPath: false，所以返回的是扁平数组 [888, 9528]。
const handleAuthorityChange = async (row) => {
  await setUserInfo({ ID: row.ID, authorityIds: row.authorityIds });
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

// 表格删除操作
const onClickDelete = async (row) => {
  if (row.userName == "admin") {
    ElMessage({
      message: "系统角色不可删除",
      type: "error",
    });
  } else {
    try {
      await ElMessageBox.confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      await deleteUser({ id: row.ID });
      const res = await getUserList({ page: 1, pageSize: 10, username: "", nickname: "", phone: "", email: "" });
      userList.value = (res.data.list || []).map((user) => ({
        // ...user （展开运算符）复制 user 对象的所有原有属性。
        ...user,
        authorityIds: (user.authorities || []).map((auth) => auth.authorityId), // 初始化 authorityIds
      }));
      ElMessage({
        message: "删除成功",
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
  }
};

// 表格编辑操作
const onClickEdit = async (row) => {
  drawerChange.value = true;
  dialogTitle.value = "用户";
  operationType.value = "editUser";
  userForm.value.userName = row.userName;
  userForm.value.nickName = row.nickName;
  userForm.value.phone = row.phone;
  userForm.value.email = row.email;
  userForm.value.headerImg = row.headerImg;
  userForm.value.authorityId = row.authorityId;
  userForm.value.authorityIds = row.authorityIds;
  userForm.value.enable = row.enable;
};

// 表格编辑提交
const handleSubmitEdit = async () => {
  drawerChange.value = false;
  tableLoading.value = true;
  await setUserInfo({
    ID: userForm.value.ID,
    email: userForm.value.email,
    nickName: userForm.value.nickName,
    userName: userForm.value.userName,
    phone: userForm.value.phone,
    enable: userForm.value.enable,
    headerImg: userForm.value.headerImg,
    authorityId: userForm.value.authorityId,
    authorityIds: userForm.value.authorityIds,
    authorities: userAuthority.value,
  });
  const res = await getUserList({ page: 1, pageSize: 10, username: "", nickname: "", phone: "", email: "" });
  userList.value = (res.data.list || []).map((user) => ({
    ...user,
    authorityIds: (user.authorities || []).map((auth) => auth.authorityId), // 初始化 authorityIds
  }));
  ElMessage.success("编辑成功");
  tableLoading.value = false;
};

// 表格重置密码
const onClickReset = async (row) => {
  try {
    await ElMessageBox.confirm("是否将此用户密码重置为123456?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const res = await resetPassword({ id: row.ID });
    ElMessage({
      message: res.msg,
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

// 搜索图片
const searchPic = async () => {
  const res = await getFileList({ page: page.value, pageSize: pageSize.value, keyword: keyword.value, classId: 0 });
  uploadPicFile.value = res.data.list;
  totalUploadPic.value = res.data.total;
};

// 点击图片上传按钮触发上传，关联上传按钮和<upload组件>
// 通过uploadRef实例访问 <el-upload> 组件的 DOM，找到其内部的 <input type="file"> 并模拟点击
const triggerUpload = async () => {
  uploadRef.value.$el.querySelector("input").click();
  await uploadPicture();
};

// 限制文件类型和大小
const beforeUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2; // 限制 2MB

  if (!isImage) {
    ElMessage.error("只能上传图片文件！");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB！");
    return false;
  }
  return true;
};

// 自定义上传逻辑，options 是一个对象，包含了与本次上传相关的关键信息。(包括file属性（含文件名、大小、类型)
const handleUpload = async (options) => {
  // 类型为 File，继承自 Blob（本地文件
  const file = options.file;
  try {
    // 模拟上传：将图片转为本地预览 URL
    const imageUrl = URL.createObjectURL(file);
    const newImage = {
      ID: uploadPicFile.value.length + 1, // 简单生成 ID（实际项目中应由服务器返回）
      url: imageUrl, // 浏览器会为本地文件生成临时 Blob URL
      name: file.name, // 添加文件名属性
      selected: false, // 新增选中状态字段
    };
    uploadPicFile.value.push(newImage); // 添加到图片列表，这里只是保存在前端的 uploadPicFile.value，没有上传到服务器
    ElMessage.success("上传成功");
  } catch (error) {
    ElMessage.error("上传失败");
  }
};

// 计算是否有选中的图片 hasSelected = computed(() => {
const hasSelected = computed(() => {
  return uploadPicFile.value.some((item) => item.selected);
});

// 点击图片切换选中状态,item是 uploadPicFile 数组中每个元素的代表。
const toggleImageSelection = (item) => {
  item.selected = !item.selected; // 切换选中状态
};

// 删除图片
const deleteImage = (id) => {
  // 在 uploadPicFile 数组中查找 ID 等于变量 id 的元素，并返回其索引位置。
  // findIndex是数组的一个方法，找到符合条件的索引
  const index = uploadPicFile.value.findIndex((item) => item.ID === id);
  if (index !== -1) {
    uploadPicFile.value.splice(index, 1);
    ElMessage.success("删除成功");
  }
};

// 扫码上传
const scanUploadFunc = async () => {
  try {
    await ElMessageBox.confirm(
      h(
        "div",
        {
          style: {
            display: "flex", // 使用 Flex 布局
            "flex-direction": "column", // 垂直排列（如果有多个子元素）
            "align-items": "center", // 水平居中
            "justify-content": "center", // 垂直居中
            "min-height": "300px", // 确保容器有足够高度
          },
        },
        [
          h("img", {
            src: scanUpload,
            style: {
              width: "300px",
              height: "300px",
              "margin-bottom": "10px",
              display: "flex", // 使用 Flex 布局
              "align-items": "center", // 水平居中
            },
            alt: "QR Code",
          }),
        ]
      ),
      "扫码上传",
      {
        confirmButtonText: "完成上传",
        cancelButtonText: "取消",
        customClass: "custom-message-box", // 添加自定义类名
      }
    );
    // 要执行逻辑
  } catch (error) {
    // 处理取消逻辑
    if (error === "cancel") {
      ElMessage({
        message: "已取消上传!",
        type: "info",
      });
    }
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

.upload-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 图片自适应容器 */
  border-radius: 4px;
}

/* 表单头像 */
.image-name {
  display: flex;
  justify-content: center;
  margin-top: 5px;
  font-size: 14px;
  color: #666;
  word-break: break-all; /* 长文件名自动换行 */
  padding: 0 5px; /* 添加一些内边距 */
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

.image-list {
  display: flex;
  flex-wrap: wrap; /* 自动换行 */
  gap: 10px; /* 图片之间的间距 */
  margin-top: 10px; /* 与按钮的间距 */
}
.image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 图片自适应 */
  border-radius: 4px;
}

/* 以下决定delete图标在图片右上方 */
.image-item {
  position: relative; /* 为绝对定位的子元素提供锚点 */
  width: 100px;
  height: 100px;
}

.delete-icon {
  position: absolute; /* 根据父元素定位，无视文档流顺序  */
  top: 5px; /* 相对于父元素顶部定位 */
  right: 5px; /*  删除操作属于高风险操作，放在显眼位置（图片右上角）符合设计惯例*/
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 2px;
  cursor: pointer;
}

.delete-icon:hover {
  background: rgba(255, 0, 0, 0.8);
}
</style>
