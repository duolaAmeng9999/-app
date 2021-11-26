<template>
  <view class="u-wrap">
    <u-navbar :is-back="false" class="u-search-box">
      <text class="u-left-title">分类</text>
      <view class="u-search-inner">
        <u-icon name="search" color="#909399" :size="28"></u-icon>
        <text class="u-search-text">搜索</text>
      </view>
    </u-navbar>
    <view class="u-menu-wrap">
      <scroll-view
        scroll-y
        scroll-with-animation
        class="u-tab-view menu-scroll-view"
        :scroll-top="scrollTop"
        :scroll-into-view="itemId"
      >
        <view
          v-for="(item, index) in categories"
          :key="item.id"
          class="u-tab-item"
          :class="[current == index ? 'u-tab-item-active' : '']"
          @tap.stop="swichMenu(item.id, index)"
        >
          <text class="u-line-1">{{ item.name }}</text>
        </view>
      </scroll-view>

      <scroll-view
        :scroll-top="scrollRightTop"
        scroll-y
        scroll-with-animation
        class="right-box"
        @scroll="rightScroll"
      >
        <view v-for="item in searchResult.content" :key="item.id">
          <view class="u-m-b-10 u-m-l-20 u-m-r-20 u-flex gg-product-item">
            <ListImageItem
              :src="item.imgUrl"
              width="200rpx"
              height="200rpx"
            ></ListImageItem>
            <view class="gg-product-item-msg u-border-bottom u-p-b-20 u-m-l-20">
              <view>
                <view class="u-font-lg">{{ item.title }}</view>
                <view class="u-type-info u-font-sm"
                  >已售{{ item.sale }}/剩余{{ item.stock }}</view
                >
                <block v-if="item.ruleList">
                  <view
                    class="u-font-xs u-type-error-dark"
                    v-for="(rule, ruleIndex) in item.ruleList"
                    :key="ruleIndex"
                    >{{ rule }}</view
                  >
                </block>
              </view>
              <view class="u-flex u-row-between">
                <view class="u-type-error gg-product-item-msg-price-container">
                  <text>￥</text>
                  <text class="gg-product-item-msg-price-container-value">{{
                    item.price
                  }}</text>
                </view>
                <AddToCart></AddToCart>
              </view>
            </view>
          </view>
          <u-gap height="20"></u-gap>
        </view>
        <!-- 如果列表没有更多数据，则显示分隔线 -->
        <u-divider
          v-if="
            !(searchResult.first && searchResult.empty) && searchResult.last
          "
          :height="60"
          bg-color="transparent"
          >我是有底线的</u-divider
        >
        <!-- 如果列表没有数据，则显示空内容 -->
        <u-empty
          mode="list"
          :show="searchResult.first && searchResult.empty"
        ></u-empty>
      </scroll-view>
    </view>
  </view>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      scrollTop: 0, //tab标题的滚动条位置
      oldScrollTop: 0,
      current: 0, // 预设当前项的值
      categoryId: 0, // 预设选中分类的 id
      menuHeight: 0, // 左边菜单的高度
      menuItemHeight: 0, // 左边菜单item的高度
      itemId: "", // 栏目右边scroll-view用于滚动的id
      menuItemPos: [],
      arr: [],
      scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
      timer: null, // 定时器
      filter: {
        page: 1, // 当前页码
        limit: 5, // 每页记录数
        keyword: "", // 关键字
        wareId: "",
      },
      searchResult: {
        content: [],
        last: false,
      }, // 搜索商品结果对象
    };
  },
  onLoad() {},
  onReady() {
    this.getMenuItemTop();
  },
  methods: {
    ...mapActions("categories", ["getCategories"]),
    // 点击左边的栏目切换
    async swichMenu(categoryId, index) {
      // 每次切换之前将之前数据重置
      Object.assign(this.$data.searchResult, this.$options.data().searchResult);
      Object.assign(this.$data.filter, this.$options.data().filter);
      // 选中商品分类菜单的 id
      this.categoryId = categoryId;
      if (this.arr.length == 0) {
        await this.getMenuItemTop();
      }
      if (index == this.current) return;
      this.scrollRightTop = this.oldScrollTop;
      this.$nextTick(function () {
        this.scrollRightTop = this.arr[index];
        this.current = index;
        this.leftMenuStatus(index);
      });
      // 获取商分类中的商品数据
      this.getCategoryProduct();
    },
    // 获取一个目标元素的高度
    getElRect(elClass, dataVal) {
      new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select("." + elClass)
          .fields(
            {
              size: true,
            },
            (res) => {
              // 如果节点尚未生成，res值为null，循环调用执行
              if (!res) {
                setTimeout(() => {
                  this.getElRect(elClass);
                }, 10);
                return;
              }
              this[dataVal] = res.height;
              resolve();
            }
          )
          .exec();
      });
    },
    // 观测元素相交状态
    async observer() {
      this.tabbar.map((val, index) => {
        let observer = uni.createIntersectionObserver(this);
        // 检测右边scroll-view的id为itemxx的元素与right-box的相交状态
        // 如果跟.right-box底部相交，就动态设置左边栏目的活动状态
        observer
          .relativeTo(".right-box", {
            top: 0,
          })
          .observe("#item" + index, (res) => {
            if (res.intersectionRatio > 0) {
              let id = res.id.substring(4);
              this.leftMenuStatus(id);
            }
          });
      });
    },
    // 设置左边菜单的滚动状态
    async leftMenuStatus(index) {
      this.current = index;
      // 如果为0，意味着尚未初始化
      if (this.menuHeight == 0 || this.menuItemHeight == 0) {
        await this.getElRect("menu-scroll-view", "menuHeight");
        await this.getElRect("u-tab-item", "menuItemHeight");
      }
      // 将菜单活动item垂直居中
      this.scrollTop =
        index * this.menuItemHeight +
        this.menuItemHeight / 2 -
        this.menuHeight / 2;
    },
    // 获取右边菜单每个item到顶部的距离
    getMenuItemTop() {
      new Promise((resolve) => {
        let selectorQuery = uni.createSelectorQuery();
        selectorQuery
          .selectAll(".class-item")
          .boundingClientRect((rects) => {
            // 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
            if (!rects.length) {
              setTimeout(() => {
                this.getMenuItemTop();
              }, 10);
              return;
            }
            rects.forEach((rect) => {
              // 这里减去rects[0].top，是因为第一项顶部可能不是贴到导航栏(比如有个搜索框的情况)
              this.arr.push(rect.top - rects[0].top);
              resolve();
            });
          })
          .exec();
      });
    },
    // 右边菜单滚动
    async rightScroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
      if (this.arr.length == 0) {
        await this.getMenuItemTop();
      }
      if (this.timer) return;
      if (!this.menuHeight) {
        await this.getElRect("menu-scroll-view", "menuHeight");
      }
      setTimeout(() => {
        // 节流
        this.timer = null;
        // scrollHeight为右边菜单垂直中点位置
        let scrollHeight = e.detail.scrollTop + this.menuHeight / 2;
        for (let i = 0; i < this.arr.length; i++) {
          let height1 = this.arr[i];
          let height2 = this.arr[i + 1];
          // 如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
          if (!height2 || (scrollHeight >= height1 && scrollHeight < height2)) {
            this.leftMenuStatus(i);
            return;
          }
        }
      }, 10);
    },
    // 获取商品分类中的商品列表
    async getCategoryProduct() {
      // 整理商品列表接口所需参数
      const object = {
        page: this.filter.page,
        limit: this.filter.limit,
        keyword: this.filter.keyword,
        categoryId: this.categoryId,
        wareId: this.filter.wareId,
      };
      // 调用接口
      const result = await this.$u.api.getSearchSku(object);
      this.searchResult = {
        ...result,
        content: [...this.searchResult.content, ...result.content], // 将之前的数据于此时的数据合并
      };
    },
    // 下拉加载
    loadMore() {
      if (!this.searchResult.last) {
        this.filter.page += 1;
        this.getCategoryProduct();
      }
    },
  },
  computed: {
    ...mapState("categories", ["categories"]),
  },
  async mounted() {
    // 获取商品分类左侧菜单数据列表
    await this.getCategories();
    // 获取第一个商品分类菜单 id; 也就是切换到商品分类菜单时设置的默认值
    this.categoryId = this.categories[0].id;
    // 获取商品分类右侧的商品数据列表
    await this.getCategoryProduct();
  },
};
</script>

