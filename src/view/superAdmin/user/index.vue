<template>
  <WarningTip title="注：右上角头像下拉可切换角色" />
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
  <el-button class="add-Btn" type="primary" @click="onClickAdd">+ 新增用户</el-button>
  <el-drawer v-model="drawerChange" :with-header="true" size="700px">
    <template #header>
      <div class="drawer-header">
        <span>{{ dialogTitle }}</span>
        <div>
          <el-button @click="drawerChange = false">取消</el-button>
          <el-button v-if="operationType === 'addUser'" type="primary" @click="handleSubmitAdd"> 确定 </el-button>
          <el-button v-else type="primary" @click="handleSubmitEdit">确定</el-button>
        </div>
      </div>
    </template>
    <el-form ref="userFormRef" :model="userForm" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="userName" v-if="operationType === 'addUser'">
        <el-input v-model="userForm.userName" placeholder="admin" />
      </el-form-item>
      <el-form-item label="密码" prop="passWord" v-if="operationType === 'addUser'">
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
        <!-- collapse-tags：多选时，显示一个折叠标签，而不是所有选中项。选项以标签的方式展示 -->
        <el-cascader
          collapse-tags
          v-model="userForm.authorityIds"
          :options="userAuthority"
          :props="{
            multiple: true,
            checkStrictly: true,
            label: 'authorityName',
            value: 'authorityId',
            emitPath: false,
          }"
          @change="addUserAuthority"
        />
      </el-form-item>
      <el-form-item v-model="userForm.enable" label="启用">
        <!-- :active-value 和 :inactive-value 是 <el-switch> 组件的属性。 -->
        <el-switch v-model="userForm.enable" inline-prompt :active-value="1" :inactive-value="2" />
      </el-form-item>
      <el-form-item label="头像">
        <div class="upload-box" @click="openClickUpload">
          <!-- 检查 userForm.headerImg -->
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
  <!-- 上传的二次抽屉 -->
  <el-drawer v-model="drawerUpload" :with-header="true" size="700px">
    <template #header>
      <span class="drawer-header">{{ dialogTitle }}</span>
    </template>
    <el-container>
      <el-aside class="upload-aside-text"> 暂无数据 </el-aside>
      <el-main>
        <el-input v-model="keyword" class="search-img" />
        <el-button type="primary" class="search-btn" @click="searchPic">
          <el-icon><search /></el-icon>
        </el-button>
        <!-- 点击按钮们上传图片 -->
        <div class="button-group">
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
        </div>
        <!-- :http-request属性允许你自定义上传逻辑;beforeUpload函数上传文件之前的钩子，参数为上传的文件， -->
        <!--  ref="uploadRef"实现按钮和el-upload组件的联动 -->
        <!-- action 请求 URL -->
        <el-upload
          ref="uploadRef"
          action="userForm.headerImg"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="handleUpload"
          style="display: none"
        />
        <!-- 图片列表,注意v-for是数组，数组里的对象属性写法 -->
        <!-- item.selected: 这是一个布尔值，表示当前 item 是否被选中。 -->
        <!-- selected是:class 动态绑定语法中的类名。不是自定义属性。
             给每个 image-item 条目动态应用一个类 selected，是div部分整体的属性：卡片级"的交互 -->
        <div class="image-list" v-if="uploadPicFile.length">
          <div
            v-for="item in uploadPicFile"
            :key="item.ID"
            class="image-item"
            :class="{ selected: item.selected }"
            @click="toggleImageSelection(item)"
          >
            <img :src="item.url" class="upload-image" />
            <!-- 新增文件名显示 -->
            <div class="image-name">{{ item.name }}</div>
            <el-icon class="delete-icon" @click="deleteImage(item)">
              <Close />
            </el-icon>
          </div>
        </div>
        <!-- 上传图片页码 -->
        <el-pagination
          class="pagination-container"
          v-model:current-page="pagePic"
          size="small"
          background
          :disabled="disabled"
          layout="total,prev, pager, next, jumper"
          :total="totalUploadPic"
          @size-change="handleSizeChangePic"
          @current-change="handleCurrentChangePic"
        />
      </el-main>
    </el-container>
  </el-drawer>

  <el-table v-loading="tableLoading" :data="userList" row-key="ID">
    <el-table-column align="left" label="头像" min-width="25">
      <template #default="scope">
        <customPic :pic-src="scope.row.headerImg" />
      </template>
    </el-table-column>
    <el-table-column prop="ID" label="ID" min-width="20px" />
    <el-table-column prop="userName" label="用户名" min-width="30px"> </el-table-column>
    <el-table-column prop="nickName" label="昵称" min-width="30px"> </el-table-column>
    <el-table-column prop="phone" label="手机号" min-width="40px" />
    <el-table-column prop="email" label="邮箱" show-overflow-tooltip min-width="30px" />
    <el-table-column label="用户角色">
      <template #default="scope">
        <!-- v-model绑定一个数组authorityIds(对应数据value)，选中项绑定值，代表默认勾选项-->
        <!--  emitPath: true // 重要：存储完整路径 ,会返回完整的路径数组 authorityIds [[888], [9528]]-->
        <!-- 多选默认卡片效果 -->
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
        <authorityTable icon="" label="删除" :on-click="() => onClickDelete(scope.row)" />
        <el-button link type="primary" @click="onClickEdit(scope.row)">编辑</el-button>
        <el-button link type="primary" @click="onClickReset(scope.row)">重置密码</el-button>
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
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import {
  getAuthority,
  getUserList,
  getFileList,
  getCategoryList,
  adminRegister,
  deleteUser,
  setUserInfo,
  resetPassword,
  upload,
  deleteFile,
} from "@/api/user"; // 引入 API 函数
import WarningTip from "@/components/WarningTip.vue";
import customPic from "@/components/customPic.vue";
import { ref, computed, h, nextTick, onMounted } from "vue"; // 引入 ref, computed, h 函数和 nextTick
import authorityTable from "@/components/authorityTable.vue";
import { ElMessage, ElMessageBox } from "element-plus"; // 引入 Element Plus 组件
import scanUpload from "@/assets/scanUpload.png"; // 引入上传图片
import cloneDeep from "lodash/cloneDeep";

