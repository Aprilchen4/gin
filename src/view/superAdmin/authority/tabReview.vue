<template>
  <div
    style="display: flex; justify-content: space-between; align-items: center"
  >
    <el-input placeholder="筛选" style="width: 380px" />
    <el-button type="primary">确定</el-button>
  </div>
  <div>
    <el-tree
      style="max-width: 600px"
      :data="sideDates.values"
      show-checkbox
      node-key="menuId"
      default-expand-all
      highlight-current
      :default-checked-keys="defaultCheckedKeys"
      :props="defaultProps"
    >
      <!-- 自定义节点内容 -->
      <template #default="{ node, data }">
        <!-- 节点标签（包含复选框和文本） -->
        <span>{{ node.label }}</span>
        <!-- 设置首页按钮 -->
        <el-button
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
  </div>
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { getMenu } from "@/api/user";

const sideDates = reactive({
  values: [], // 初始化 values 数组
});
// 当前首页的 menuId
const homePageId = ref(1);

getMenu().then((a) => {
  sideDates.values = a.data.menus; // 将 a.data.menus 的内容添加到 sideData,使用 ... 将 a.data.menus 数组中的每个元素“展开”
  console.log("sideDates.values:", sideDates.values);
});
console.log("外面的sideDates.values:", sideDates.values); // 空的

const defaultProps = {
  children: "children",
  label: (data) => data.meta.title, // 使用函数动态返回 meta.title
  disabled: (data) => isHomePage(data), // 仅首页复选框禁用，只影响复选框
};

// 默认全选
const defaultCheckedKeys = computed(() => {
  return sideDates.values.map((item) => item.menuId);
});

// 判断是否是首页
const isHomePage = (data) => {
  return data.menuId === homePageId.value;
};

// 处理“设为首页”点击事件
const handleSetHome = (data) => {
  if (!isHomePage(data)) {
    homePageId.value = data.menuId;
    console.log(`${data.meta.title} 被设为首页`);
  }
  ElMessage({ type: "success", message: "设置成功" });
};
</script>

<style></style>
