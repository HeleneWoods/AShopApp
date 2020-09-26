<template>
  <div>
    <van-nav-bar :title="msg" left-text="返回" left-arrow @click-left="goBackFn" />
    <van-field
      v-model="username"
      required
      clearable
      label="用户名"
      placeholder="请输入用户名"
      @click-right-icon="username=''"
      :error-message="userErr"
    />

    <van-field
      v-model="password"
      type="password"
      required
      clearable
      label="密码"
      placeholder="请输入密码"
      @click-right-icon="password=''"
      :error-message="passErr"
    />

    <van-field
      v-model="password2"
      type="password"
      required
      clearable
      label="重复密码"
      placeholder="请重复输入密码"
      @click-right-icon="password2=''"
      :error-message="passErr2"
    />

    <van-field v-model="describe" label="个人签名" placeholder="请输入个人签名" />

    <van-button type="danger" @click="registerFn">立即注册</van-button>
    <van-button type="danger" @click="registerReset">重置</van-button>
    <footer-bar :footerBarInx="footerBarInx" />
  </div>
</template>

<script>
import { register_post } from "network/registerPort";
import FooterBar from "./FooterBar";
export default {
  name: "Register",
  data() {
    return {
      msg: "注册页面",
      username: "",
      password: "",
      password2: "",
      describe: "",
      userErr: "",
      passErr: "",
      passErr2: "",
      footerBarInx: 3,
    };
  },
  components: {
    FooterBar,
  },
  methods: {
    goBackFn() {
      this.$router.go(-1);
    },
    // 注册
    registerFn() {
      // 重置错误提示
      this.userErr = "";
      this.passErr = "";
      this.passErr2 = "";
      // 注册信息
      let _registerObj = {
        username: this.username,
        password: this.password,
        password2: this.password2,
        describe: this.describe,
      };
      if (_registerObj.username === "") {
        this.userErr = "用户名不能为空";
        return false;
      }
      if (_registerObj.password === "") {
        this.passErr = "密码不能为空";
        return false;
      }
      if (_registerObj.password2 === "") {
        this.passErr2 = "重复密码不能为空";
        return false;
      }
      if (_registerObj.password !== _registerObj.password2) {
        this.passErr2 = "重复密码不一致";
        return false;
      }
      // console.log(_registerObj);
      this.postRegisterObj(_registerObj);
      this.registerReset();
    },
    // 提交注册信息
    postRegisterObj(_registerObj) {
      register_post(_registerObj).then((_d) => {
        // console.log(_d.data);
        this.$dialog
          .alert({
            message: _d.data.regInfo,
          })
          .then(() => {
            // 注册成功回到首页
            if (_d.data.reg_code === 1) {
              this.$router.push("/");
            }
          });
      });
    },
    // 重置
    registerReset() {
      this.username = "";
      this.password = "";
      this.password2 = "";
      this.userErr = "";
      this.passErr = "";
      this.passErr2 = "";
      this.describe = "";
    },
  },
};
</script>

<style scoped>
</style>