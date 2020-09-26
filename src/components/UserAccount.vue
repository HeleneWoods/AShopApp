<template>
  <div>
    <van-nav-bar
      :title="msg"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      right-text="退出登录"
      @click-right="logOutBtn"
    />
    <footer-bar :footerBarInx="footerBarInx" />
    <div class="userImgDiv">
      <p>欢迎：{{userNameObj.username}}</p>
      <p>{{userNameObj.describe}}</p>
    </div>
  </div>
</template>

<script>
import FooterBar from "./FooterBar";
export default {
  name: "UserAccount",
  data() {
    return {
      footerBarInx: 3,
      msg: "用户中心",
      userNameObj: "",
    };
  },
  components: {
    FooterBar,
  },
  created() {
    this.userNameObj = JSON.parse(localStorage.userName);
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    logOutBtn() {
      localStorage.userName = "";
      this.$dialog
        .alert({
          message: "您已经退出登录",
        })
        .then(() => {
          this.goBack();
        });
    },
  },
};
</script>

<style scoped>
.pr {
  position: relative;
}
.pa {
  position: absolute;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
h2.title {
  font-size: 20px;
  text-align: center;
}
.cle:after {
  content: ".";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.wrapDiv {
  width: 90%;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
.userImgDiv {
  position: relative;
  border-radius: 10px;
  margin: 10px;
  font-size: 22px;
}
.userImgDiv img {
  position: absolute;
  top: 0;
  left: -20px;
  width: 260px;
}
.userInfoDiv {
  font-size: 14px;
  float: left;
  text-align: left;
}
.wrapDiv {
  width: 90%;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
</style>