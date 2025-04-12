<template>
  <div class="login-container">
    <div class="login-left">
      <!-- 左上 -->
      <div class="login-title">
        <el-image class="logo" :src="require('@/assets/logo1.png')"></el-image>
        <h2 class="login-word-one">Gin-Vue-Admin</h2>
        <div class="login-word-two">A management platform using Golang and Vue</div>
      </div>
      <!-- 左中 -->
      <div class="login-box">
        <el-form :model="form" :rules="rules" :inline="false">
          <!-- prop 是 Element UI 表单组件特有的一个属性绑定 -->
          <!-- 使用了 prop 属性进行绑定，"username" 是表单数据模型中的一个字段名称 -->
          <!-- 为了将这个表单项与表单数据模型中的 username 字段进行关联，让表单验证功能能够正常工作， -->
          <!-- 表单验证规则会根据 prop 属性来应用到对应的表单字段上 -->
          <el-form-item prop="username">
            <!-- v-model（数据）和prop（字段）不同，输入值直接绑定到了 form.username 这个数据属性上-->
            <!-- 一定是 form.username，仅password没关联上，代码不知道你password是哪个-->
            <el-input v-model="form.username" placeholder="请输入用户名" :suffix-icon="User" clearable>
              <!-- 好神奇的写法 :suffix-icon="User" 不可缺  -->
              <!-- <template #suffix> -->
              <el-icon><User /></el-icon>
              <!-- </template> -->
            </el-input>
          </el-form-item>
          <!-- 密码应使用 type="password" 隐藏输入内容。 -->
          <el-form-item prop="password">
            <el-input type="password" v-model="form.password" placeholder="请输入密码"> </el-input>
          </el-form-item>
          <!-- <el-form-item> 默认使用 Flex 布局，且子元素会 水平排列（flex-direction: row）。即使您在外层添加 verify-code 类，也会被默认样式覆盖。 -->
          <!-- 要么用！important强制修改form布局，要么写在div里面 -->
          <el-form-item prop="usercode" class="verify-code-item">
            <div class="verify-line">
              <el-input v-model="form.captcha" placeholder="请输入验证码" />
              <!-- 这里v-model要和script-data/setup的数据对应，否则报错 -->
              <!-- <div><VerifyCode/></div> -->
              <!-- v-if="picPath" 只有当 picPath 存在时，才会渲染 <img> 标签 -->
              <!--picPath 是 Vue 组件的一个变量，它存储了图片的路径或 Base64 数据，并绑定到 src 属性上 -->
              <img v-if="picPath" :src="picPath" class="captcha-image" @click="refreshCaptcha" />
              <div v-else class="captcha-placeholder">加载中...</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 左下 -->
      <el-form-item class="login-button">
        <div class="login-button">
          <el-button type="primary" @click="fetchData" class="el-button-login">登录</el-button>
          <router-view></router-view>
          <!-- 一点点对不齐，源于自带的位移，所以单独加div包裹块级元素 -->
          <div><el-button type="primary" class="el-button-login">前往初始化</el-button></div>
        </div>
      </el-form-item>
    </div>
    <!-- right还是要在login-container里面，否则不符合左右排列 -->
    <div class="right">
      <el-image class="picture-line" :src="require('@/assets/line.png')"></el-image>
      <el-image class="picture" :src="require('@/assets/hello world.jpg')"></el-image>
      <el-image class="picture-fill" :src="require('@/assets/fill.png')"></el-image>
      <!-- 最右侧否则填充不完全 -->
    </div>
  </div>
  <div class="bottomIcon">
    <div style="margin-right: 3px">Powered by</div>
    <a href="https://github.com/flipped-aurora/gin-vue-admin" class="bottom-a">Gin-Vue-Admin</a>
    <div class="icon-link">
      <!-- 颜色写在上一行里面，不行 -->
      <a href="https://www.gin-vue-admin.com/"
        ><el-icon color="#150202"><Document /></el-icon
      ></a>
      <a href="https://support.qq.com/product/371961"
        ><el-icon color="#150202"><Service /></el-icon
      ></a>
      <a href="https://github.com/flipped-aurora/gin-vue-admin"
        ><el-icon color="#150202"><Present /></el-icon
      ></a>
      <a href="https://space.bilibili.com/322210472"
        ><el-icon color="#150202"><Microphone /></el-icon
      ></a>
    </div>
    <div>Copyright</div>
    <a href="https://github.com/flipped-aurora" class="bottom-a">flipped-aurora团队</a>
  </div>
