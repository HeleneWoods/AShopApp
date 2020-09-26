<template>
  <div>
    <van-tabbar v-model="tabbarActive" @change="switchColumnBtn">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">分类</van-tabbar-item>
      <van-tabbar-item icon="friends-o">购物车</van-tabbar-item>
      <van-tabbar-item icon="setting-o">{{isLoginTxt}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "FooterBar",
  data() {
    return {
      msg: "footer标签组件",
      tabbarActive: 0,
      isLoginTxt: "",
    };
  },
  props: {
    footerBarInx: {
      type: Number,
      default: 0,
    },
  },
  created() {
    if (localStorage.userName) {
      this.isLoginTxt = "我的";
    } else {
      this.isLoginTxt = "未登录";
    }
  },
  mounted() {
    // 设置导航高亮样式
    this.tabbarActive = this.footerBarInx;
  },
  methods: {
    switchColumnBtn() {
      switch (this.tabbarActive) {
        case 0:
          this.$router.push({ path: "/" });
          break;
        case 1:
          this.$router.push({ path: "/goodsType" });
          break;
        case 2:
          this.$router.push({ path: "/cart" });
          break;
        case 3:
          this.isLoginState();
          break;
        default:
          break;
      }
    },
    // 判断登录状态
    isLoginState() {
      let _route = "";
      if (localStorage.userName) {
        _route = "/useraccount";
      } else {
        _route = "/login";
      }
      this.$router.push({ path: _route });
    },
  },
};
</script>

<style scoped>
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
</style>