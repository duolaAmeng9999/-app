const pickUpLocation = {
    namespaced: true,
    actions: {
        // 提货点接口
        async getSysRegionFindAllList(context) {
            const result = await this._vm.$u.api.getSysRegionFindAllList();
            await context.commit("GET_SYS_REGION_FINDALL_LIST", result);
            await context.commit("CURRENTPICKUPAREA", result);
        },
        // 当前提货点   
        changeLeaderAddressVo(context, result) {
            context.commit("CHANGE_LEADER_ADDRESS_VO", result)
        },
        // 选择提货点
        async getSelectLeader({ commit, dispatch }, payload) {
            const result = await this._vm.$u.api.getSelectLeader(payload);
            dispatch("indexModule/getHomeIndex", {}, { root: true })
        }
    },
    mutations: {
        // 提货点信息
        GET_SYS_REGION_FINDALL_LIST(state, result) {
            state.findAllList = result;
        },
        // 设置默认提货点
        CURRENTPICKUPAREA(state, result) {
            state.currentPickUpArea = result[0].regionName
        },
        // 修改当前提货点
        CHANGE_LEADER_ADDRESS_VO(state, result) {
            state.leaderAddressVo = result
        },
        // 修改头部显示提货点信息
        SET_CURRENT_PICKUPLOCATION(state, result) {
            state.currentPickUpArea = result.regionName
        }
    },
    state: {
        currentPickUpArea: "", // 当前提货点
        findAllList: [], // 指定提货点区域列表
        leaderAddressVo: "", // 当前提货点
    },
    getters: {
        // 选择提货点
        checkIsCurrent(state) {
            return function (id) {
                // 利用上次选中的提货点的 id 进行判断; 页面加载时就会有默认值
                if (state.leaderAddressVo) {
                    // 判断选中的提货点的 id 是否和数据中的 id 相等; 返回 ture/false
                    return state.leaderAddressVo.leaderId === id;
                } else {
                    return false
                }
            }
        }
    },
}
export default pickUpLocation