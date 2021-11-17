// 异步操作
const actions = {
	async getHomeIndex(context) {
		let result = await this._vm.$u.api.getHomeIndex();
		context.commit("GETHOMEINDEX", result)
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
const getters = {}


export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
