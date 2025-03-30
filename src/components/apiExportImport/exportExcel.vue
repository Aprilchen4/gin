<template>
  <el-button type="primary" icon="download" @click="exportExcelFunc">导出</el-button>
</template>

<script setup>
// 导入请求函数
import { exportExcel } from "@/api/exportTemplate.js";
import { defineProps } from "vue";

const props = defineProps({
  templateId: {
    type: String,
    required: true,
  },
  condition: {
    type: Object,
    default: () => ({}),
  },
  limit: {
    type: Number,
    default: 0,
  },
  offset: {
    type: Number,
    default: 0,
  },
  order: {
    type: String,
    default: "",
  },
});

import { ElMessage } from "element-plus";

const exportExcelFunc = async () => {
  if (props.templateId === "") {
    ElMessage.error("组件未设置模板ID");
    return;
  }

  let baseUrl = process.env.VUE_APP_BASE_API || "";
  if (baseUrl === "/") {
    baseUrl = "";
  }

  // 将 props.condition 对象转换成一个 JSON 字符串
  // 将刚才得到的 JSON 字符串解析回 JavaScript 对象,从而实现拷贝对象
  const paramsCopy = JSON.parse(JSON.stringify(props.condition));
  if (props.limit) {
    paramsCopy.limit = props.limit;
  }
  if (props.offset) {
    paramsCopy.offset = props.offset;
  }
  if (props.order) {
    paramsCopy.order = props.order;
  }

  // 将一个对象（paramsCopy）转换为 URL
  const params = Object.entries(paramsCopy)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  // 调用请求
  const res = await exportExcel({
    templateID: props.templateId,
    params,
  });

  // 处理响应
  if (res.code === 0) {
    ElMessage.success("创建导出任务成功，开始下载");
    const url = `${baseUrl}${res.data}`;
    window.open(url, "_blank");
  }
};
</script>
