<template>
	<view class="content">
		<u-button type="primary">主要按钮</u-button>
		<view>时间为：{{ $u.timeFormat(timestamp, 'yyyy年mm月dd日') }}</view>
		<view>时间为：{{ time }}</view>
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: 'Hello',
			time: null,
			timestamp: '1581170184'
		};
	},
	onLoad() {
		// 时间工具的使用
		this.time = this.$u.timeFormat(this.timestamp, 'yyyy-mm-dd');
		// 请求工具的使用
		this.$u.get('https://jsonplaceholder.typicode.com/posts/1').then(res => {
			console.log(res);
		});
	}
};
</script>
<style lang="scss">
* {
	background: #007aff;
}
	
.content {
	background-color: pink;
}
</style>
