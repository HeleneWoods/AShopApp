<template>
  <div>
    <h1>{{msg}}</h1>
    <van-button v-if="isLogin" type="danger" @click="entryGoodsToDb">录入商品</van-button>

    <div class="wrapDiv cle">
      <van-tabs v-model="tabActive" animated @click="headColumnFn">
        <van-tab v-for="(item,index) in goodsCategoryData" :key="index" :title="item.n">
          <h1>{{item.d}}</h1>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 商品录入框 -->
    <div v-if="isEntryGoods" class="goodsEntry cle">
      <div v-for="item in emptyGoodsDomArr">
        <entry-goods @pushGoodsInfo="pushGoodsInfoFn" @isVoidFalse="isVoidFalseFn" />
      </div>
      <van-button type="danger" @click="addGoodsInputBtn">+</van-button>
      <van-button type="danger" @click="submitBtn">提交</van-button>
      <van-button type="danger" @click="cancelBtn">取消</van-button>
    </div>
    <div class="entryGoodsDivBg" v-if="isEntryGoodsDivBg"></div>

    <!-- 竖向标签栏 -->
    <div class="sideBarFn">
      <van-sidebar v-model="activeKey" @change="onChange">
        <van-sidebar-item v-for="(item,index) in goodsCategoryData" :key="index" :title="item.n" />
      </van-sidebar>
    </div>

    <div class="columnData">
      <ul v-for="item in goodsListData" @click="goToGoodsProduct(item)">
        <li>
          <img :src="item.img" alt />
        </li>
        <li>{{item.name}}</li>
        <li>￥{{item.price}}</li>
        <li>{{item.describe}}</li>
      </ul>
    </div>

    <!-- 分页 -->
    <div class="pageChange">
      <van-pagination
        v-model="currentPage"
        :total-items="totalItems"
        :items-per-page="2"
        mode="simple"
        @change="pageChange"
      />
    </div>
    <footer-bar :footerBarInx="footerBarInx" />
  </div>
</template>

<script>
import FooterBar from "./FooterBar";
import EntryGoods from "./EntryGoods";

import { getPageChange } from "network/goodsCategory";
import {
  getGoodsCategory,
  insertGoods,
  getCategoryGoodsList,
} from "network/pscd";

