<template>
  <div>
    <van-nav-bar :title="msg" left-text="返回" left-arrow @click-left="goBack" />
    <div class="goodsImgWrap">
      <img :src="goodsImg" />
    </div>
    <p>{{goodsTitle}},{{describe}},￥{{price}}</p>

    <van-sku
      v-model="showBase"
      :sku="sku"
      :goods="goods"
      :goods-id="goodsId"
      :hide-stock="sku.hide_stock"
      :quota-used="0"
      :reset-stepper-on-hide="false"
      :reset-selected-sku-on-hide="false"
      :close-on-click-overlay="true"
      :disable-stepper-input="false"
      :message-config="{}"
      @sku-selected="switchProductType"
      @add-cart="onAddCartFn"
    />

    <!-- footer底栏 -->
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" @click="onHelpBtn" />
      <van-goods-action-icon
        icon="cart-o"
        text="购物车"
        @click="goToCartBtn"
        :badge="cartGoods_mini_num"
      />
      <van-goods-action-button type="warning" text="加入购物车" @click="onClickBigBtn" />
      <van-goods-action-button type="danger" text="立即购买" />
    </van-goods-action>
  </div>
</template>

<script>
import FooterBar from "./FooterBar";
import { getGoodsInfo } from "network/goodsProduct";

export default {
  name: "GoodsProduct",
  data() {
    return {
      msg: "商品详情页",
      goodsTitle: "",
      goodsImg: "",
      describe: "",
      price: "",
      showBase: false,
      goods: {},
      goodsId: "",
      sku: {
        tree: [
          {
            k: "产品类型", // skuKeyName：规格类目名称
            v: [
              // {
              //   id: "30349", // skuValueId：规格值 id
              //   name: "红色", // skuValueName：规格值名称
              //   imgUrl: "https://img.yzcdn.cn/1.jpg", // 规格类目图片，只有第一个规格类目可以定义图片
              // },
              {
                id: "1215",
                name: "蓝色",
                imgUrl: "https://img.yzcdn.cn/2.jpg",
              },
            ],
            k_s: "s1", // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
          },
        ],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [
          {
            id: 2259, // skuId，下单时后端需要
            price: "", // 价格（单位分）
            s1: "1215", // 规格类目 k_s 为 s1 的对应规格值 id
            s2: "1193", // 规格类目 k_s 为 s2 的对应规格值 id
            s3: "0", // 最多包含3个规格值，为0表示不存在该规格
            stock_num: 110, // 当前 sku 组合对应的库存
          },
        ],
        price: "", // 默认价格（单位元）
        stock_num: 227, // 商品总库存
        hide_stock: false, // 是否隐藏剩余库存
      },
      cartGoods_mini_num: 0,
    };
  },
  components: {
    FooterBar,
  },
  created() {
    let _goodsId = this.$route.query._goodsObjId;
    let _collectionName = this.$route.query._collectionName;
    this.getGoodsInfoFn(_goodsId, _collectionName);
    // 给sku的
    this.goodsId = _goodsId;

    let xx = localStorage.cartDataInfo
      ? JSON.parse(localStorage.cartDataInfo)
      : [];
    // console.log(xx);
    // localStorage.removeItem("cartDataInfo");
    this.total_cartGoodsNum();
  },
  mounted() {},
  methods: {
    // 添加到购物车
    onAddCartFn(_d) {
      // 判断cart数据中是否有相同的产品
      let _isTrue = false;

      // console.log(_d);
      let _tempObj = {
        _id: _d.goodsId,
        _price: this.price,
        _num: _d.selectedNum,
        _goodsName: this.goodsTitle,
        _img: this.goodsImg,
      };
      console.log(_tempObj);

      // 已经保存在本地存储中的数据
      let _cart = localStorage.cartDataInfo
        ? JSON.parse(localStorage.cartDataInfo)
        : [];

      for (let i = 0; i < _cart.length; i++) {
        // id相同就是同一个产品
        if (_cart[i]._id === _tempObj._id) {
          _cart[i]._num += _tempObj._num;
          _isTrue = true;
          break;
        }
      }

      // 没有相同的直接push
      if (!_isTrue) {
        _cart.push(_tempObj);
      }

      // 对象要转为对象才能通过h5寸在本地
      localStorage.cartDataInfo = JSON.stringify(_cart);

      this.$dialog
        .alert({
          message: "加入购物车成功",
        })
        .then(() => {
          this.showBase = false;
        });
      this.total_cartGoodsNum();
    },
    // 统计当前购物车中的总数
    total_cartGoodsNum() {
      let _cart = localStorage.cartDataInfo
        ? JSON.parse(localStorage.cartDataInfo)
        : [];
      let _n = 0;
      for (let i = 0; i < _cart.length; i++) {
        _n += _cart[i]._num;
      }
      this.cartGoods_mini_num = _n;
    },
    //根据id获得对应商品信息
    getGoodsInfoFn(_goodsId, _collectionName) {
      getGoodsInfo(_goodsId, _collectionName).then((_d) => {
        this.goodsTitle = _d.data.name;
        this.goodsImg = _d.data.img;
        this.describe = _d.data.describe;
        this.price = _d.data.price;

        // 给goods
        this.goods.picture = _d.data.img;
        this.sku.price = _d.data.price;
        this.sku.tree[0].v[0].name = _d.data.name;
        this.sku.tree[0].v[0].imgUrl = _d.data.img;
        this.sku.tree[0].v[0].previewImgUrl = _d.data.img;
        this.sku.list[0].price = this.sku.price * 100;
      });
    },
    // 加入购物车
    onClickBigBtn() {
      this.showBase = true;
    },
    // 切换产品的类型时触发
    switchProductType(skuValue, selectedSku) {
      this.sku.list[0].price = this.sku.price * 100;
      // console.log(skuValue);
    },
    // 客服按钮
    onHelpBtn() {
      this.$dialog.alert({
        message: "客服正忙，请稍后",
      });
    },
    goToCartBtn() {
      this.$router.push("/cart");
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.goodsImgWrap {
  width: 100%;
  height: 350px;
  overflow: hidden;
  margin: 0 auto;
}
.goodsImgWrap img {
  width: 100%;
  height: 350px;
}
</style>