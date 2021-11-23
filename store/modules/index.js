// 异步操作
const actions = {
	async getHomeIndex(context) {
		let result = await this._vm.$u.api.getHomeIndex();
		context.commit("GETHOMEINDEX", result)
		// 查看当前提货点的信息;  root: true 它允许在命名空间模块里分发根的 action。返回一个解析所有被触发的 action 处理器的 Promise。
		context.dispatch("pickUpLocation/changeLeaderAddressVo", result.leaderAddressVo, { root: true })
	}
}
// 修改数据
const mutations = {
	GETHOMEINDEX(state, result) {
		state.home = result
	}

}
// 设置状态
const state = {
	home: {}
}
// 获取内容
const getters = {
	categoryList(state) { // 商品分类
		return state.home.categoryList || [];
	},
	hotSkuList(state) { // 热销商品
		return state.home.hotSkuList || [];
	},
	leaderAddressVo(state) { // 提货点
		return state.home.leaderAddress || [];
	},
	newPersonSkuInfoList(state) { // 新人专享
		return state.home.newPersonSkuInfoList || [];
	},

	seckillTime(state) { // 秒杀时间
		return state.home.seckillTime || {}
	},

	seckillSkuVoList(state) { // 秒杀商品列表
		return state.home.seckillSkuVoList || []
	}


}


export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
