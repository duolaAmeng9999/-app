<template>
  <view class="gg u-p-20">
    <PickupLocationHeader
      @getSearchLeader="getSearchLeader"
    ></PickupLocationHeader>
    <view v-if="leaderAddressVo" class="gg-current-location-container u-m-t-20">
      <PickUpLocationItem
        :location="leaderAddressVo"
        :isCurrent="checkIsCurrent(leaderAddressVo.leaderId)"
      >
      </PickUpLocationItem>
    </view>
    <scroll-view
      scroll-y
      @scrolltolower="loadMore"
      class="gg-location-sv-container"
    >
      <block v-if="searchResult.content.length > 0">
        <view
          class="u-m-b-20"
          v-for="item in searchResult.content"
          :key="item.id"
        >
          {{ item.detailAddress }}
          <PickUpLocationItem
            :location="item"
            :isCurrent="checkIsCurrent(item.id)"
            @selectPickUpLocation="selectPickUpLocation"
          ></PickUpLocationItem>
        </view>
      </block>
      <u-empty mode="list" v-else></u-empty>
    </scroll-view>
    <u-button @click="otherPickUpLocation" type="warning"
      >搜索并选择其它提货点</u-button
    >
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "myPickUpLocation",
  data() {
    return {
      filter: {
        page: 1, // 当前的页码
        limit: 5, // 连续页码数
        latitude: "", // 经度
        longitude: "", // 纬度
      },
      searchResult: {
        content: [], // 搜索的结果
        last: false, // 判断是否为最后一页
      },
    };
  },
  methods: {
    // 仓库中的选择提货点映射
    ...mapActions("pickUpLocation", ["getSelectLeader"]),
    // 自定义事件接受子组件传递过来的经纬度数据; 来获取提货点的信息
    async getSearchLeader(data) {
      // 数据收并赋值于 data 中的数据
      /*  this.filter.latitude = latitude ? latitude : this.filter.latitude;
      this.filter.longitude = longitude ? longitude : this.filter.longitude; */
      this.filter.latitude = data ? data.latitude : this.filter.latitude;
      this.filter.longitude = data ? data.longitude : this.filter.longitude;
      // 整理后台接口需要返沪的数据
      let object = {
        latitude: this.filter.latitude,
        longitude: this.filter.longitude,
        page: this.filter.page,
        limit: this.filter.limit,
      };
      // 调用提货点接口
      let result = await this.$u.api.getSearchLeader(object);
      // 将 data 中的旧数据进行替换
      this.searchResult = {
        ...result,
        content: [...this.searchResult.content, ...result.content],
      };
    },
    // 滚动到底部，会触发 loadMore 事件, 下拉加载
    loadMore() {
      // 使用后台接返回的 last 进行判断是否为最后一页
      if (!this.searchResult.last) {
        this.filter.page += 1;
        this.getSearchLeader();
      }
    },
    // 选择提货点; 传入选择提货点的 id;
    // 自定义事件的回调函数; 将子组件到的所选中的提货点的 id 传父组件; 进行接口的调用
    selectPickUpLocation(leaderId) {
      if (leaderId) {
        // 调用选择提货点接口传入所选中的 id
        return this.getSelectLeader({ leaderId });
      }
    },
    // 点击按钮跳转到其他提货点
    otherPickUpLocation() {
      // 跳转到其他页面并可以返回
      uni.navigateTo({
        url: "/pagesLocation/otherPickUpLocation/otherPickUpLocation",
      });
    },
  },
  computed: {
    ...mapState("pickUpLocation", ["leaderAddressVo"]),
    // 选择器选择的提货点, 传入选中的 id 值
    ...mapGetters("pickUpLocation", ["checkIsCurrent"]),
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.gg {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  &-current-location-container {
    flex: 1;
  }

  &-location-sv-container {
    height: calc(100vh - 450rpx);
  }
}
</style>