export default {
  name: "GoodsType",
  data() {
    return {
      msg: "商品分类页",
      footerBarInx: 1,
      tabActive: 0,
      isEntryGoods: false,
      // 接收商品信息的数组
      entryGoodsObj: [],
      // 空白录入框
      emptyGoodsDomArr: [{}],
      isEntryGoodsDivBg: false,
      // 四个框填完没
      isGoodsInfoDone: false,
      // 是否重名
      isNameRepeat: true,
      // 商品大类
      goodsCategoryData: "",
      isLogin: false,
      activeKey: 0,
      // 竖向栏目
      goodsListData: [],
      currentPage: 0,
      totalItems: 0,
    };
  },
  components: {
    FooterBar,
    EntryGoods,
  },
  created() {
    this.getGoodsCategoryFn();
    this.getCategoryGoodsListFn("goodsList_a");

    // 如果没有数据，下面的都不执行
    if (!localStorage.userName) {
      return;
    }

    let _xx = JSON.parse(localStorage.userName);
    if (localStorage.userName) {
      // this.$notify(localStorage.userName + "您已经登录，欢迎回来！");
      this.msg = "用户名" + _xx.username;
    }
    let _n = _xx._id;
    // console.log(_n);
    if (localStorage.userName && _n === "5f61d97a1cb4002a24c3d25a") {
      this.isLogin = true;
    }
  },
  methods: {
    // 跳转到产品详情
    goToGoodsProduct(_self) {
      this.$router.push({
        path: "/goodspoduct",
        query: {
          _goodsObjId: _self._id,
          _collectionName: _self.category,
        },
      });
    },
    // 分页时触发
    pageChange() {
      let _c = "";
      if (!this.goodsCategoryData) {
        _c = "goodsList_a";
      } else {
        _c = this.goodsCategoryData[this.activeKey].d;
      }
      // 点击下一页跳过的数据有（currentPage-1)*2个
      // 翻页接口要传入两个值：要跳过的数据数；要查询的集合名
      getPageChange(this.currentPage, _c).then((_d) => {
        // console.log(_d.data);
        this.goodsListData = _d.data;
      });
    },
    // 横向分类栏
    headColumnFn(_inx) {
      // console.log(_inx);
      this.activeKey = _inx;
    },
    // 竖向分类栏点击事件
    onChange(key) {
      // console.log(this.goodsCategoryData[key].d);
      let _cate = this.goodsCategoryData[key].d;
      this.getCategoryGoodsListFn(_cate);
      this.tabActive = key;
      // 切换分类触发分页
      this.currentPage = 1;
      this.pageChange();
    },
    // 查询栏目所属的商品列表
    getCategoryGoodsListFn(_cate) {
      getCategoryGoodsList(_cate).then((_d) => {
        // 分页上的商品总数
        this.totalItems = _d.data.length;
        // this.goodsListData = _d.data;
        this.pageChange();
      });
    },
    // 获得商品列表
    getGoodsCategoryFn() {
      getGoodsCategory().then((_d) => {
        this.goodsCategoryData = _d.data;
      });
    },
    // 添加商品信息到商品信息数组的对象
    pushGoodsInfoFn(_goodsInfoObj) {
      // 判断 商品名称是否重复
      let _is = true;

      for (let i = 0; i < this.entryGoodsObj.length; i++) {
        if (this.entryGoodsObj[i].n === _goodsInfoObj.n) {
          _is = false;
          break;
        }
      }

      if (_is) {
        this.entryGoodsObj.push(_goodsInfoObj);
        this.isNameRepeat = true;
      } else {
        this.isNameRepeat = false;
        this.$dialog.alert({
          message: "商品重名了",
        });
      }

      // 四个框全写完了
      this.isGoodsInfoDone = true;
    },
    // 商品信息没写完时触发
    isVoidFalseFn() {
      this.isGoodsInfoDone = false;
    },
    // 四个框全填完，并且不重名，才能增加新的空白框
    addGoodsInputBtn() {
      if (this.isGoodsInfoDone && this.isNameRepeat) {
        this.emptyGoodsDomArr.push({});
        this.isGoodsInfoDone = false;
      } else {
        this.$dialog.alert({
          message: "信息没有填完，或者商品名重复",
        });
      }
    },
    // 录入商品
    entryGoodsToDb() {
      this.isEntryGoods = true;
      this.isEntryGoodsDivBg = true;
    },
    // 提交新增商品
    submitBtn() {
      // console.table(this.entryGoodsObj);
      insertGoods(this.entryGoodsObj).then((_d) => {
        this.$dialog
          .alert({
            message: _d.data.regInfo,
          })
          .then(() => {
            // 商品录入窗口关闭
            this.isEntryGoods = false;
            this.isEntryGoodsDivBg = false;
            // 重置空白输入框的数量
            this.emptyGoodsDomArr = [{}];
            // 获得商品列表大类，更新页面
            this.getGoodsCategoryFn();
          });
      });
    },
    cancelBtn() {
      this.isEntryGoods = false;
      this.isEntryGoodsDivBg = false;
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
  font-size: 14px;
  text-align: center;
  padding: 0;
  margin: 5px 0;
  color: #666;
}
.goodsCategory {
  clear: both;
  margin: 10px 0;
  height: 50px;
}
.goodsCategory:hover {
  background: #ddd;
}
.goodsCategory li {
  float: left;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
}
.goodsCategory li img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 1px solid #666;
}
.goodsEntry {
  width: 80%;
  position: absolute;
  top: 10%;
  left: 50%;
  margin-left: -42%;
  z-index: 112;
  padding: 10px;
  background: #ddd;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}
.entryGoodsDivBg {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
  z-index: 111;
  position: absolute;
  top: 0;
  left: 0;
}
.imgSize {
  width: 100%;
  height: 100%;
}
.sideBarFn {
  width: 80px;
  position: absolute;
  top: 330px;
  left: 0;
  z-index: 10;
}
.columnData {
  clear: both;
  width: 70%;
  background: #eee;
  border-radius: 10px;
  border: 1px solid #666;
  margin: 0 0 0 90px;
}
.columnData ul {
  display: block;
  clear: both;
  overflow: hidden;
  margin: 10px 0;
  background: #ddd;
}
.columnData ul li {
  float: left;
  margin: 5px;
}
.columnData ul li.tip {
  background: #eee;
  padding: 2px;
}
.columnData ul li img {
  width: 50px;
  height: 50px;
}
.pageChange {
  width: 85%;
  float: right;
  clear: both;
}
</style>