const drawerChange = ref(false);
const drawerUpload = ref(false);
const totalUploadPic = ref(2);
const tableLoading = ref(false);
const operationType = ref("");
const dialogTitle = computed(() => (operationType.value === "editUser" ? "编辑用户" : "新增用户"));

const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const pagePic = ref(1);
const userAuthority = ref([]);
const userList = ref([]);
const uploadPicFile = ref([]);
const uploadRef = ref(null); // 获取 el-upload 组件的引用
const keyword = ref("");

const searchInfo = ref({
  userName: "",
  nickName: "",
  phone: "",
  email: "",
});

// 抽屉部分，注意这里 authorityId是数字不是字符串，注意密码是字符串，不是数字
const userFormRef = ref(null);
const userForm = ref({
  ID: null,
  userName: "",
  nickName: "",
  phone: "",
  passWord: "",
  email: "",
  headerImg: "",
  authorityId: null,
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

onMounted(() => {
  getUserList({
    page: 1,
    pageSize: 10,
    username: "",
    nickname: "",
    phone: "",
    email: "",
  }).then((res) => {
    userList.value = formatUserList(res);
    // 直接生成对象的元素authorityIds，user是userList数组元素对象(思路真牛)
    // 1、提取头像，写法不对
    // console.log("userList.valuepicccc", userList.value.headerImg); undefined,
    ///2、提取所有头像URL
    const headerImgs = userList.value.map((user) => user.headerImg);
    console.log("所有用户头像:", headerImgs);
    total.value = res.data.total;
  });
  // 表格用户角色数据
  getAuthority().then((res) => {
    userAuthority.value = res.data; // 数组，普通+子+测试信息
  });
});

// 重置表单
const InitUserForm = () => {
  Object.assign(userForm.value, {
    ID: null,
    userName: "",
    nickName: "",
    phone: "",
    passWord: "",
    email: "",
    headerImg: "",
    authorityId: null,
    authorityIds: [],
    enable: 1,
  });
};

// 重复部分单独写一个函数
function formatUserList(res) {
  return (res.data.list || []).map((user) => ({
    ...user,
    authorityIds: (user.authorities || []).map((auth) => auth.authorityId),
  }));
}

// 方便调用
const fetchTableData = async () => {
  const res = await getUserList({
    page: page.value,
    pageSize: pageSize.value,
    username: searchInfo.value.userName,
    nickname: searchInfo.value.nickName,
    phone: searchInfo.value.phone,
    email: searchInfo.value.email,
  });
  userList.value = formatUserList(res);
  total.value = res.data.total;
};

// 查询
const onSubmit = async () => {
  tableLoading.value = true;
  // 已经在函数里赋值搜索内容
  await fetchTableData();
  tableLoading.value = false;
};

// 重置
const onReset = async () => {
  searchInfo.value = {
    userName: "",
    nickName: "",
    phone: "",
    email: "",
  };
  await fetchTableData();
};

// 校验函数
const validateUserForm = (formRef) => {
  return new Promise((resolve) => {
    formRef.validate(resolve); // 直接使用 resolve 作为回调，// 返回校验结果 (true/false)
  });
};

// 新增用户，注意密码是字符串，不是数字
const onClickAdd = async () => {
  drawerChange.value = true;
  operationType.value = "addUser";
  await nextTick();
  userFormRef.value.clearValidate();
  // 这里用实例用户名无法重置完全，原因：条件渲染字段 (userName/passWord 只在operationType是 addUser 时显示)
  userFormRef.value.resetFields();
  InitUserForm(); //这个方法会清除表格行数据(编辑赋值)
  // 以下这个写法是错的，直接替换了整个 userForm.value 对象
  // userForm.value = {
  //   userName: "",
  //   passWord: "",
  //   headerImg: "",
  // };
};

// 新增确定按钮
const handleSubmitAdd = async () => {
  // 调用验证函数
  const isValid = await validateUserForm(userFormRef.value);
  if (!isValid) return;
  userForm.value.authorityId = computed(() => {
    if (userForm.value.authorityIds.length === 1) {
      return userForm.value.authorityIds[0]; // 如果只有一个元素，返回该元素的值
    } else {
      return 888;
    }
  });
  // 发送请求
  const resAdmin = await adminRegister({
    // 表单数据双向绑定
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
  ElMessage({ message: resAdmin.msg, type: resAdmin.code === 0 ? "success" : "error" });
  if (resAdmin.code == 0) {
    const res = await getUserList({ page: 1, pageSize: 10, username: "", nickname: "", phone: "", email: "" });
    userList.value = formatUserList(res);
  }
  userFormRef.value.resetFields();
};

// 表格编辑操作
const onClickEdit = async (row) => {
  drawerChange.value = true;
  operationType.value = "editUser";
  userForm.value = cloneDeep(row); // 赋值，直接引用表格行对象，直接修改表格数据，而不是创建副本。
  await nextTick();
  userFormRef.value.clearValidate();
};

// 表格编辑提交
const handleSubmitEdit = async () => {
  // 调用校验函数
  const isValid = await validateUserForm(userFormRef.value);
  if (!isValid) return;
  const res = await setUserInfo({
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
  ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
  // 这里两个res的作用域不同，不会发生冲突
  if (res.code == 0) {
    const res = await getUserList({ page: 1, pageSize: 10, username: "", nickname: "", phone: "", email: "" });
    userList.value = formatUserList(res);
    drawerChange.value = false;
  }
};

// 表格重置密码
const onClickReset = async (row) => {
  ElMessageBox.confirm("是否将此用户密码重置为123456?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await resetPassword({ id: row.ID });
      ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
    })
    .catch(() => {
      ElMessage({ message: "已取消重置!", type: "info" });
    });
};

// 表格删除操作
const onClickDelete = async (row) => {
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const resDelete = await deleteUser({ id: row.ID });
      ElMessage({ message: resDelete.msg, type: resDelete.code === 0 ? "success" : "error" });
      if (resDelete.code == 0) {
        const res = await getUserList({ page: 1, pageSize: 10, username: "", nickname: "", phone: "", email: "" });
        userList.value = formatUserList(res);
      }
    })
    .catch(() => {
      ElMessage({ type: "info", message: "已取消删除" });
    });
};

// 计算是否有选中的图片 selected属性
const hasSelected = computed(() => {
  return uploadPicFile.value.some((item) => item.selected);
});

// 点击图片切换选中状态,item是 uploadPicFile 数组中每个元素的代表。
const toggleImageSelection = (item) => {
  item.selected = !item.selected; // 切换选中状态
  userForm.value.headerImg = item.url; //赋值给上一个抽屉的表单
};

// 点击“选定”按钮的处理函数
const handleConfirmSelection = () => {
  drawerUpload.value = false;
  ElMessage.success("头像已选定");
};

// 上传图框
const openClickUpload = async () => {
  drawerUpload.value = true;
  ElMessage({ type: "error", message: `权限不足` });
  dialogTitle.value = "媒体库 | 点击“文件名”可以编辑，选择的类别即是上传的类别";
  const res = await getFileList({ page: page.value, pageSize: pageSize.value, keyword: null, classId: 0 });
  totalUploadPic.value = res.data.total;
  uploadPicFile.value = res.data.list;
  await getCategoryList();
};

// 表格选择器勾选，emitPath: true 会返回完整的路径数组，导致返回的是嵌套数组authorityIds  [[888], [9528]]。
// 设置了 emitPath: false，所以返回的是扁平数组 authorityIds [888, 9528]。
const handleAuthorityChange = async (row) => {
  await setUserInfo({ ID: row.ID, authorityIds: row.authorityIds });
};

// 表格开关,用 row.enable 判断状态。错误的 userForm.value.enable。
const switchEnable = (row) => {
  ElMessage({
    type: "success",
    message: row.enable === 2 ? `禁用成功` : `启用成功`,
  });
};

// 搜索图片keyword
const searchPic = async () => {
  const res = await getFileList({ page: page.value, pageSize: pageSize.value, keyword: keyword.value, classId: 0 });
  uploadPicFile.value = res.data.list;
  totalUploadPic.value = res.data.total;
};

// 点击图片上传按钮触发上传，uploadRef实例关联上传按钮和<upload组件>
// 通过uploadRef实例访问 <el-upload> 组件的 DOM，找到其内部的 <input type="file"> 并模拟点击
const triggerUpload = async () => {
  uploadRef.value.$el.querySelector("input").click();
};

// 限制文件类型和大小
const beforeUpload = (file) => {
  // file.type 是文件对象的属性，"image/jpeg"、"image/png"、"application/pdf" 等
  // 所有图片文件都是二进制的
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

const handleUpload = async (options) => {
  let file;

  // 1. 处理传入的 file（可能是 Blob URL 或 File 对象）
  if (typeof options.file === "string" && options.file.startsWith("blob:")) {
    // 1.1 如果是 Blob URL，先转换成 Blob
    const response = await fetch(options.file);
    const blob = await response.blob();
    // 1.2 转换成 File 对象（File 继承自 Blob，可以直接上传）
    file = new File([blob], "uploaded_image.png", { type: blob.type });
  } else {
    // 1.3 如果已经是 File 对象（如 `<input type="file">` 选择的文件），直接使用
    file = options.file;
  }

  // 2. 生成预览（可选）
  const imageUrl = URL.createObjectURL(file);
  const newImage = {
    ID: uploadPicFile.value.length + 1,
    url: imageUrl,
    name: file.name,
    selected: false,
  };
  URL.revokeObjectURL(imageUrl); // 释放内存
  uploadPicFile.value.push(newImage);

  // 3. 调用上传 API，参数格式：{ classId: 0, file: binaryData }
  const res = await upload(0, file); // 直接传对象，符合 API 要求
  ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
  if (res.code === 0) {
    totalUploadPic.value += 1;
  }
};

// 删除图片
const deleteImage = (item) => {
  ElMessageBox.confirm("是否删除该文件", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteFile({
        id: item.ID,
        classId: item.classId,
        key: item.key,
        name: item.name,
        tag: item.tag,
        url: item.url,
      });
      ElMessage({ message: res.msg, type: res.code === 0 ? "success" : "error" });
    })
    .catch(() => {
      ElMessage({ type: "info", message: "已取消删除" });
    });
};

// 扫码上传
// h一个用于创建虚拟 DOM 节点的函数，通常在 Vue 3 中使用。
// 它代表 "hyperscript" 或 "createElement" 的简写。
// 这个函数被用来在 Vue 3 中以编程的方式构建组件的结构和内容。
const scanUploadFunc = async () => {
  ElMessageBox.confirm(
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
  )
    // 要执行逻辑
    .catch(() => {
      ElMessage({ type: "info", message: "已取消上传" });
    });
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

.upload-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 图片自适应容器 */
  border-radius: 4px;
}

.image-list {
  display: flex;
  flex-wrap: wrap; /* 自动换行 */
  gap: 10px; /* 图片之间的间距 */
  margin-top: 10px; /* 与按钮的间距 */
}

.image-item {
  width: 100px;
  height: 100px;
}

/* 以下决定delete图标在图片右上方 */
.delete-icon {
  /* 绝对定位是将元素相对于其最近的定位父元素进行定位，
  无视文档流顺序 ，不会占据空间，其他元素会出现在它的位置 */
  position: absolute;
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

.add-btn {
  margin-top: 20px;
  margin-bottom: 20px;
}

.upload-aside-text {
  display: flex;
  justify-content: center;
  font-size: small; /* 或可以根据需要具体定义为 fontsize: 12px; */
  margin-top: 15px;
  font-weight: lighter;
  width: 20% !important; /* 将 width 属性也放入类中 */
}

.search-img {
  width: 280px;
  height: 28px;
}

.search-btn {
  height: 28px;
  margin-left: 10px;
}

.button-group {
  margin-top: 20px;
  display: flex; /* 启用 Flex 布局，让子元素（按钮）排列在一行 */
  flex-wrap: nowrap; /* 禁止换行 */
}
</style>
