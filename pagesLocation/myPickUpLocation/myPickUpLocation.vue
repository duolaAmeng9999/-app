<template>
  <view>
    <PickupLocationHeader
      @getSearchLeader="getSearchLeader"
    ></PickupLocationHeader>
    <view v-if="!leaderAddressVo" class="gg-current-location-container">
      <PickupLocationHeader :location="leaderAddressVo"> </PickupLocationHeader>
    </view>
    
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "myPickUpLocation",
  data() {
    return {
      searchKeyword: "", // 父组件用到子组件搜素关键字
    };
  },
  methods: {
    // 自定义事件接受子组件传递过来的经纬度数据
    getSearchLeader({ location, longitude }) {},
  },
  computed: {
    ...mapState("pickUpLocation", ["leaderAddressVo"]),
  },
};
</script>

<style lang="scss" scoped>
</style>