</template>

<script>
// setup写在script里面，后续内容直接定义变量，不需要多层包裹；
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElInput, ElButton } from "element-plus";
import { getCode, getlogin } from "@/api/user";
// useRouter 只能在 setup 函数或 <script setup> 中使用，是一个局部工具函数
// 每次在组件中使用 useRouter，都会返回当前的路由实例，即 router.js 中导出的 router
// 模块化：每个组件都可以独立访问路由实例，而不需要依赖全局变量。
// 灵活性：可以在不同的组件中使用不同的路由逻辑。

//export default 用于导出一个默认值
export default {
  components: {
    ElInput,
    ElButton,
    // VerifyCode,
  },

  //setup定义，method引用，this要加
  // 定义表单元素
  setup() {
    const form = ref({
      username: "admin",
      password: "123456",
      captchaId: "", // 验证码 ID
      // 验证码是手动输入的
      captcha: "",
      //bool类型
      openCaptcha: true,
    });

    // message: 当验证不通过时显示的错误提示信息。
    const rules = {
      username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      usercode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
    };

    //获取实例
    const router = useRouter();

    const fetchData = async () => {
      //浏览器-右键-检查-控制台
      // console.log(this.$refs.loginForm);这里会报错， Cannot read '$refs'；
      console.log("按钮点击成功，开始执行登录请求");
      // 返回的responsibl内容和打印的“登陆成功”在一块
      // 每次调用 getlogin 函数时，返回的 response 都是一个新的对象

      // 数据隔离：不同组件的 response 应该是独立的，避免数据污染。
      // 响应式更新：在 Vue 中，数据需要是响应式的，才能触发视图更新。
      const response = await getlogin(form.value);

      //token 在返回的内容里
      console.log("登录非常成功:", response);

      // 编程式导航，导航到目标页面
      // router.push({ path: "/ginmenu" });
      // router.push("/ginmenu").then(() => {
      //   window.location.reload(); // 强制刷新（不推荐长期使用）
      // });
      await router.push({ path: "/ginmenu" });

      // 延迟 100ms 触发 resize 事件，强制浏览器重新计算布局和渲染元素
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);

      // 假设返回的数据中有 token，存储在 localStorage
      // response.token 是响应对象中的一个字段，表示用户的身份验证令牌（Token）
      // 注意这里respons.token无返回值；数据结构
      localStorage.setItem("userToken", response.data.token);

      return true; // 登录成功

      // 当 Axios 请求发生错误时,错误信息会被传递到 catch 块中。
      // 此时,上层组件或页面（这里是request.js响应拦截器部分对错误进行分类），promise给catch反馈错误信息。

      // .then() 方法传入的函数就是请求成功时的回调函数,它会接收到服务器返回的响应数据。
      // .catch() 方法传入的函数就是请求失败时的回调函数,它会接收到错误对象。
    };

    //定义一个响应式变量，不能放在前面的component里面，那个是form表单
    const picPath = ref("");
    // 生成验证码组件
    // 1、发送请求 获得用于生成验证码的数据
    //then()是一个函数，函数内容是一个箭头函数，箭头函数需要花括号；
    //.then()相当于(async + await,解决异步:所有需要时间的步骤放到最后去执行；同步：不需要花时间的步骤，比如变量)
    // .then()是一个 异步操作，其背后依赖 Promise。
    // picPath.value ：ref需要.value来赋值；

    // .then() 方法传入的函数就是请求成功时的回调函数,它会接收到服务器返回的响应数据。
    // .catch() 方法传入的函数就是请求失败时的回调函数,它会接收到错误对象。
    getCode().then((a) => {
      picPath.value = a.data.picPath;
      //一定是form.格式
      form.value.captchaId = a.data.captchaId;
      console.log(picPath.value);
    });
    // 2. 使用数据生成验证码组件
    return { form, rules, fetchData, picPath };
  },
};
</script>

