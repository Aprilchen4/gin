<template>
  <el-cascader :options="menuPathData" style="width: 320px" placeholder="请选择文件路径" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import pathInfo from "@/utils/pathInfo.json";

const menuPathData = ref([]);

onMounted(() => {
  menuPathData.value = convertToCascaderOptions(pathInfo);
});

// 按层级构建一个树状结构
// 参数的键是路径（像 'src/folder/file'），值是标签（比如 '文件描述'）。
// 把每个路径按 '/' 分割成部分（比如 ['src', 'folder', 'file']）。
// 如果路径以 'src' 开头，就跳过 'src'，从下一级开始处理。
function convertToCascaderOptions(data) {
  const result = []; // 最终的树状结构

  // 遍历输入数据的每个路径和标签
  for (const path in data) {
    const label = data[path]; // 获取路径对应的标签
    const parts = path.split("/").filter((part) => part); // 分割路径并去掉空部分

    // 如果路径以 'src' 开头，跳过它
    const startIndex = parts[0] === "src" ? 1 : 0;

    let currentLevel = result; // 从顶层开始构建

    // 逐层处理路径的每个部分
    for (let i = startIndex; i < parts.length; i++) {
      const part = parts[i];

      // 查找当前层是否有这个节点
      let node = currentLevel.find((item) => item.value === part);

      // 如果没找到，创建一个新节点
      if (!node) {
        node = {
          value: part,
          label: part, // 默认用路径部分作为标签
          children: [], // 初始有子节点数组
        };
        currentLevel.push(node); // 加到当前层
      }

      // 如果是路径最后一部分，设置最终标签并移除 children
      if (i === parts.length - 1) {
        node.label = label;
        delete node.children;
      } else {
        // 否则继续往下一层走
        currentLevel = node.children;
      }
    }
  }

  return result;
}
</script>
