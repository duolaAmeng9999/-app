const pickUpLocation = {
    namespaced: true,
    actions: {
        // 提货点接口
        async getSysRegionFindAllList(context) {
            const result = await this._vm.$u.api.getSysRegionFindAllList();
            await context.commit("GET_SYS_REGION_FINDALL_LIST", result);
            await context.commit("CURRENTPICKUPAREA", result);
        }

    },
    mutations: {
        // 提货点信息
        GET_SYS_REGION_FINDALL_LIST(state, result) {
            state.findAllList = result;
        },
        CURRENTPICKUPAREA(state, result) { // 设置默认提货点
            state.currentPickUpArea = result[0].regionName
        }
    },
    state: {
        currentPickUpArea: "", // 当前提货点
        findAllList: [], // 指定提货点区域列表
    },
    getters: {},
}
export default pickUpLocation