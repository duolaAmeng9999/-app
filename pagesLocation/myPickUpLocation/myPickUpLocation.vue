<template>
  <view class="gg u-p-20">
    <PickupLocationHeader
      @getSearchLeader="getSearchLeader"
    ></PickupLocationHeader>
    <view v-if="leaderAddressVo" class="gg-current-location-container u-m-t-20">
      <PickUpLocationItem :location="leaderAddressVo"> </PickUpLocationItem>
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
          <PickUpLocationItem :location="item"></PickUpLocationItem>
        </view>
      </block>
      <u-empty mode="list" v-else></u-empty>
    </scroll-view>
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
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
      console.log(object);
      // 调用提货点接口
      let result = await this.$u.api.getSearchLeader(object);

      this.searchResult = {
        ...result,
        content: [...this.searchResult.content, ...result.content],
      };
    },
    loadMore() {
      if (!this.searchResult.last) {
        this.filter.page += 1;
        this.getSearchLeader();
      }
    },
  },
  computed: {
    ...mapState("pickUpLocation", ["leaderAddressVo"]),
  },
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