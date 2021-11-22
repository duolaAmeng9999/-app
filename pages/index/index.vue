<template>
  <view class="gg" v-if="token">
    <view>
      <!-- 导航头 -->
      <u-navbar :is-back="false" title="hello！文静" :background="background">
        <view class="gg-map-slot-wrap" @click="pickUpLocation">
          <u-icon name="map" size="24"></u-icon>
          <text class="u-p-l-10 u-p-r-10">{{
            leaderAddressVo.takeName ? leaderAddressVo.takeName : "请设置提货点"
          }}</text>
          <u-icon name="arrow-right" size="20"></u-icon>
        </view>
      </u-navbar>

      <!-- 主内容区 -->
      <view class="content">
        <!-- 头部区域 -->
        <view class="header u-p-l-20 u-p-r-20">
          <!-- 头部搜索区域 -->
          <view class="notice-search-bar">
            <u-icon name="search" class="search-left-icon"></u-icon>
            <u-notice-bar
              mode="vertical"
              :volume-icon="false"
              :list="list"
              type="none"
              color="rgb(251, 192, 250)"
              class="searchList"
            ></u-notice-bar>
            <u-button
              type="error"
              size="mini"
              shape="square"
              :custom-style="customStyleRight"
              >搜索</u-button
            >
          </view>
        </view>

        <!-- 新人专享 -->
        <view class="newPeople gg-new-vip u-p-20 u-m-t-20">
          <view class="newPeople-title u-font-lg u-content-color"
            >新人专享低价好物</view
          >
          <scroll-view class="newPeople-scroll" scroll-x enable-flex>
            <view
              scroll-item
              class="gg-new-vip-sv-item u-p-r-20"
              v-for="item in newPersonSkuInfoList"
              :key="item.id"
            >
              <ListImageItem
                width="200rpx"
                height="200rpx"
                :src="item.imgUrl"
              ></ListImageItem>
              <text class="u-type-error">￥{{ item.price }}</text>
              <AddToCard></AddToCard>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 圆角拼接 -->
      <view class="buttom"></view>

      <!-- 优选规则 -->
      <view
        class="u-flex u-row-between u-p-20 u-m-20 gg-border"
        @click="show = true"
      >
        <u-image src="/static/images/location.png" width="30rpx" height="30rpx"></u-image>
        <view>平台资质、法律条款、规则及投诉入口</view>
      </view>
      <!-- 平台法律规则 -->
      <u-popup mode="bottom" v-model="show" borderRadius="25" closeable="true">
        <view class="u-p-t-20 u-p-b-20">
          <view class="u-m-20">
            <view class="u-font-xl u-m-b-10">
              <u-icon
                name="checkmark-circle"
                color="#dd6161"
                size="28"
                class="u-m-r-10"
              ></u-icon>
              品质保障
            </view>
            <view class="u-light-color u-font-xs"
              >全场商品均经过品质检验，若收货时发现商品有变质、腐烂、损坏等情况，可申请退款</view
            >
          </view>

          <view class="u-m-20">
            <view class="u-font-xl u-m-b-10">
              <u-icon
                name="kefu-ermai"
                color="#dd6161"
                size="28"
                class="u-m-r-10"
              ></u-icon>
              极速退款
            </view>
            <view class="u-light-color u-font-xs"
              >根据平台的规则，在一定条件下，可享受极速退款到账服务</view
            >
          </view>

          <view class="u-m-20">
            <view class="u-font-xl u-m-b-10">
              <u-icon
                name="bag"
                color="#dd6161"
                size="28"
                class="u-m-r-10"
              ></u-icon>
              次日自提
            </view>
            <view class="u-light-color u-font-xs"
              >每日23点前下单，次日16点可到下单门店自提</view
            >
          </view>

          <view class="u-m-20">
            <view class="u-font-xl u-m-b-10">
              <u-icon
                name="integral"
                color="#dd6161"
                size="28"
                class="u-m-r-10"
              ></u-icon>
              资质规则
            </view>
            <view class="u-light-color u-font-xs"
              >平台资质、法律条款、规则及投诉入口，点击查看详情</view
            >
          </view>
        </view>
      </u-popup>
    </view>

    <!-- 商品分类 -->
    <view class="u-m-20 u-p-20 gg-border">
      <scroll-view scroll-x enable-flex @scroll="scrollMove">
        <view class="u-flex u-p-r-20 u-p-t-20">
          <!-- 分类循环 -->
          <view
            class="u-p-l-20 u-p-r-20"
            v-for="item in categoryList"
            :key="item.id"
          >
            <u-image
              :src="item.imgUrl"
              border-radius="30rpx"
              width="100rpx"
              height="100rpx"
            ></u-image>
            <text class="u-font-xs">{{ item.name }}</text>
          </view>
        </view>
      </scroll-view>

      <view class="gg-category"
        ><u-line-progress
          class="gg-category-progress"
          height="5"
          width="10"
          :show-percent="false"
          :percent="categorySVPercent"
        ></u-line-progress
      ></view>
    </view>

    <view class="u-m-l-20 u-m-r-20 u-flex" v-if="seckillTime.length > 0">
      <view class="u-flex u-flex-1">
        <view class="u-type-error u-font-lg">
          秒杀抢购：
          <text class="u-font-sm"
            >{{ seckillTime.name }}场 {{ seckillTime.startTime }}-{{
              seckillTime.endTime
            }}</text
          >
        </view>
      </view>
      <u-button :plain="true" size="mini">查看全部 ></u-button>
    </view>
    <view class="u-m-20 u-p-20 gg-border">
      <scroll-view enable-flex scroll-x>
        <view class="u-flex u-p-r-20 u-p-t-20">
          <!-- 循环滚动内容 -->
          <view
            class="u-p-l-20 u-p-r-20 u-text-center"
            v-for="item in seckillSkuVoList"
            :key="item.skuId"
          >
            <text class="u-font-sm u-m-b-5">{{ item.timeName }}</text>
            <u-image
              src="https://img0.baidu.com/it/u=1832250010,3404880111&fm=26&fmt=auto"
              border-radius="30rpx"
              width="200rpx"
              height="200rpx"
            ></u-image>
            <text class="u-font-sm u-m-t-5">{{ item.skuName }}</text>
            <AddToCart></AddToCart>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 如何购买商品 -->
    <view class="u-p-20 u-m-20 gg-border u-font-xs">
      <view class="u-m-b-20">如何在[硅谷优选]购买商品</view>
      <view class="u-flex">
        <view class="gg-number u-m-r-10">1</view>
        挑商品
        <u-icon name="arrow-right-double u-m-l-10 u-tips-color"></u-icon>
        <u-icon class="u-content-color" name="arrow-right-double"></u-icon>
        <view class="gg-number gg-number-gray u-m-r-10 u-m-l-10">2</view>
        选提货点
        <u-icon name="arrow-right-double u-m-l-10 u-tips-color"></u-icon>
        <u-icon class="u-content-color" name="arrow-right-double"></u-icon>
        <view class="gg-number gg-number-gray u-m-r-10 u-m-l-10">3</view>
        次日16点提货点取货
      </view>
    </view>

    <!-- 热销好货 -->
    <view class="u-font-xl u-type-error u-m-20">热销好货</view>
    <view
      class="u-p-20 u-m-20 gg-border"
      v-for="item in hotSkuList"
      :key="item.id"
    >
      <view class="u-m-b-10 u-m-l-20 u-m-r-20 u-flex gg-product-item">
        <ListImageItem
          :src="item.imgUrl"
          width="200rpx"
          height="200rpx"
        ></ListImageItem>
        <view class="gg-product-item-msg u-border-bottom u-p-b-20 u-m-l-20">
          <view class="gg-product-item-msg-title">
            <view class="u-font-lg">{{ item.title }}</view>
            <view class="u-type-info u-font-sm"
              >已售 {{ item.sale }}/剩余 {{ item.stock }}</view
            >
            <block>
              <view
                class="u-font-xs u-type-error-dark"
                v-for="(rule, ruleIndex) in item.ruleList"
                :key="ruleIndex"
                >{{ rule }}</view
              >
            </block>
          </view>
          <view class="u-flex u-row-between">
            <view class="u-type-error gg-product-item-msg-price">
              <text>￥</text>
              <text class="gg-product-item-msg-price-value">{{
                item.price
              }}</text>
            </view>
            <AddToCart></AddToCart>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view v-else class="emptyPage"><u-empty mode="page"></u-empty></view>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      list: ["请给我一点好运！", "剩下我自己努力！"],
      // 自定义导航栏的渐变色
      background: {
        backgroundImage:
          "linear-gradient(45deg, rgb(214, 208,254), rgb(251, 192, 250))",
      },
      customStyleRight: {
        borderRadius: "30rpx",
        marginRight: "20rpx",
      },
      show: false, // 控制平台销售规则框的显示与隐藏
      categorySVPercent: "", // 控制进度条的百分比
      windowWidth: "", // 设备的宽度
      token: null, // 用来判断用户是否登录; 否则跳转到登录页
    };
  },
  methods: {
    // 滑动商品分类列表函数
    scrollMove(event) {
      // 获取到每次滑动的距离
      let scrollLeft = event.detail.scrollLeft;
      // 获取到滑动区域的总宽度
      let scrollWidth = event.detail.scrollWidth - this.windowWidth;
      // 计算出比例
      let percent = (scrollLeft / scrollWidth) * 100;

      // 利用防抖来进行性能的优化; 否则会实时的更新进度条; 性能消耗
      this.$u.debounce(() => {
        this.categorySVPercent = percent;
      }, 100);
    },
    // 跳转至提货地点的选择
    pickUpLocation() {
      /* // 无参数
      this.$u.route({
        url: "/pagesLocation/myPickUpLocation/myPickUpLocation",
      }); */
      uni.navigateTo({
        url: "/pagesLocation/myPickUpLocation/myPickUpLocation",
      });
    },
    // 将仓库的数据进行映射
    ...mapActions("indexModule", ["getHomeIndex"]),
  },
  computed: {
    ...mapGetters("indexModule", [
      "categoryList",
      "leaderAddressVo",
      "hotSkuList",
      "newPersonSkuInfoList",
      "seckillTime",
      "seckillSkuVoList",
    ]),
  },
  onLoad() {
    // 获取设备的宽度
    uni.getSystemInfo({
      complete: (res) => {
        this.windowWidth = res.windowWidth;
      },
    });
  },
  async mounted() {
    // 以后，我们的token一定是存储至本地缓存当中, 从本地获取 token
    const token = await uni.getStorageSync("token");
    this.token = await token;
    // 用有没有 token 值来判断用户有没有登录; 否则跳转到登录页
    if (this.$u.test.isEmpty(token)) {
      uni.reLaunch({
        url: "/pages/login/login",
      });
      return;
    }
    // 调用首页商品列表数据
    await this.getHomeIndex();
  },
};
</script>
<style lang="scss" scoped>
.gg {
  &-map-slot-wrap {
    display: flex;
    align-items: center;
    background-color: rgba(189, 115, 130, 0.562);
    color: #fff;
    border-radius: 100rpx;
  }
  .content {
    background: linear-gradient(
      to right,
      rgb(214, 208, 254),
      rgb(251, 192, 250)
    );
    .header {
      width: 100%;
      .search-left-icon {
        margin-left: 10rpx;
      }
      .notice-search-bar {
        display: flex;
        align-items: center;
        background-color: white;
        border-radius: 30rpx;
      }
      .searchList {
        flex: 1;
      }
    }

    .newPeople {
      margin: 15rpx;
      border-radius: 20rpx;
      background: white;
      &-title {
        margin: 15rpx;
      }
      &-scroll {
        display: flex;
        height: 300rpx;
        // margin-top: 40rpx;
      }
    }
  }
  .buttom {
    background: linear-gradient(
      to right,
      rgb(214, 208, 254),
      rgb(251, 192, 250)
    );
    width: 100%;
    margin-top: -15rpx;
    height: 35rpx;
    border-bottom-left-radius: 25rpx;
    border-bottom-right-radius: 25rpx;
    // border-radius: 25rpx;
  }
  &-category {
    display: flex;
    justify-content: center;
    align-items: center;
    &-progress {
      width: 10vw;
    }
  }
  /* 如何购买商品 */
  &-number {
    border-radius: 50%;
    background-color: $u-type-warning;
    width: 30rpx;
    height: 30rpx;
    text-align: center;
    font-size: 20rpx;
    color: white;
    &-gray {
      background-color: gray;
    }
  }

  /* 热销好货 */
  &-product-item {
    height: 250rpx;
    &-msg {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &-price {
        &-value {
          font-size: 50rpx;
        }
      }
    }
  }
}
.emptyPage {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
