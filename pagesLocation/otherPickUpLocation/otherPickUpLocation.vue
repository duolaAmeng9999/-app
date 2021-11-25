<template>
  <view class="gg u-p-20">
    <!-- 利用 .sync 事件修饰符, 将 searchKeyword 从父组件传入子组件 -->
    <PickupLocationHeader
      @getSearchLeader="getSearchLeader"
      :searchKeyword.sync="searchKeyword"
    ></PickupLocationHeader>
    <u-gap height="20"></u-gap>
    <map
      id="pickUpLocationMap"
      class="gg-location-map"
      show-location
      :longitude="longitude"
      :latitude="latitude"
      :scale="scale"
      :markers="covers"
      @markertap="mapMarkertap"
    ></map>
    <view class="gg-location">
      <scroll-view
        scroll-y
        :scroll-into-view="`map-${markerId}`"
        scroll-with-animation
        @scrolltolower="loadMore"
        class="gg-location-scroll"
      >
        <block v-if="searchResult.content.length > 0">
          <view
            class="u-m-b-20"
            v-for="item in searchResult.content"
            :key="item.id"
            :id="`map-${item.id}`"
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
    </view>
    <view class="gg-confirm-pick-up-location"
      ><u-button type="warning">确认提货点</u-button></view
    >
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "otherPickUpLocation",
  data() {
    return {
      searchKeyword: "", // 搜索关键字
      markerId: 0, // 当前选中标记
      /*   longitude: 120.379109,
      latitude: 36.099528, */
      scale: 12, // 地图的缩放级别
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
      scale: 12, // 地图缩放级别
      // 标记点
      covers: [
        {
          longitude: 120.379109, // 标记点的经度
          latitude: 36.099528, // 标记点的纬度
          iconPath: "/static/images/location.png", // 标记点的图标
          width: 30, // 标记点的宽高
          height: 30,
        },
      ],
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
      if (this.searchResult.length > 0) {
        let covers = [];
        this.searchResult.map((item) => {
          covers.push({
            id: item.id,
            longitude: item.longitude,
            latitude: item.latitude,
            icon: "/static/images/location.png",
            width: 30,
            height: 30,
          });
          this.covers = covers;
          let longitude = this.searchResult.content[0].location.lat;
          let latitude = this.searchResult.content[0].location.lon;
          this.pickUpLocationMapCtx.moveToLocation({ longitude, latitude });
          this.scale = 12;
        });
      }
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
	 // 标记点点击操作
    mapMarkertap({ detail: { markerId } }) {
      this.markerId = markerId;
    },
    // 选择提货点
    selectPickUpLocation(leaderId) {
      this.selectLeaderAddressVoAction({ leaderId });
    },
  },
  mounted() {
    // 获取当前的地理位置、速度
    uni.getLocation({
      // gcj02 返回国测局坐标
      type: "gcj02",
      // 成功获取当前位置的坐标, res 为当前位置得相关数据
      success: async (res) => {
        this.covers[0]["longitude"] = res.longitude; // 更改标记点的经度
        this.covers[0]["latitude"] = res.latitude; // 更改标记点的纬度
        // 使用 try cath 来捕获错误, 此接口返回的就是错误的数据
        try {
          // 调用根据经纬度获取地址信息的接口, 需要所需的经纬度
          let result = await this.$u.api.getBaiduMapAddress({
            latitude: res.latitude,
            longitude: res.longitude,
          });
        } catch (error) {
          // 根据后台返回的数据将经纬度转换为地点字符串; 数据的双向绑定, 搜索框里的内容发生更改
          this.searchKeyword = error.result.formatted_address;
        }
        // 自动对焦到搜索地点
        this.pickUpLocationMapCtx.moveToLocation();
      },
    });
  },
  computed: {
    ...mapState("pickUpLocation", ["leaderAddressVo"]),
    // 选择器选择的提货点, 传入选中的 id 值
    ...mapGetters("pickUpLocation", ["checkIsCurrent"]),
  },
  onReady: function () {
    // 创建并返回 map 上下文 mapContext 对象
    // mapContext 通过 mapId 跟一个 <map> 组件绑定，通过它可以操作对应的 <map> 组件。
    this.pickUpLocationMapCtx = uni.createMapContext("pickUpLocationMap");
  },
};
</script>

<style lang="scss" scoped>
.gg {
  display: flex;
  flex-direction: column;

  /*  地图设置  */
  &-location-map {
    width: 100%;
    height: calc(100vh - 120rpx - 400rpx - 140rpx);
  }

  /* 滚动区域 */
  &-location {
    padding: 20rpx 20rpx 20rpx 20rpx;
    &-scroll {
      height: 400rpx;
    }
  }
}
</style>