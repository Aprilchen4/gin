<template>
  <div style="display: flex; justify-content: space-between; align-items: center">
    <el-input placeholder="筛选" v-model="searchText" style="width: 380px" />
    <el-button type="primary" @click="authorityButt">确定</el-button>
  </div>
  <!-- check属性点击节点复选框触发 -->
  <el-tree
    :data="filteredTreeData"
    show-checkbox
    node-key="ID"
    default-expand-all
    :default-checked-keys="defaultCheckedKeys"
    :props="defaultProps"
    @check="handleCheckChange"
  >
    <!-- node是树节点对象；data是：data的原始数据中的一项，未经 el-tree 加工，分离了组件逻辑（node）和业务数据（data），提高灵活性和可维护性-->
    <template #default="{ node, data }">
      <span>{{ node.label }}</span>
      <!-- 加if条件，如果选中（检查）显示按钮 -->
      <el-button
        v-if="isChecked(data.ID)"
        link
        type="success"
        size="small"
        :style="isHomePage(data) ? { color: '#ff7f00 !important' } : {}"
        @click.stop="handleSetHome(data)"
      >
        <!--:style Vue 的动态样式绑定语法，接受一个对象，对象的键是 CSS 属性-->
        {{ isHomePage(data) ? "首页" : "设为首页" }}
      </el-button>
    </template>
  </el-tree>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { getBaseMenuTree, getMenuAuthority, updateAuthority, addMenuAuthority } from "@/api/user";
import { defineProps } from "vue";

const authorityMenuTree = reactive({ values: [] });
const authorityMenu = reactive({ values: [] });
const homePageId = ref(1);
const searchText = ref("");

// 父组件传入的数据，用于控制权限
const props = defineProps({ authorityForm: Object });

const defaultProps = {
  children: "children",
  label: (data) => data.meta.title,
  disabled: (data) => isHomePage(data),
};

watch(
  () => props.authorityForm.authorityId, // 数字
  async (id) => {
    if (!id) return;
    // 解构赋值 和 Promise.all 的功能
    const [menuRes, authRes] = await Promise.all([getBaseMenuTree(), getMenuAuthority({ authorityId: id })]);
    authorityMenuTree.values = menuRes.data.menus; //全部数据
    authorityMenu.values = authRes.data.menus; //选中数据
  },
  { immediate: true }
);

// 处理复选框变化,el-tree 的选中状态并不会自动同步到 authorityMenu.values
// checkedNodes是@check 事件的回调函数接收的参数：checkedKeys是选中状态对象的属性
// JavaScript 的 链式调用（Chaining），flatMap 返回扁平化后的数组，因此可以直接在后面接 .filter()。
const handleCheckChange = (checkedNodes, { checkedKeys }) => {
  // 先扁平化后过滤，更新 authorityMenu.values 为当前选中的节点
  authorityMenu.values = authorityMenuTree.values
    .flatMap((menu) => [menu, ...(menu.children || [])])
    .filter((node) => checkedKeys.includes(node.ID)); //返回所有被选中（即 ID 在 checkedKeys 中）的节点
};

// 选中菜单 新增计算属性：检查当前节点是否被选中
const defaultCheckedKeys = computed(() => {
  return authorityMenu.values.map((item) => Number(item.ID)) || [];
});

// ：检查每次传入的 ID 是否在数组中。返回值：true（已选中）或 false（未选中）。
const isChecked = (ID) => defaultCheckedKeys.value.includes(ID);

// 判断是否是首页,data是<el-tree> 组件在渲染自定义节点时提供的
const isHomePage = (data) => data.ID === homePageId.value;

// 处理“设为首页”点击事件
// 这里 data 是由 Element Plus 的 <el-tree> 组件在渲染自定义节点时提供的。
const handleSetHome = async (data) => {
  if (!isHomePage(data)) {
    const res = await updateAuthority({
      AuthorityName: props.authorityForm.authorityName,
      authorityID: props.authorityForm.authorityId,
      parentId: props.authorityForm.parentId,
      defaultRouter: data.name,
    });
    homePageId.value = data.ID;
    ElMessage({ type: res.code == 0 ? "success" : "error", message: res.msg });
  }
};
// 选中菜单确定按钮提交.虽然 authorityMenu 是响应式的（用 reactive 包裹），
// 但 el-tree 的选中状态并不会自动同步到 authorityMenu.values,手动传参
const authorityButt = () => {
  addMenuAuthority({
    authorityId: props.authorityForm.authorityId,
    menus: authorityMenu.values,
  });
  // 这里源码也是手动写的
  ElMessage({ message: "菜单设置成功", type: "success" });
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

<style scoped>
/* .el-button--success
Element Plus 的按钮 成功状态（success） 的类名。
当你设置 type="success" 时，el-button 会自动添加这个类。
.is-link Element Plus 的 链接样式按钮 的类名。
当你设置 link 属性时，el-button 会添加这个类 */
:deep(.el-button--success.is-link) {
  color: #67c23a !important;
}
</style>
