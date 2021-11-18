<template>
  <view class="gg-header">
    <view class="gg-header-location u-p-r-50" @click="show = true">
      <text class="u-p-r-10">当前区域</text>
      <u-icon name="arrow-down-fill" color="gray" size="20"></u-icon>
    </view>
    <!-- 利用v-model操作，会造成searchKeyword对于父组件的二次重渲染问题 -->
    <u-search
      v-model="searchKeyword"
      class="gg-header-search"
      input-align="left"
      height="70"
      :clearabled="false"
      :show-action="true"
    ></u-search>
    <!-- 复制多列对象模式 -->
    <u-picker
      mode="selector"
      v-model="show"
      :default-selector="[0]"
      :range="selectorObj"
      range-key="cateName"
    ></u-picker>
  </view>
</template>

<script>
export default {
  name: "PickUpLocationHeader",
  props: ["searchKeyword"],
  data() {
    return {
      show: false,
      // 这种情况需要指定range-key为cateName，否则组件不知道该显示对象的哪个属性
      selectorObj: [
        {
          cateName: "1",
          id: 1,
        },
        {
          cateName: "2",
          id: 2,
        },
      ],
    };
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