<style lang="scss" scoped>
.u-wrap {
  height: calc(100vh);
  /* #ifdef H5 */
  height: calc(100vh - var(--window-top));
  /* #endif */
  display: flex;
  flex-direction: column;
}

.u-search-box {
  padding: 18rpx 30rpx;
  .u-left-title {
    margin: 0 13rpx;
    margin-bottom: 10rpx;
  }
}

.u-menu-wrap {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.u-search-inner {
  background-color: rgb(234, 234, 234);
  border-radius: 100rpx;
  display: flex;
  flex: 1;
  margin-bottom: 10rpx;
  align-items: center;
  padding: 10rpx 16rpx;
}

.u-search-text {
  font-size: 26rpx;
  color: $u-tips-color;
  margin-left: 10rpx;
}

.u-tab-view {
  width: 200rpx;
  height: 100%;
}

.u-tab-item {
  height: 110rpx;
  background: #f6f6f6;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #444;
  font-weight: 400;
  line-height: 1;
}

.u-tab-item-active {
  position: relative;
  color: #000;
  font-size: 30rpx;
  font-weight: 600;
  background: #fff;
}

.u-tab-item-active::before {
  content: "";
  position: absolute;
  border-left: 4px solid $u-type-primary;
  height: 32rpx;
  left: 0;
  top: 39rpx;
}

.u-tab-view {
  height: 100%;
}

.right-box {
  background-color: rgb(250, 250, 250);
}

.page-view {
  padding: 16rpx;
}

.class-item {
  margin-bottom: 30rpx;
  background-color: #fff;
  padding: 16rpx;
  border-radius: 8rpx;
}

.class-item:last-child {
  min-height: 100vh;
}

.item-title {
  font-size: 26rpx;
  color: $u-main-color;
  font-weight: bold;
}

.item-menu-name {
  font-weight: normal;
  font-size: 24rpx;
  color: $u-main-color;
}

.item-container {
  display: flex;
  flex-wrap: wrap;
}

.thumb-box {
  width: 33.333333%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 20rpx;
}

.item-menu-image {
  width: 120rpx;
  height: 120rpx;
}
</style>
