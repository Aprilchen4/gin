<template>
  <div
    style="display: flex; justify-content: space-between; align-items: center"
  >
    <el-input placeholder="筛选" v-model="searchText" style="width: 380px" />
    <el-button type="primary" @click="authorityButt">确定</el-button>
  </div>
  <el-tree
    style="max-width: 600px"
    :data="filteredTreeData"
    show-checkbox
    node-key="ID"
    default-expand-all
    :default-checked-keys="defaultCheckedKeys"
    :props="defaultProps"
    @check="handleCheckChange"
  >
    <template #default="{ node, data }">
      <span>{{ node.label }}</span>
      <el-button
        v-if="isChecked(data.ID)"
        link
        type="success"
        size="small"
        :style="isHomePage(data) ? { color: '#ff7f00' } : {}"
        @click.stop="handleSetHome(data)"
      >
        {{ isHomePage(data) ? "首页" : "设为首页" }}
      </el-button>
    </template>
  </el-tree>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import {
  getBaseMenuTree,
  getMenuAuthority,
  updateAuthority,
  addMenuAuthority,
} from "@/api/user";
import { defineProps } from "vue";

const defaultProps = {
  children: "children",
  label: (data) => data.meta.title,
  disabled: (data) => isHomePage(data),
};

const authorityMenuTree = reactive({ values: [] });
const authorityMenu = reactive({ values: [] });
const homePageId = ref(1);
const searchText = ref("");

const props = defineProps({ authorityForm: Object });

watch(
  () => props.authorityForm.authorityId,
  async (id) => {
    if (!id) return;
    const [menuRes, authRes] = await Promise.all([
      getBaseMenuTree(),
      getMenuAuthority({ authorityId: id }),
    ]);
    authorityMenuTree.values = menuRes.data.menus;
    authorityMenu.values = authRes.data.menus;
  },
  { immediate: true }
);

// 处理复选框变化,el-tree 的选中状态并不会自动同步到 authorityMenu.values
// checkedNodes是@check 事件的回调函数接收的参数：
// JavaScript 的 链式调用（Chaining），flatMap 返回扁平化后的数组，因此可以直接在后面接 .filter()。
const handleCheckChange = (checkedNodes, { checkedKeys }) => {
  // 更新 authorityMenu.values 为当前选中的节点
  authorityMenu.values = authorityMenuTree.values
    .flatMap((menu) => [menu, ...(menu.children || [])])
    .filter((node) => checkedKeys.includes(node.ID));
};

// 选中菜单
const defaultCheckedKeys = computed(() => {
  return authorityMenu.values.map((item) => Number(item.ID)) || [];
});
// 新增计算属性：检查当前节点是否被选中
const isChecked = (ID) => defaultCheckedKeys.value.includes(ID);

// 判断是否是首页,data是<el-tree> 组件在渲染自定义节点时提供的
const isHomePage = (data) => data.ID === homePageId.value;

// 处理“设为首页”点击事件
// 这里 data 是由 Element Plus 的 <el-tree> 组件在渲染自定义节点时提供的。
const handleSetHome = async (data) => {
  if (!isHomePage(data)) {
    await updateAuthority({
      AuthorityName: props.authorityForm.authorityName,
      authorityID: props.authorityForm.authorityId,
      parentId: props.authorityForm.parentId,
      defaultRouter: data.name,
    });
    homePageId.value = data.ID;
    ElMessage({ type: "success", message: "设置成功" });
  }
};
// 选中菜单提交.虽然 authorityMenu 是响应式的（用 reactive 包裹），
// 但 el-tree 的选中状态并不会自动同步到 authorityMenu.values
const authorityButt = () => {
  addMenuAuthority({
    authorityId: props.authorityForm.authorityId,
    menus: authorityMenu.values,
  });
};

// 筛选树形结构绑定数据
const filteredTreeData = computed(() => {
  // 无搜索内容时返回原始数据
  if (!searchText.value.trim()) return authorityMenuTree.values;

  // 通过 toLowerCase() 将其转换为小写存储到 keyword 中。实现大小写不敏感的搜索
  const keyword = searchText.value.toLowerCase();

  // 递归筛选节点，filteredTreeData 计算属性的一部分，用于递归筛选树形结构数据
  // nodes（节点数组）
  const filterNodes = (nodes) =>
    nodes
      .filter(
        // 一个回调函数，对每个 node 判断是否保留
        (node) =>
          node.meta?.title?.toLowerCase().includes(keyword) ||
          // 递归调用 filterNodes，对子节点数组进行筛选
          // .length：检查筛选后的子节点数组是否非空（长度 > 0 表示有匹配的子节点）
          // 逻辑：如果子节点中有任何匹配，即使当前节点标题不匹配，也保留该节点。
          (node.children && filterNodes(node.children).length)
      )
      // 对筛选后的节点数组使用 map 方法，构造新的节点对象
      // 返回一个新数组，每个节点保持原有属性，并更新其 children 属性。
      .map((node) => ({
        // ...node,保留节点的所有原始属性
        ...node,
        // 三元表达式：如果 node.children 存在，则递归调用 filterNodes 处理子节点；否则设为 undefined。
        children: node.children ? filterNodes(node.children) : undefined,
      }));

  return filterNodes(authorityMenuTree.values);
});
</script>

<style></style>
