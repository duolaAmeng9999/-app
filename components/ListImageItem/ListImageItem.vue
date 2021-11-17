<template>
  <view class="image" :style="[{ width: widht, height: height }]">
    <u-image
      :width="width"
      :height="height"
      :src="src"
      :lazy-load="lazyLoad"
      :border-radius="borderRadius"
    ></u-image>
  </view>
</template>

<script>
export default {
  name: "ListImageItem",
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "120rpx",
    },
    src: {
      type: String,
      default: "",
    },
    lazyLoad: {
      type: Boolean,
      default: true,
    },
    borderRadius: {
      type: String,
      default: "20rpx",
    },
  },
};
</script>

<style lang="scss" scoped>
</style>