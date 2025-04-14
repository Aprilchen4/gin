<!-- 使用 <el-upload> 封装上传功能
:action：绑定后端接口地址（动态生成）
:headers：添加身份验证 token
:show-file-list="false"：隐藏已上传文件列表
:multiple="false"：禁止多文件上传
触发按钮：<el-button> 显示为带上传图标的"导入"按钮 -->

<template>
  <el-upload
    :action="url"
    :show-file-list="false"
    :on-success="handleSuccess"
    :multiple="false"
    :headers="{ 'x-token': token }"
  >
    <el-button type="primary" icon="upload" class="ml-3"> 导入 </el-button>
  </el-upload>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { defineProps, defineEmits } from "vue";

let baseUrl = process.env.VUE_APP_BASE_API || "";
const token = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null;
// on-success文件上传成功时的钩子
const emit = defineEmits(["on-success"]);

if (baseUrl === "/") {
  baseUrl = "";
}

const props = defineProps({
  templateId: {
    type: String,
    required: true,
  },
});

//  动态构建一个完整的API请求URL，用于文件导入功能
const url = `${baseUrl}/sysExportTemplate/importExcel?templateID=${props.templateId}`;

const handleSuccess = (res) => {
  if (res.code === 0) {
    ElMessage.success("导入成功");
    emit("on-success");
  } else {
    ElMessage.error(res.msg);
  }
};
</script>
