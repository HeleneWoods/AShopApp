<template>
  <div class="hello">
    <!-- 搜索框 -->
    <van-search v-model="searchValue" show-action placeholder="可以查询aaa bbb ccc" @search="onSearch"></van-search>
    <!-- 轮播图 -->
    <van-swipe class="sliderDiv" :autoplay="1000" indicator-color="white">
      <van-swipe-item v-for="(img,inx) in sliderImg" :key="inx">
        <img :src="img" />
      </van-swipe-item>
    </van-swipe>

    <van-tabs sticky v-for="(itemObj,inx) in goodsObj" class="wrapDiv cle goodsList" :key="inx">
      <van-tab :title="itemObj.n">
        <li v-for="goods in itemObj.goodsList_aa" @click="goodsProductFn(goods)">
          <label>
            <img :src="goods.img" />
          </label>
          {{goods.name}} / ￥{{goods.price}}
        </li>
        <li v-for="goods in itemObj.goodsList_bb" @click="goodsProductFn(goods)">
          <label>
            <img :src="goods.img" />
          </label>
          {{goods.name}} / ￥{{goods.price}}
        </li>
        <li v-for="goods in itemObj.goodsList_cc" @click="goodsProductFn(goods)">
          <label>
            <img :src="goods.img" />
          </label>
          {{goods.name}} / ￥{{goods.price}}
        </li>
        <li v-for="goods in itemObj.goodsList_dd" @click="goodsProductFn(goods)">
          <label>
            <img :src="goods.img" />
          </label>
          {{goods.name}} / ￥{{goods.price}}
        </li>
      </van-tab>
    </van-tabs>

    <footer-bar :footerBarInx="footerBarInx" />
  </div>
</template>

<script>
import {
  sendBtnReq,
  getBtnReq,
  getGoodsCategory,
  getImgUrls,
} from "network/pscd";
import FooterBar from "./FooterBar";

export default {
  name: "ProShopCartDemo",
  data() {
    return {
      msg: "首页",
      isLogin: true,
      footerBarInx: 0,
      // 所有商品总的数据
      goodsObj: "",
      searchValue: "",
      // 轮播图
      sliderImg: "",
    };
  },
  components: {
    FooterBar,
  },
  created() {
    if (localStorage.userName) {
      let _xx = JSON.parse(localStorage.userName);
      this.$notify(_xx.username + "您已经登录，欢迎回来！");
      this.isLogin = false;
      this.msg = "用户名" + _xx.username;
    }
    this.getGoodsCategoryFn();
    getImgUrls().then((_d) => {
      this.sliderImg = _d.data.urls;
    });
  },
  methods: {
    // 商品详情页
    goodsProductFn(_self) {
      this.$router.push({
        name: "GoodsProduct",
        query: {
          _goodsObjId: _self._id,
          _collectionName: _self.category,
        },
      });
    },
    getBtn() {
      getBtnReq().then((_d) => {
        // console.log(_d);
        this.$notify(_d.data[0].name);
      });
    },
    onSearch() {
      // console.log(this.searchValue);
      let _v = this.searchValue;
      if (_v === "" || _v === undefined) {
        this.$notify("查询条件不能为空");
      } else {
        sendBtnReq(_v).then(() => {
          this.getBtn();
        });
      }
    },
    // 查询所有栏目及栏目所属的商品
    getGoodsCategoryFn() {
      getGoodsCategory().then((_d) => {
        // console.log(_d.data);
        this.goodsObj = _d.data;
      });
    },
    // 登录
    logBtn() {
      this.$router.push("/login");
    },
    // 注册
    registerBtn() {
      this.$router.push("/register");
    },
    // 退出登录
    logOutBtn() {
      localStorage.userName = "";
      this.isLogin = true;
      this.$notify(localStorage.userName + "您已退出登录");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
.cle:after {
  content: ".";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.wrapDiv {
  width: 80%;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
.wrapDiv p.tip {
  font-size: 22px;
  text-align: center;
  padding: 0;
  margin: 5px 0;
  color: #666;
}
.leftDiv {
  float: left;
  width: 60%;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid #999;
  padding: 10px;
  line-height: 30px;
  text-align: center;
  font-size: 22px;
}
.rightDiv {
  float: right;
  width: 20%;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid #999;
  padding: 10px;
  line-height: 30px;
  text-align: center;
  font-size: 22px;
}
.sliderDiv {
  width: 80%;
  margin: 10px auto;
}
.sliderDiv img {
  width: 100%;
  height: 188px;
}

.goodsCategory {
  clear: both;
  margin: 10px 0;
}
.goodsCategory li {
  float: left;
}
.goodsCategory li img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 1px solid #666;
}

.goodsList {
}
.goodsList li {
  float: left;
  width: 49%;
  overflow: hidden;
  margin: 0 0 10px 0;
}
.goodsList li label {
  width: 100px;
  height: 115px;
  display: block;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
  text-align: center;
  position: relative;
  border: 1px solid #666;
}
.goodsList li img {
  height: 100%;
  position: absolute;
  top: -5px;
  left: 0;
  clear: both;
  display: block;
  margin: 5px auto;
  padding: 0;
}
.goodsList h1.goodsTitle {
  clear: both;
  margin: 5px auto;
  font-size: 22px;
  border-radius: 5px;
  background: #5d5d5d;
  width: 50%;
  color: #fff;
  padding: 3px 0;
}
.sliderDiv {
  width: 80%;
  margin: 10px auto;
}
.sliderDiv img {
  width: 100%;
  height: 188px;
}
</style>
