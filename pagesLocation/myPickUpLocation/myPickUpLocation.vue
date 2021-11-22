<template>
  <view>
    <PickupLocationHeader
      @getSearchLeader="getSearchLeader"
    ></PickupLocationHeader>
  </view>
</template>

<script>
export default {
  name: "myPickUpLocation",
  data() {
    return {
      searchKeyword: "", // 父组件用到子组件搜素关键字
    };
  },
  methods: {
    // 自定义事件接受子组件传递过来的经纬度数据
    getSearchLeader({ location, longitude }) {
    },
  },
};
</script>

<style lang="scss" scoped>
</style>