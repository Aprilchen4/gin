<template>
  <div
    style="display: flex; justify-content: space-between; align-items: center"
  >
    <el-input placeholder="筛选" style="width: 380px" />
    <el-button type="primary" @click="authorityButt">确定</el-button>
  </div>
  <div>
    <el-tree
      style="max-width: 600px"
      :data="authorityMenuTree.values"
      show-checkbox
      node-key="ID"
      default-expand-all
      highlight-current
      :default-checked-keys="defaultCheckedKeys"
      :props="defaultProps"
      @check="handleCheckChange"
    >
      <!-- 自定义节点内容 -->
      <template #default="{ node, data }">
        <!-- 节点标签（包含复选框和文本） -->
        <span>{{ node.label }}</span>
        <!-- 设置首页按钮 -->
        <el-button
          v-if="isChecked(data.ID)"
          link
          type="success"
          size="small"
          :style="isHomePage(data) ? { color: '#ff7f00' } : {}"
          @click.stop="handleSetHome(data)"
        >
          <!--isHomePage(data) 返回 true，按钮上将显示 "首页"；如果返回 false，则显示 "设为首页"。 -->
          {{ isHomePage(data) ? "首页" : "设为首页" }}
        </el-button>
      </template>
    </el-tree>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { computed } from "vue";
import { ElMessage } from "element-plus";
import {
  getBaseMenuTree,
  getMenuAuthority,
  updateAuthority,
  addMenuAuthority,
} from "@/api/user";
import { defineProps } from "vue";
import { watch } from "vue";

const defaultProps = {
  children: "children",
  label: (data) => data.meta.title, // 使用函数动态返回 meta.title
  disabled: (data) => isHomePage(data), // 仅首页复选框禁用，只影响复选框
};

const authorityMenuTree = reactive({
  values: [], // 初始化 values 数组
});
const authorityMenu = reactive({
  values: [], // 初始化 values 数组
});
// 当前首页的 ID
const homePageId = ref(1);

// props传值，props 是只读的，defineProps 返回的对象是只读的响应式对象，而 toRefs 会尝试创建可写的 ref
//可以在子组件中使用 props.authorityId
const props = defineProps({
  authorityForm: Object,
});

// 监听 props.authorityForm.authorityId 的变化，并调用函数
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
    .flatMap((menu) => [menu, ...(menu.children || [])]) // 扁平化树结构
    .filter((node) => checkedKeys.includes(node.ID)); // 过滤出选中的节点
};

// 选中菜单
const defaultCheckedKeys = computed(() => {
  return authorityMenu.values.map((item) => Number(item.ID)) || [];
});

// 新增计算属性：检查当前节点是否被选中
const isChecked = (ID) => {
  return defaultCheckedKeys.value.includes(ID);
};

// 判断是否是首页,data是<el-tree> 组件在渲染自定义节点时提供的
const isHomePage = (data) => {
  return data.ID === homePageId.value;
};

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
    homePageId.value = data.ID; // 更新首页 ID，确保禁用和按钮文本同步
    console.log(`${data.meta.title} 被设为首页`);
  }
  ElMessage({ type: "success", message: "设置成功" });
};

// 选中菜单提交.虽然 authorityMenu 是响应式的（用 reactive 包裹），
// 但 el-tree 的选中状态并不会自动同步到 authorityMenu.values
const authorityButt = () => {
  addMenuAuthority({
    authorityId: props.authorityForm.authorityId,
    menus: authorityMenu.values,
  });
};
</script>

<style></style>