<style scoped>
html,
body,
#app {
  /* 确保 Vue 根容器也继承高度 */
  height: 100%;
  margin: 0;
  padding: 0;
  /* 意味着当内容的高度或宽度超出了元素的边界时，不会显示滚动条，也就禁止了页面的滚动 */
  overflow: hidden; /* 超出可视区域时不会显示滚动条 */
}

.login-container {
  /* overflow: hidden; 写这里没用，要写在父级 */
  display: flex;
  flex-direction: row;
}

.login-left {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 水平居中。默认主轴是水瓶 */
  text-align: center; /* 水平文本居中 */
  margin-bottom: 100px;
  margin-left: 160px;
  width: 500px;
  min-width: 40%;
}

.login-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo {
  width: 84px;
  height: 84px;
  margin-top: 60px;
}

.login-box {
  width: 300px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 4px;
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
}

.login-word-one {
  margin-top: 0px;
  margin-bottom: 5px;
}

.login-word-two {
  font-size: 12.25px;
}

/* 覆盖 el-form-item 的默认 flex 布局 */
.verify-code-item .el-form-item__content {
  display: block !important; /* 改为块级布局 */
}

.verify-line {
  display: flex;
  gap: 10px; /* 间距 */
  align-items: center; /* 垂直居中 */
}

/* 输入框+图片，限制在login-box的宽度 */
.captcha-image {
  width: 100px;
  height: 35px;
  cursor: pointer; /* 可点击刷新 */
}

.login-button {
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
}

/* 这里scoped，否则会影响全局样式 */
.el-button-login {
  width: 300px;
  height: auto;
  margin-top: 20px;
  background-color: #0059ff !important;
}

/* 提高优先级，明确指定 el-button */
:deep(.el-button.el-button--primary.el-button-login) {
  background-color: #0059ff !important;
  border-color: #0059ff !important;
  color: white !important;
}

/* login-box 内的输入框默认边框 */
.login-box :deep(.el-input__wrapper) {
  border: 1px solid #e5e6e8 !important; /* 默认边框颜色 */
}

/* login-box 内的输入框聚焦边框 */
.login-box :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #0059ff !important; /* 聚焦时深蓝色边框 */
}

.right {
  display: flex;
  align-items: center; /* 垂直居中 */
  height: 100vh;
  position: relative; /* 用于固定 picture 和 picture-fill */
  overflow: hidden; /* 防止内容溢出，防滚动 */
}

.picture-line {
  height: 100vh; /* 高度填满 */
  width: auto; /* 宽度自适应 */
  min-width: 150px; /* 最小宽度防止过小 */
  object-fit: cover;
  flex-shrink: 1; /* 允许缩放 */
}

.picture {
  width: 80%;
  height: 100vh;
  object-fit: cover;
}

.picture-fill {
  width: 20%;
  height: 100vh;
  object-fit: cover;
  /* flex-shrink: 0; 禁止缩放 */
}

.bottomIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px; /* 或者设置成你需要的高度 */
  background-color: none; /* 设置背景色 */
  color: #150202; /* 设置文字颜色 */
  font-size: 14px;
  font-family: "Microsoft YaHei", sans-serif; /* 微软雅黑 */
  /* 设置为绝对定位。这样容器就可以相对于它的定位父元素page进行定位。 */
  position: absolute !important; /*和右侧图片重叠,元素脱离正常文档流，相对最近的祖先css定位，这里没有祖先，相对于初始包含块（通常是视口）定位*/
  margin: 0 0px;
  bottom: 0; /*将其固定在页面底部*/
  /* left: 0; */
}

/* 底部图标格式 */
.icon-link {
  margin: 0 2px;
  font-size: 27px;
  /* color: #150202; 这里无法改变icon颜色*/
}

/* .bottom 元素下的所有直接子元素，设置上下边距为 0,左右边距为 10 像素 */
.bottom > * {
  margin: 0 10px;
}

/* 两个超链接的格式 */
.bottom-a {
  color: #0059ff !important;
  font-weight: bold;
  text-decoration: none;
}
.bottom-a:hover {
  color: #000cb6 !important;
}
</style>
