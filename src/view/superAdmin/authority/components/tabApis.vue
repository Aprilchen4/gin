<template>
  <div style="display: flex; justify-content: space-between; align-items: center">
    <el-input placeholder="筛选名字" style="width: 380px" v-model="filterTextName" />
    <el-input placeholder="筛选路径" style="width: 380px; margin-left: 8px" v-model="filterTextPath" />
    <el-button type="primary" @click="apisButt">确定</el-button>
  </div>
  <!--  -->
  <el-tree
    ref="apiTree"
    :data="apiTreeDatas"
    show-checkbox
    node-key="path"
    default-expand-all
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
</template>

<script setup>
import { getAllApis, getPolicyPathByAuthorityId, updateCasbin } from "@/api/user";
import { reactive, ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import { defineProps } from "vue";

const apiTree = ref(null); // 用于引用 <el-tree> 组件,为 <el-tree> 创建一个可操作的引用
const apiTreeDatas = ref([]); // 使用 ref 让 apiTreeDatas 响应式
const filterTextName = ref(""); // 输入框的筛选值
const filterTextPath = ref("");
const allApis = reactive({ values: [] }); // 初始化 values 数组
const authorityApi = reactive({ values: [] }); // 初始化 values 数组

// 在 apiDefaultProps 中明确告诉 <el-tree>：“请把每个节点对象中的 apis 字段当作子节点数组来处理。
// children是一个约定，你可以用 apiDefaultProps 自定义映射。
const apiDefaultProps = {
  label: "description", // flatToTree 中的字段名一致
  children: "apis", // apis是原始数据的106个节点，children是默认字段，
};

const props = defineProps({ authorityForm: Object });

// watch 用于监听 props.authorityForm.authorityId 的变化，
watch(
  () => props.authorityForm.authorityId,
  async (id) => {
    const [response, resAuthorityApi] = await Promise.all([
      getAllApis(),
      getPolicyPathByAuthorityId({ authorityId: id }),
    ]);
    // 全部数据
    allApis.values = response.data.apis;
    apiTreeDatas.value = flatToTree(allApis.values);
    authorityApi.values = resAuthorityApi.data.paths;
  },
  { immediate: true }
);

// 通过 watch 监听 filterTextName 或 filterTextPath 发生变化
// filter 是 Element Plus <el-tree> 组件提供的一个内置方法，filter 方法触发，<el-tree> 会对每个节点调用 filterNode
// apiTree.value是对树形组件的引用实例，
watch([filterTextName, filterTextPath], () => apiTree.value.filter());

// 平级数据转为树形结构
function flatToTree(data) {
  const groupMap = new Map();
  data.forEach((item) => {
    const groupName = item.apiGroup;
    if (!groupMap.has(groupName)) groupMap.set(groupName, []);
    // 处理的是单个 API 对象。
    groupMap.get(groupName).push({ id: item.ID, label: item.description, path: item.path });
  });

  const tree = [];
  let idCounter = 200;
  groupMap.forEach((children, groupName) => {
    // 处理的是整个组（包括组名和子节点数组）。
    tree.push({ id: ++idCounter, label: groupName + "组", apis: children });
  });
  return tree;
}

// 点击节点复选框之后触发
const handleApiChange = (checkedNodes, { checkedKeys }) => {
  // 更新 authorityMenu.values 为当前选中的节点
  authorityApi.values = apiTreeDatas.value
    .flatMap((menu) => [menu, ...(menu.apis || [])]) // 扁平化树结构
    .filter((node) => checkedKeys.includes(node.path)); // 过滤出选中的节点
};

// 计算属性选中Api，生成一个数组
const defaultCheckedKeys = computed(() => {
  // || [] 的短路求值只能在整个表达式为 undefined 或 null 时生效。
  // 如果 authorityApi.values 是 undefined，.map() 仍然会抛出错误
  return (authorityApi.values || []).map((item) => item.path); // 注意这里.path和node-key="path"保持一致
});

// 提交确定选中的Api
const apisButt = () => {
  updateCasbin({
    authorityId: props.authorityForm.authorityId,
    casbinInfos: authorityApi.values,
  });
  ElMessage({ message: "api设置成功", type: "success" });
};

// 筛选节点
// :filter-node-method 是 <el-tree> 组件的一个属性，
// 用于指定一个函数，该函数决定在筛选时哪些节点应该显示或隐藏。

// value：调用 filter 方法时传入的值（你的代码中未使用）。
// data：当前节点的数据对象，包含 label（描述）和 path（路径）等字段。
// apiTree.value.filter时会对每个节点调用 filterNode
const filterNode = (value, data) =>
  (!filterTextName.value || data.label.toLowerCase().includes(filterTextName.value.toLowerCase())) &&
  (!filterTextPath.value ||
    // ?. 防止 path 未定义
    data.path?.toLowerCase().includes(filterTextPath.value.toLowerCase()));
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
