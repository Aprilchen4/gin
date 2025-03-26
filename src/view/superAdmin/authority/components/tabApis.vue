<template>
  <div
    style="display: flex; justify-content: space-between; align-items: center"
  >
    <el-input
      placeholder="筛选名字"
      style="width: 380px"
      v-model="filterTextName"
    />
    <el-input
      placeholder="筛选路径"
      style="width: 380px; margin-left: 8px"
      v-model="filterTextPath"
    />
    <el-button type="primary">确定</el-button>
  </div>
  <div>
    <el-tree
      style="max-width: 600px"
      :data="apiTreeDatas"
      show-checkbox
      node-key="id"
      default-expand-all
      highlight-current
      :default-checked-keys="defaultCheckedKeys"
      :props="apiDefaultProps"
      :filter-node-method="filterNode"
    >
      <!-- 自定义节点内容 -->
      <template #default="{ data }">
        <div class="node-container">
          <span class="node-label">{{ data.label }}</span>
          <span class="node-path">{{ data.path }}</span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { getAllApis } from "@/api/user";
import { reactive, ref, onMounted } from "vue";
const allApis = reactive({
  values: [], // 初始化 values 数组
});
const apiTreeDatas = ref([]); // 使用 ref 让 apiTreeDatas 响应式
const defaultCheckedKeys = ref([]); // 改为 ref 而不是 computed

// 输入框的筛选值
const filterTextName = ref("");
const filterTextPath = ref("");

const apiDefaultProps = {
  label: "label", // flatToTree 中的字段名一致
  // 在 apiDefaultProps 中明确告诉 <el-tree>：“请把每个节点对象中的 apis 字段当作子节点数组来处理。
  // children是一个约定，你可以用 apiDefaultProps 自定义映射。
  children: "apis", // apis是原始数据的106个节点，children是默认字段，
};

// 平级数据转为树形结构
function flatToTree(data) {
  const groupMap = new Map();

  data.forEach((item) => {
    const groupName = item.apiGroup;
    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, []);
    }
    // 处理的是单个 API 对象。
    groupMap.get(groupName).push({
      id: item.ID,
      label: item.description,
      path: item.path,
    });
  });

  const tree = [];
  let idCounter = 200;
  groupMap.forEach((children, groupName) => {
    // 处理的是整个组（包括组名和子节点数组）。
    tree.push({
      id: ++idCounter,
      label: groupName + "组",
      apis: children,
    });
  });

  return tree;
}

// 初始化数据，使用 onMounted 钩子确保组件挂载后才请求数据
onMounted(async () => {
  const response = await getAllApis();
  allApis.values = response.data.apis; // 更新数据
  console.log("allApis.values:", allApis.values); // 检查数据
  apiTreeDatas.value = flatToTree(allApis.values); // 更新树形结构

  // 设置默认选中,这里不用computed，原因和用onMounted理由一致
  const allIds = apiTreeDatas.value
    .flatMap((group) => [group.id, ...group.apis.map((api) => api.id)])
    .filter(Boolean); // 包含父节点和子节点的 ID
  defaultCheckedKeys.value = allIds;
});
</script>

<style scoped>
.node-container {
  display: flex; /* 使用 flex 布局 */
  justify-content: space-between; /* 两端对齐：label 左，path 右 */
  width: 100%; /* 确保占满节点宽度 */
}

.node-path {
  color: #999; /* 可选：让 path 显示为灰色，区分 label */
  max-width: 200px; /* 限制 path 的最大宽度 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 用省略号表示被截断的内容 */
  white-space: nowrap; /* 防止换行 */
}
</style>
