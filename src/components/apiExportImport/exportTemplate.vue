<!-- 核心功能
通过按钮点击触发Excel模板下载
动态拼接请求参数（查询条件、分页、排序等）
处理后端返回的下载链接
提供用户操作反馈（成功/错误提示） -->

<template>
  <el-button type="primary" icon="download" @click="exportExcelFunc">下载模板</el-button>
</template>

<script setup>
import { exportTemplate } from "@/api/exportTemplate.js";
import { defineProps } from "vue";
import { ElMessage } from "element-plus";

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

// 检查模板 ID（props.templateId）是否有效，如果无效则报错并终止。

// 构造请求参数（paramsCopy），并转换成 URL 查询字符串（key1=value1&key2=value2 格式）。

// 调用后端导出接口，传入模板 ID 和参数，获取下载链接。

// 自动触发浏览器下载（通过 window.open 打开返回的 URL）。
const exportExcelFunc = async () => {
  if (props.templateId === "") {
    ElMessage.error("组件未设置模板ID");
    return;
  }

  let baseUrl = process.env.VUE_APP_BASE_API || "";
  if (baseUrl === "/") {
    baseUrl = "";
  }

  // JSON.stringify(props.condition): 这个部分将 props.condition 对象转换成一个 JSON 字符串。这种方法可以用于将对象序列化为字符串。
  // JSON.parse(...): 这个部分将刚才得到的 JSON 字符串解析回 JavaScript 对象，从而实现了对象的拷贝。
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

  // 形成一个完整的查询字符串，用于在 URL 中传递参数：a=1&b=2
  // 将一个对象（paramsCopy）转换为 URL
  // 将对象 paramsCopy 转换为一个二维数组，每个子数组是 [key, value] 的形式。
  const params = Object.entries(paramsCopy)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  // 调用请求函数
  const res = await exportTemplate({
    templateID: props.templateId,
    params,
  });

  if (res.code === 0) {
    ElMessage.success("创建导出任务成功，开始下载");
    const url = `${baseUrl}${res.data}`;
    window.open(url, "_blank");
  }
};
</script>
