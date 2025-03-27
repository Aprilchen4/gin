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
    <el-button type="primary" @click="apisButt">确定</el-button>
  </div>
  <div>
    <el-tree
      style="max-width: 600px"
      :data="apiTreeDatas"
      show-checkbox
      node-key="path"
      default-expand-all
      highlight-current
      :default-checked-keys="defaultCheckedKeys"
      :props="apiDefaultProps"
      :filter-node-method="filterNode"
      @check="handleApiChange"
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
import {
  getAllApis,
  getPolicyPathByAuthorityId,
  updateCasbin,
} from "@/api/user";
import { reactive, ref, watch, computed } from "vue";
import { defineProps } from "vue";

const apiTreeDatas = ref([]); // 使用 ref 让 apiTreeDatas 响应式
// 输入框的筛选值
const filterTextName = ref("");
const filterTextPath = ref("");
const allApis = reactive({
  values: [], // 初始化 values 数组
});
const authorityApi = reactive({
  values: [], // 初始化 values 数组
});

// 在 apiDefaultProps 中明确告诉 <el-tree>：“请把每个节点对象中的 apis 字段当作子节点数组来处理。
// children是一个约定，你可以用 apiDefaultProps 自定义映射。
const apiDefaultProps = {
  label: "description", // flatToTree 中的字段名一致
  children: "apis", // apis是原始数据的106个节点，children是默认字段，
};

const props = defineProps({
  authorityForm: Object,
});

// watch 用于监听 props.authorityForm.authorityId 的变化，
watch(
  () => props.authorityForm.authorityId,
  async (id) => {
    const [response, resAuthorityApi] = await Promise.all([
      getAllApis(),
      getPolicyPathByAuthorityId({ authorityId: id }),
    ]);

    allApis.values = response.data.apis;
    apiTreeDatas.value = flatToTree(allApis.values);
    authorityApi.values = resAuthorityApi.data.paths;
  },
  { immediate: true }
);

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

// 切换选中的Api
const handleApiChange = (checkedNodes, { checkedKeys }) => {
  // 更新 authorityMenu.values 为当前选中的节点
  authorityApi.values = apiTreeDatas.value
    .flatMap((menu) => [menu, ...(menu.children || [])]) // 扁平化树结构
    .filter((node) => checkedKeys.includes(node.path)); // 过滤出选中的节点
};
// const handleApiChange = (checkedNodes, { checkedKeys }) => {
//   authorityApi.values = allApis.values.filter((api) =>
//     checkedKeys.includes(api.path)
//   );
// };

// 选中Api
const defaultCheckedKeys = computed(() => {
  // || [] 的短路求值只能在整个表达式为 undefined 或 null 时生效。
  // 如果 authorityApi.values 是 undefined，.map() 仍然会抛出错误
  // return authorityApi.values.map((item) => item.path) || [];
  return (authorityApi.values || []).map((item) => item.path); //注意这里.path和node-key="path"保持一致
});

// 提交确定选中的Api
const apisButt = () => {
  updateCasbin({
    authorityId: props.authorityForm.authorityId,
    casbinInfos: authorityApi.values,
  });
};
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
