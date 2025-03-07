<template>
    <button class="mode">hello test</button>
</template>

<style>
.mode{
    font-weight: bold;
    color:rgb(255, 0, 140)
}
</style>
<!-- <template>
    <div>
      <p>{{ userName }}</p>
      <p>{{ userName }}</p>
      <button @click="updateUserName1">Change Name</button>
      <button @click="updateUserName2">Change Name2</button>
    </div>
</template>
   
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

// 获取 Vuex store
const store = useStore();

// 映射 userName 到计算属性
// 定义了 doubleName 在 Vuex 的 getters 中，
// 但在 <script setup> 中你没有将它映射到计算属性中，因此它没有正确响应。
const userName = computed(() => store.state.userName);
// const doubleName = computed(() => store.getters.doubleName);

// 触发 changeUserName action
const updateUserName1 = () => {
    store.dispatch('updateUserName', '仪表盘');
};
const updateUserName2 = () => {
    store.dispatch('updateUserName', '角色管理');
};
</script> -->

<!-- <div>
    <el-menu-item>
        <template #title>
            <a href = "https://www.gin-vue-admin.com/" class="web" target="_blank"><el-icon><Discount /></el-icon>官方网站</a>
        </template>
    </el-menu-item>
    <el-menu-item index="仪表盘">
        <template #title><el-icon><Odometer /></el-icon>仪表盘</template>
    </el-menu-item>
    <el-sub-menu index="超级管理员">
        <template #title><el-icon><user/></el-icon>超级管理员</template>
            <el-menu-item index="角色管理"><el-icon><UserFilled /></el-icon>角色管理</el-menu-item>
            <el-menu-item index="菜单管理"><el-icon><Document /></el-icon>菜单管理</el-menu-item>
    
    </el-sub-menu>
</div>   -->