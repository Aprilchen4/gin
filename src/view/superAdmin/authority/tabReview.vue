<template>
  <div class="container">
    <el-tabs
      v-model="activeAuthorityTab"
      type="border-card"
      @tab-click="tabClickAuthority"
    >
      <el-tab-pane label="角色菜单">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          "
        >
          <el-input placeholder="筛选" style="width: 380px" />
          <el-button type="primary">确定</el-button>
        </div>
        <div>
          <checkboxTree
            :treeDatas="sideDates.values"
            v-model:selectedItems="selectedItems"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="角色api">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <el-input placeholder="筛选" style="width: 380px" />
          <el-button type="primary">确定</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资源权限">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <el-input placeholder="筛选" style="width: 380px" />
          <el-button type="primary">确定</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { getMenu } from "@/api/user";
import { useStore } from "vuex";
import checkboxTree from "@/view/superAdmin/authority/checkboxTree.vue";
const selectedItems = ref([]);
const store = useStore();

const sideDates = reactive({
  values: [], // 初始化 values 数组
});

const tabClickAuthority = (tab) => {
  console.log("Tab小标签页", tab.props.label); // 检查事件是否触发
  store.commit("setAuthorityTab", tab);
};

getMenu().then((a) => {
  console.log("侧边栏数据:", a.data.menus);
  sideDates.values = a.data.menus; // 将 a.data.menus 的内容添加到 sideData,使用 ... 将 a.data.menus 数组中的每个元素“展开”
  console.log("uuuuuyyyttt", sideDates.values); //这里是异步函数,
});
</script>

<style></style>
