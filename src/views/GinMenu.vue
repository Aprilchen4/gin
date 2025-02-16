<template>
    <button class="p" @click="momo" >xixixi</button>
    <router-view></router-view>
</template>

// 一定要有setup,否则会提示momo未定义
<script setup>
    import { useRouter } from 'vue-router'
    const router = useRouter();

    function momo(){
        router.push({ path: "/test" })
    }
</Script>


<style>
.p{
    color: rgb(255, 127, 212);
    font-size: large;
    font-weight: bold;
}
</style>

