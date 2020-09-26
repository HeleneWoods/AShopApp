<template>
  <div>
    <van-nav-bar
      :title="msg"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      right-text="清空购物车"
      @click-right="clearCart"
    />
    <h1 v-if="isCartEmpty">购物车是空，请去添加商品吧</h1>

    <van-submit-bar :price="allGoodsMoney" :button-text="submitTxt" @submit="onSubmit" />
    <div class="goodsDiv" v-for="item in shopCartList">
      <label>
        <img :src="item._img" />
      </label>
      <h2>{{item._goodsName}}, 数量：{{item._num}}, 单价:{{item._price}}</h2>
      <!-- async-change的值必须是true,否则计算的值错误 -->
      <van-stepper
        v-model="item['_num']"
        :async-change="true"
        @plus="addBtnFn"
        @minus="minusBtnFn"
      />
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Cart",
  data() {
    return {
      msg: "购物车",
      cartArr: "",
      allGoodsNum: 0,
      allGoodsMoney: 0,
      submitTxt: "去结账（0）",
      isCartEmpty: false,
    };
  },
  created() {
    this.cartArr = localStorage.cartDataInfo
      ? JSON.parse(localStorage.cartDataInfo)
      : [];
    if (this.cartArr.length === 0) {
      this.isCartEmpty = true;
    }
    this.countAllGoodsNum();
    this.countAllGoodsMoney();

    this.addToVuex(this.cartArr);
  },
  computed: {
    // 从vuex里映射数据到组件里
    ...mapGetters(["shopCartList"]),
  },
  methods: {
    // 映射事件
    ...mapActions(["addToVuex"]),
    // 计算所有商品总价
    countAllGoodsMoney() {
      this.allGoodsMoney = 0;
      for (let i = 0; i < this.cartArr.length; i++) {
        this.allGoodsMoney +=
          this.cartArr[i]._num * this.cartArr[i]._price * 100;
      }
    },
    // 计算所有商品总数
    countAllGoodsNum() {
      this.allGoodsNum = 0;
      for (let i = 0; i < this.cartArr.length; i++) {
        this.allGoodsNum += this.cartArr[i]._num;
      }
      this.submitTxt = "去结账（" + this.allGoodsNum + "）";
    },
    clearCart() {
      this.cartArr = localStorage.removeItem("cartDataInfo");
      this.submitTxt = "去结账（0）";
      this.allGoodsMoney = 0;
      this.isCartEmpty = true;
    },
    goBack() {
      this.$router.push({ path: "/" });
    },
    addBtnFn() {
      this.countAllGoodsNum();
      this.countAllGoodsMoney();
    },
    minusBtnFn() {
      this.countAllGoodsNum();
      this.countAllGoodsMoney();
    },
    onSubmit() {
      this.$dialog
        .alert({
          message:
            "共" +
            this.allGoodsNum +
            "个商品，总计" +
            this.allGoodsMoney / 100 +
            "元",
        })
        .then(() => {
          Toast.success("支付成功");
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
.goodsDiv {
  width: 95%;
  margin: 5px auto;
  clear: both;
}
.goodsDiv label {
  float: left;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.goodsDiv label img {
  width: 100px;
  height: 100px;
}
.goodsDiv h2 {
  font-size: 22px;
}
</style>