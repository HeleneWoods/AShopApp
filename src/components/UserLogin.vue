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

    <van-button type="danger" @click="userLoginFn">登录</van-button>
    <van-button type="danger" @click="registerFn">注册</van-button>
    <footer-bar :footerBarInx="footerBarInx" />
  </div>
</template>

<script>
import { userLogin_port } from "network/loginPort";
import FooterBar from "./FooterBar";
export default {
  name: "UserLogin",
  data() {
    return {
      msg: "登录页面",
      username: "",
      password: "",
      userErr: "",
      passErr: "",
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
    userLoginFn() {
      let _loginObj = {
        u: this.username,
        p: this.password,
      };
      userLogin_port(_loginObj).then((_d) => {
        this.$dialog
          .alert({
            message: "登录成功！欢迎" + _d.data.regInfo.username,
          })
          .then(() => {
            // 登录成功回到首页
            if (_d.data.reg_code === 3) {
              // localStorage只能存储字符串，要存储对象要先把对象转换成字符串
              localStorage.userName = JSON.stringify(_d.data.regInfo);
              this.$router.push("/");
            } else {
              this.password = "";
            }
          });
      });
    },
    registerFn() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
</style>