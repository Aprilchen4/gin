<template>
  <div>
    <el-checkbox-group v-model="localSelectedItems">
      <!-- 使用 el-collapse 包裹树状数据 -->
      <el-collapse v-model="activeNames">
        <!-- 遍历树状数据 -->
        <div
          v-for="treeData in treeDatas"
          :key="treeData.menuId"
          class="checkbox-item"
        >
          <!-- 有子项目的节点：使用 el-collapse-item -->
          <el-collapse-item
            v-if="treeData.children && treeData.children.length"
            :name="treeData.menuId"
          >
            <!-- 父级 checkbox 和自定义折叠图标 -->
            <template #title>
              <div class="parent-item">
                <!-- 自定义折叠图标 -->
                <span
                  class="toggle-icon"
                  :class="{
                    'is-expanded': activeNames.includes(treeData.menuId),
                  }"
                >
                  ▶
                </span>
                <!-- 父级 checkbox -->
                <el-checkbox
                  :label="treeData.meta.title"
                  :disabled="isCheckboxDisabled(treeData)"
                >
                  {{ treeData.meta.title }}
                  <el-button
                    link
                    type="success"
                    size="small"
                    :disabled="isHomeButtonDisabled(treeData)"
                    @click.stop="handleClickFirst(treeData)"
                  >
                    {{ isHomePage(treeData) ? "首页" : "设为首页" }}
                  </el-button>
                </el-checkbox>
              </div>
            </template>

            <!-- 子项目 -->
            <div class="nested">
              <checkboxTree
                :treeDatas="treeData.children"
                :selectedItems="selectedItems"
              />
            </div>
          </el-collapse-item>

          <!-- 没有子项目的节点：直接渲染 checkbox -->
          <el-checkbox
            v-else
            :label="treeData.meta.title"
            :disabled="isCheckboxDisabled(treeData)"
          >
            {{ treeData.meta.title }}
            <el-button
              link
              type="success"
              size="small"
              :disabled="isHomeButtonDisabled(treeData)"
              @click.stop="handleClickFirst(treeData)"
            >
              {{ isHomePage(treeData) ? "首页" : "设为首页" }}
            </el-button>
          </el-checkbox>
        </div>
      </el-collapse>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, onMounted, watch } from "vue";

const emit = defineEmits(["update:selectedItems"]);

const props = defineProps({
  treeDatas: {
    type: Array,
    required: true,
  },
  selectedItems: {
    type: Array,
    required: true,
  },
});

// 控制折叠面板的展开项
const activeNames = ref([]);
// 跟踪首页的 menuId
const homePageId = ref(null);
// 本地响应式变量，用于管理选中项
const localSelectedItems = ref([...props.selectedItems]);

// 递归收集所有节点的 title
const collectAllTitles = (treeData) => {
  let titles = [];
  treeData.forEach((item) => {
    titles.push(item.meta.title);
    if (item.children && item.children.length) {
      titles = titles.concat(collectAllTitles(item.children));
    }
  });
  return titles;
};

// 初始化时设置默认全选
onMounted(() => {
  if (props.selectedItems.length === 0) {
    const allTitles = collectAllTitles(props.treeDatas);
    localSelectedItems.value = allTitles;
    emit("update:selectedItems", allTitles);
  } else {
    localSelectedItems.value = [...props.selectedItems];
  }

  // 默认将包含“仪表盘”的节点设为首页
  const dashboardNode = findDashboardNode(props.treeDatas);
  if (dashboardNode) {
    homePageId.value = dashboardNode.menuId;
  }
});

// 当本地选中项变化时，通知父组件
watch(
  localSelectedItems,
  (newVal) => {
    emit("update:selectedItems", newVal);
  },
  { deep: true }
);
// 判断是否是首页
const isHomePage = (treeData) => {
  return treeData.menuId === homePageId.value;
};

// 判断按钮是否禁用
const isHomeButtonDisabled = (treeData) => {
  return isHomePage(treeData);
};

// 判断 checkbox 是否禁用
const isCheckboxDisabled = (treeData) => {
  return isHomePage(treeData);
};

// 递归查找包含“仪表盘”的节点
const findDashboardNode = (treeData) => {
  for (const item of treeData) {
    if (item.meta.title.includes("仪表盘")) {
      return item;
    }
    if (item.children && item.children.length) {
      const found = findDashboardNode(item.children);
      if (found) return found;
    }
  }
  return null;
};

// 处理设为首页点击事件
const handleClickFirst = (treeData) => {
  if (!isHomePage(treeData)) {
    homePageId.value = treeData.menuId;
    console.log(`${treeData.meta.title} 被设为首页`);
  }
};
</script>

<style scoped>
.checkbox-item {
  margin-bottom: 8px;
}

.parent-item {
  display: flex;
  align-items: center;
}

/* 隐藏默认的折叠箭头 */
:deep(.el-collapse-item__header) .el-icon {
  display: none;
}

/* 自定义折叠图标 */
.toggle-icon {
  margin-right: 8px;
  cursor: pointer;
  font-size: 12px;
  transition: transform 0.2s;
}

/* 展开时旋转为向下 */
.toggle-icon.is-expanded {
  transform: rotate(90deg);
}

.nested {
  margin-left: 20px; /* 子级缩进 */
}

/* 自定义选中时的文字颜色 */
:deep(.el-checkbox__label) {
  color: #000 !important; /* 默认黑色 */
}

/* 确保选中时文字颜色不变 */
:deep(.el-checkbox.is-checked .el-checkbox__label) {
  color: #000 !important; /* 选中时保持黑色 */
}
/* 首页按钮的字体颜色改为橘色 */
:deep(.el-button.is-disabled) {
  color: #ff7f00 !important; /* 橘色，可以调整具体的色值 */
}
</style>
