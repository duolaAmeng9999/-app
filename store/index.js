import Vue from 'vue'
import Vuex from 'vuex'
// 引入分仓库
import indexModule from './modules/index'
import pickUpLocation from "./modules/pickUpLocation"
// 使用第三方插件来将仓库的数据进行本地化存储 
import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex);

export default new Vuex.Store({
	// 本地持久化存储, 因为每次切换后 state 中的数据就会不存在
	plugins: [
		createPersistedState({
			storage: {
				getItem: key => uni.getStorageSync(key),
				setItem: (key, value) => {
					uni.setStorageSync(key, value)
				},
				removeItem: key => uni.removeStorageSync(key)
			}
		})
	],
	modules: {
		indexModule,
		pickUpLocation
	},
})
