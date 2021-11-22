<template>
  <view class="gg-header">
    <view class="gg-header-location u-p-r-50" @click="show = true">
      <text class="u-p-r-10">{{ currentPickUpArea }}</text>
      <u-icon name="arrow-down-fill" color="gray" size="20"></u-icon>
    </view>
    <!-- 利用v-model操作，会造成searchKeyword对于父组件的二次重渲染问题 -->
    <u-search
      class="gg-header-search"
      input-align="left"
      height="70"
      :clearabled="false"
      :show-action="true"
      @search="search"
      @custom="search"
    ></u-search>
    <!-- 复制多列对象模式 -->
    <u-picker
      mode="selector"
      v-model="show"
      :default-selector="[0]"
      :range="findAllList"
      range-key="regionName"
      @confirm="findAllListConfirm"
    ></u-picker>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { BAIDU_MAP_AK } from "../../common/const";
// 引用百度地图微信小程序JSAPI模块
var bmap = require("../../common/bmap-wx.min");
var BMap = new bmap.BMapWX({
  ak: BAIDU_MAP_AK,
});
export default {
  name: "PickUpLocationHeader",
  props: ["searchKeyword"], // 将子组件的搜索关键字传给父组件要用
  data() {
    return {
      show: false,
      latitude: "", // 纬度
      longitude: "", // 经度
    };
  },
  methods: {
    ...mapActions("pickUpLocation", ["getSysRegionFindAllList"]),
    // 选择器点击确认按钮时调用该函数
    findAllListConfirm(index) {
      // 发起geocoding检索请求
      BMap.geocoding({
        address: this.findAllList[index],
        fail: (error) => {
          console.log(error);
        },
        success: (data) => {
          let wxMarkerData = data.wxMarkerData;
          this.latitude = wxMarkerData[0].latitude; // 纬度等于地点的纬度
          this.longitude = wxMarkerData[0].longitude; // 经度等于地点的经度
          // 将经纬度通过自定义事件子传父; 通过父组件查询数据
          this.$emit("getSearchLeader", {
            location: this.latitude,
            longitude: this.longitude,
          });
        },
      });
    },
    // 搜索框事件回调
    search(value) {
      if (value && value.trim().length > 0) {
        // 发起geocoding检索请求
        BMap.geocoding({
          address: value,
          fail: (error) => {
            console.log(error);
          },
          success: (data) => {
            let wxMarkerData = data.wxMarkerData;
            this.latitude = wxMarkerData[0].latitude; // 纬度等于地点的纬度
            this.longitude = wxMarkerData[0].longitude; // 经度等于地点的经度
            // 将经纬度通过自定义事件子传父; 通过父组件查询数据
            this.$emit("getSearchLeader", {
              location: this.latitude,
              longitude: this.longitude,
            });
            console.log(this.latitude, this.longitude);
          },
        });
      }
    },
  },
  computed: {
    ...mapState("pickUpLocation", ["findAllList", "currentPickUpArea"]),
  },
  mounted() {
    // 获取提货点接口函数
    this.getSysRegionFindAllList();
  },
};
</script>

<style lang="scss" scoped>
.gg {
  &-header {
    display: flex;
    justify-content: center;
    align-items: center;

    &-location {
      text {
        color: gray;
      }
    }

    &-search {
      flex: 1;
    }
  }
}
</style>
